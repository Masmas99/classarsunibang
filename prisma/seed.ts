import { PrismaClient } from '@prisma/client';
import { INITIAL_STUDENTS, INITIAL_GALLERY } from '../src/lib/initial-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database on Neon...');

  // 1. Admin
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: 'arsadmin2025' },
    create: {
      username: 'admin',
      password: 'arsadmin2025',
    },
  });
  console.log('Admin ready:', admin.username);

  // 2. Students
  await prisma.student.deleteMany();
  for (const s of INITIAL_STUDENTS) {
    await prisma.student.create({
      data: {
        name: s.name,
        role: s.role,
        image: s.image,
        order: s.order,
      },
    });
  }
  console.log(`Seeded ${INITIAL_STUDENTS.length} students.`);

  // 3. Gallery
  await prisma.gallery.deleteMany();
  for (const g of INITIAL_GALLERY) {
    await prisma.gallery.create({
      data: {
        src: g.src,
        alt: g.alt,
        title: g.title,
        order: g.order,
      },
    });
  }
  console.log(`Seeded ${INITIAL_GALLERY.length} gallery items.`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
