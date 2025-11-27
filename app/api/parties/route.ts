import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

interface PresidentJson {
  party: string;
}

export async function GET() {
  try {
    const countries = await prisma.country.findMany();
    const partiesSet = new Set<string>();

    for (const country of countries) {
      const presidents = country.presidents as unknown as PresidentJson[];
      if (Array.isArray(presidents)) {
        for (const president of presidents) {
          if (president.party) {
            partiesSet.add(president.party.toLowerCase());
          }
        }
      }
    }

    const parties = Array.from(partiesSet).sort();
    return NextResponse.json({ parties });
  } catch (error) {
    console.error('[parties GET] Failed to load parties', error);
    return NextResponse.json(
      { error: 'Failed to load parties' },
      { status: 500 }
    );
  }
}
