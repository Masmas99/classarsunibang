import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { INITIAL_STUDENTS, INITIAL_GALLERY } from '@/lib/initial-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (
    secret !== process.env.AUTH_SECRET &&
    secret !== 'ars_unibang_secret_key_2025_advance_secure'
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Wipe and re-insert all 101 students
    await prisma.student.deleteMany();
    const studentsData = INITIAL_STUDENTS.map((s) => ({
      name: s.name,
      role: s.role,
      image: s.image,
      order: s.order,
    }));
    await prisma.student.createMany({
      data: studentsData,
    });

    // 2. Wipe and re-insert all 13 gallery items
    await prisma.gallery.deleteMany();
    const galleryData = INITIAL_GALLERY.map((g) => ({
      src: g.src,
      alt: g.alt,
      title: g.title,
      order: g.order,
    }));
    await prisma.gallery.createMany({
      data: galleryData,
    });

    // 3. Revalidate paths
    revalidatePath('/', 'page');
    revalidatePath('/students', 'page');
    revalidatePath('/gallery', 'page');
    revalidatePath('/admin', 'page');

    return NextResponse.json({
      success: true,
      message: 'Successfully restored all 101 students and all 13 gallery items.',
      studentCount: INITIAL_STUDENTS.length,
      galleryCount: INITIAL_GALLERY.length,
    });
  } catch (error) {
    console.error('Failed to restore data:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
