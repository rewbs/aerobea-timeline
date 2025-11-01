import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ countries });
  } catch (error) {
    console.error('[countries GET] Failed to load countries', error);
    return NextResponse.json(
      { error: 'Failed to load countries' },
      { status: 500 }
    );
  }
}
