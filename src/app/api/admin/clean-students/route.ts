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

    return NextResponse.json({
      success: true,
      message: `Pruned database to 5 students. Deleted ${deletedCount} extra records.`,
      remaining: Math.min(5, all.length),
    });
  } catch (error) {
    console.error('Failed to prune database:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
