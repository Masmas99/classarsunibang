const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImages() {
  const students = await prisma.student.findMany();
  console.log(`Total students: ${students.length}`);
  let count = 0;

  for (const s of students) {
    const img = (s.image || '').trim();
    if (!img || img === '.' || img === '/' || img === '-' || img === 'null') {
      await prisma.student.update({
        where: { id: s.id },
        data: { image: '/images/students/student-1.webp' },
      });
      count++;
    }
  }

  console.log(`Fixed ${count} students with default avatar (/images/students/student-1.webp)`);
}

fixImages()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
