import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { optimizeToWebP } from '@/lib/image-utils';
import { INITIAL_STUDENTS } from '@/lib/initial-data';

// Public GET: List all students sorted A-Z (case-insensitive)
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { id: 'asc' },
    });

    if (students && students.length > 0) {
      const sanitized = students.map((s) => ({
        ...s,
        image:
          s.image && !s.image.startsWith('data:') && s.image.length < 500
            ? s.image
            : '/images/students/student-1.webp',
      }));

      // Sort alphabetically A to Z (case-insensitive)
      sanitized.sort((a, b) =>
        a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
      );

      return NextResponse.json(sanitized, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
  } catch (error) {
    console.error('Failed to fetch students from DB, using fallback:', error);
  }

  const fallback = INITIAL_STUDENTS.map((s) => ({
    ...s,
  })).sort((a, b) =>
    a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
  );

  return NextResponse.json(fallback, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

// Protected POST: Add new student
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, image } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Nama dan peran (role) wajib diisi' },
        { status: 400 }
      );
    }

    const cleanImage =
      !image ||
      image === '.' ||
      image === '/' ||
      image.trim() === '' ||
      image.trim() === '-'
        ? '/images/students/student-1.webp'
        : image;

    const optimizedImage = await optimizeToWebP(
      cleanImage,
      800,
      80
    );

    const newStudent = await prisma.student.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        image: optimizedImage,
        order: 0,
      },
    });

    revalidatePath('/');
    revalidatePath('/students');

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Failed to create student:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan mahasiswa' },
      { status: 500 }
    );
  }
}
