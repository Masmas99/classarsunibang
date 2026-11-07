const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const prisma = new PrismaClient();

async function migrateDb() {
  console.log("Migrating database image references to WebP...");

  // 1. Students
  const students = await prisma.student.findMany();
  for (const s of students) {
    let newImg = s.image;
    if (newImg && newImg.includes('/images/students/student-1.jpg')) {
      newImg = newImg.replace('student-1.jpg', 'student-1.webp');
    } else if (newImg && newImg.startsWith('data:image/')) {
      try {
        const matches = newImg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches[2]) {
          const buffer = Buffer.from(matches[2], 'base64');
          const webpBuffer = await sharp(buffer)
            .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          newImg = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
          console.log(`Converted base64 image for student "${s.name}" from ${matches[1]} (${(s.image.length/1024).toFixed(1)} KB) to webp (${(newImg.length/1024).toFixed(1)} KB)`);
        }
      } catch (err) {
        console.error(`Failed to convert student ${s.name} base64:`, err.message);
      }
    }

    if (newImg !== s.image) {
      await prisma.student.update({
        where: { id: s.id },
        data: { image: newImg },
      });
      console.log(`Updated student ${s.name} image -> ${newImg.slice(0, 45)}...`);
    }
  }

  // 2. Gallery
  const gallery = await prisma.gallery.findMany();
  for (const g of gallery) {
    let newSrc = g.src;
    if (newSrc && newSrc.includes('.jpg')) {
      newSrc = newSrc.replace(/\.jpg$/, '.webp');
    } else if (newSrc && newSrc.startsWith('data:image/')) {
      try {
        const matches = newSrc.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches[2]) {
          const buffer = Buffer.from(matches[2], 'base64');
          const webpBuffer = await sharp(buffer)
            .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          newSrc = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
          console.log(`Converted base64 image for gallery "${g.title}"`);
        }
      } catch (err) {
        console.error(`Failed to convert gallery ${g.title} base64:`, err.message);
      }
    }

    if (newSrc !== g.src) {
      await prisma.gallery.update({
        where: { id: g.id },
        data: { src: newSrc },
      });
      console.log(`Updated gallery "${g.title}" src -> ${newSrc.slice(0, 45)}...`);
    }
  }

  console.log("Database migration to WebP completed!");
}

migrateDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
