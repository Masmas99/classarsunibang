import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Protected PUT: Update gallery photo
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
    const galleryId = parseInt(id, 10);
    if (isNaN(galleryId)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const body = await request.json();
    const { src, alt, title, order } = body;

    const updatedItem = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        ...(src !== undefined && { src }),
        ...(alt !== undefined && { alt }),
        ...(title !== undefined && { title: title.trim() }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data galeri' },
      { status: 500 }
    );
  }
}

// Protected DELETE: Remove gallery photo
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
    const galleryId = parseInt(id, 10);
    if (isNaN(galleryId)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    await prisma.gallery.delete({
      where: { id: galleryId },
    });

    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json({ success: true, message: 'Foto galeri berhasil dihapus' });
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus foto galeri' },
      { status: 500 }
    );
  }
}
