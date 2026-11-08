import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { optimizeToWebP } from '@/lib/image-utils';

// Public GET: List all students sorted A-Z (case-insensitive)
export async function GET() {
  try {
    const students = await prisma.student.findMany();

    // Sort alphabetically A to Z (case-insensitive)
    students.sort((a, b) =>
      a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
    );

    return NextResponse.json(students, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data mahasiswa' },
      { status: 500 }
    );
  }
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
