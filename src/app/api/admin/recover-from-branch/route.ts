import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    const students = await branchPrisma.student.findMany({
      orderBy: { id: 'asc' },
    });

    const gallery = await branchPrisma.gallery.findMany({
      orderBy: { id: 'asc' },
    });

    // Check statistics of data
    const studentRoles = new Set(students.map((s) => s.role));
    const sampleStudents = students.slice(0, 10).map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      imageType: s.image?.startsWith('data:') ? 'base64' : s.image?.slice(0, 30),
      imageLength: s.image?.length || 0,
    }));

    const sampleGallery = gallery.map((g) => ({
      id: g.id,
      title: g.title,
      srcType: g.src?.startsWith('data:') ? 'base64' : g.src?.slice(0, 30),
      srcLength: g.src?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      studentCount: students.length,
      studentRoles: Array.from(studentRoles),
      galleryCount: gallery.length,
      sampleStudents,
      sampleGallery,
    });
  } catch (error) {
    console.error('Branch query error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await branchPrisma.$disconnect();
  }
}
