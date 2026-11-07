import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { optimizeToWebP } from '@/lib/image-utils';

// Public GET: List all gallery photos
export async function GET() {
  try {
    const galleryItems = await prisma.gallery.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(galleryItems, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data galeri' },
      { status: 500 }
    );
  }
}

// Protected POST: Add new gallery photo
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { src, alt, title } = body;

    if (!src || !title) {
      return NextResponse.json(
        { error: 'Foto (src) dan judul (title) wajib diisi' },
        { status: 400 }
      );
    }

    const optimizedSrc = await optimizeToWebP(
      src || '/images/gallery/hero-ars-1.webp',
      1200,
      80
    );

    const newItem = await prisma.gallery.create({
      data: {
        src: optimizedSrc,
        alt: alt || title,
        title: title.trim(),
        order: 0,
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Failed to create gallery item:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan foto galeri' },
      { status: 500 }
    );
  }
}
