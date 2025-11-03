import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { serializeCountryRecord } from '../../lib/serialize';
import { Country } from '@prisma/client/edge';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
    });

    // Serialize all countries with their presidents and monarchs
    const data = countries.map((country : Country) => serializeCountryRecord(country));

    return NextResponse.json({ countries: data });
  } catch (error) {
    console.error('[api GET] Failed to load data', error);
    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    );
  }
}
