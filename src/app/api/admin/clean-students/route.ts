import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const all = await prisma.student.findMany({ orderBy: { id: 'asc' } });
    let deletedCount = 0;
    if (all.length > 5) {
      const toDelete = all.slice(5).map((s) => s.id);
      const res = await prisma.student.deleteMany({
        where: { id: { in: toDelete } },
      });
      deletedCount = res.count;
    }

    // Clean base64 from the remaining students
    for (const s of all.slice(0, 5)) {
      if (s.image && (s.image.startsWith('data:') || s.image.length > 500)) {
        await prisma.student.update({
          where: { id: s.id },
          data: { image: '/images/students/student-1.webp' },
        });
      }
    }

    // Clean base64 from gallery items
    const galleries = await prisma.gallery.findMany();
    let cleanedGalleries = 0;
    for (const g of galleries) {
      if (g.src && (g.src.startsWith('data:') || g.src.length > 500)) {
        const fallbackIndex = ((Math.abs(g.id) - 1) % 5) + 1;
        await prisma.gallery.update({
          where: { id: g.id },
          data: { src: `/images/gallery/hero-ars-${fallbackIndex}.webp` },
        });
        cleanedGalleries++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Pruned database: ${deletedCount} students deleted, ${cleanedGalleries} gallery images sanitized.`,
      remainingStudents: Math.min(5, all.length),
      remainingGalleries: galleries.length,
    });
  } catch (error) {
    console.error('Failed to prune database:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
