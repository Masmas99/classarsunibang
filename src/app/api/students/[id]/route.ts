import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { optimizeToWebP } from '@/lib/image-utils';

// Protected PUT: Update student
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const studentId = parseInt(id, 10);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const body = await request.json();
    const { name, role, image, order } = body;

    const optimizedImage = image !== undefined ? await optimizeToWebP(image, 800, 80) : undefined;

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(role !== undefined && { role: role.trim() }),
        ...(optimizedImage !== undefined && { image: optimizedImage }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    revalidatePath('/');
    revalidatePath('/students');

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Failed to update student:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui mahasiswa' },
      { status: 500 }
    );
  }
}

// Protected DELETE: Remove student
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const studentId = parseInt(id, 10);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    await prisma.student.delete({
      where: { id: studentId },
    });

    revalidatePath('/');
    revalidatePath('/students');

    return NextResponse.json({ success: true, message: 'Mahasiswa berhasil dihapus' });
  } catch (error) {
    console.error('Failed to delete student:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus mahasiswa' },
      { status: 500 }
    );
  }
}
