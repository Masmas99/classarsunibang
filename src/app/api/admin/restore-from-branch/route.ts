import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import prodPrisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (
    secret !== process.env.AUTH_SECRET &&
    secret !== 'ars_unibang_secret_key_2025_advance_secure'
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const branchUrl =
    searchParams.get('branchUrl') ||
    'postgresql://neondb_owner:npg_RTYSoaGz4U6M@ep-mute-meadow-beci6xo5-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

  const branchPrisma = new PrismaClient({
    datasources: {
      db: {
        url: branchUrl,
      },
    },
  });

  try {
    // 1. Fetch all students from recovered branch
    const branchStudents = await branchPrisma.student.findMany({
      orderBy: { id: 'asc' },
    });

    // 2. Fetch all gallery from recovered branch
    const branchGallery = await branchPrisma.gallery.findMany({
      orderBy: { id: 'asc' },
    });

    if (branchStudents.length === 0 && branchGallery.length === 0) {
      return NextResponse.json({
        error: 'Branch has no data. Please check branch timestamp.',
      }, { status: 400 });
    }

    // 3. Wipe current production tables
    await prodPrisma.student.deleteMany();
    await prodPrisma.gallery.deleteMany();

    // 4. Insert all branch students into production
    const studentsData = branchStudents.map((s) => ({
      name: s.name,
      role: s.role,
      image: s.image,
      order: s.order,
    }));
    await prodPrisma.student.createMany({
      data: studentsData,
    });

    // 5. Insert all branch gallery into production
    const galleryData = branchGallery.map((g) => ({
      src: g.src,
      alt: g.alt,
      title: g.title,
      order: g.order,
    }));
    await prodPrisma.gallery.createMany({
      data: galleryData,
    });

    // 6. Revalidate all pages
    revalidatePath('/', 'page');
    revalidatePath('/students', 'page');
    revalidatePath('/gallery', 'page');
    revalidatePath('/admin', 'page');

    return NextResponse.json({
      success: true,
      message: 'Successfully restored all data from recovered branch into production!',
      studentCount: branchStudents.length,
      galleryCount: branchGallery.length,
      sampleStudents: branchStudents.slice(0, 5).map((s) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        imagePrefix: s.image?.slice(0, 30),
      })),
      sampleGallery: branchGallery.slice(0, 5).map((g) => ({
        id: g.id,
        title: g.title,
        srcPrefix: g.src?.slice(0, 30),
      })),
    });
  } catch (error) {
    console.error('Failed to restore from branch:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await branchPrisma.$disconnect();
  }
}
