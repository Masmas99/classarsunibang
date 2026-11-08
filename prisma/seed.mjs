import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialStudents = [
  { name: 'Nurul Hidayah', role: 'Ketua Kelas', image: '/images/students/student-1.webp', order: 1 },
  { name: 'Ahmad Fauzi', role: 'Wakil Ketua Kelas', image: '/images/students/student-1.webp', order: 2 },
  { name: 'Siti Rahma', role: 'Sekretaris 1', image: '/images/students/student-1.webp', order: 3 },
  { name: 'Dewi Lestari', role: 'Bendahara 1', image: '/images/students/student-1.webp', order: 4 },
  { name: 'Dimas Saputra', role: 'Divisi Humas', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', order: 5 },
];

const initialGallery = [
  { src: '/images/gallery/hero-ars-1.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 1', title: 'Kebersamaan Kelas ARS UNIBANG', order: 1 },
  { src: '/images/gallery/hero-ars-2.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 2', title: 'Kompak di Depan Kampus', order: 2 },
  { src: '/images/gallery/hero-ars-3.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 3', title: 'Sesi Diskusi & Santai Sore', order: 3 },
  { src: '/images/gallery/hero-ars-4.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 4', title: 'Foto Angkatan Penuh Semangat', order: 4 },
  { src: '/images/gallery/hero-ars-5.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 5', title: 'Momen Ceria Bersama Dosen', order: 5 },
  { src: '/images/gallery/hero-ars-1.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 6', title: 'Solidaritas Tanpa Batas', order: 6 },
  { src: '/images/gallery/hero-ars-2.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 7', title: 'Workshop & Praktikum Kesehatan', order: 7 },
  { src: '/images/gallery/hero-ars-3.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 8', title: 'Kegiatan Sosial & Pengabdian', order: 8 },
  { src: '/images/gallery/hero-ars-4.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 9', title: 'Kunjungan Rumah Sakit Mitra', order: 9 },
  { src: '/images/gallery/hero-ars-5.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 10', title: 'Keseruan Setelah Ujian Akhir', order: 10 },
  { src: '/images/gallery/hero-ars-1.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 11', title: 'Persiapan Acara Dies Natalis', order: 11 },
  { src: '/images/gallery/hero-ars-2.jpg', alt: 'Dokumentasi Kelas ARS UNIBANG 12', title: 'Kenangan Tak Terlupakan ARS', order: 12 },
];

async function main() {
  console.log('Seeding Neon PostgreSQL...');

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
  const studentCount = await prisma.student.count();
  if (studentCount === 0) {
    for (const s of initialStudents) {
      await prisma.student.create({ data: s });
    }
    console.log(`Created ${initialStudents.length} students.`);
  } else {
    console.log(`Students already present (${studentCount}).`);
  }

  // 3. Gallery
  const galleryCount = await prisma.gallery.count();
  if (galleryCount === 0) {
    for (const g of initialGallery) {
      await prisma.gallery.create({ data: g });
    }
    console.log(`Created ${initialGallery.length} gallery items.`);
  } else {
    console.log(`Gallery items already present (${galleryCount}).`);
  }

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
