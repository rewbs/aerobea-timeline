import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { serializeCountryRecord } from '../../../lib/serialize';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
    });

    const serialized = countries.map(serializeCountryRecord);

    return NextResponse.json({ countries: serialized });
  } catch (error) {
    console.error('[countries GET] Failed to load countries', error);
    return NextResponse.json(
      { error: 'Failed to load countries' },
      { status: 500 }
    );
  }
}
