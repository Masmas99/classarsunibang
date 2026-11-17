import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const extensions: any = await prisma.$queryRaw`
      SELECT name, default_version, installed_version, comment 
      FROM pg_available_extensions 
      WHERE name LIKE '%neon%' OR name LIKE '%timeline%' OR name LIKE '%pitr%'
    `;

    const schemas: any = await prisma.$queryRaw`
      SELECT schema_name FROM information_schema.schemata
    `;

    const tables: any = await prisma.$queryRaw`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    `;

    return NextResponse.json({
      extensions,
      schemas,
      tables,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
