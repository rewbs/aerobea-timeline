import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { BOOTSTRAP_COUNTRIES } from '../../../data/bootstrapCountries';
import {
  serializeBootstrapPresident,
  serializeBootstrapMonarch,
} from '../../../lib/serialize';

export async function POST() {
  try {
    const existingCount = await prisma.country.count();
    if (existingCount > 0) {
      return NextResponse.json(
        { message: 'Countries already bootstrapped', countries: existingCount },
        { status: 200 }
      );
    }

    for (const country of BOOTSTRAP_COUNTRIES) {
      const serializedPresidents = country.presidents.map(
        serializeBootstrapPresident
      ) as unknown as Prisma.InputJsonValue;
      const serializedMonarchs = country.monarchs.map(
        serializeBootstrapMonarch
      ) as unknown as Prisma.InputJsonValue;

      await prisma.country.create({
        data: {
          code: country.code,
          name: country.name,
          start: country.start,
          end: country.end,
          presidents: serializedPresidents,
          monarchs: serializedMonarchs,
        },
      });
    }

    return NextResponse.json({ message: 'Bootstrap completed' }, { status: 201 });
  } catch (error) {
    console.error('[bootstrap POST] Failed to bootstrap countries', error);
    return NextResponse.json(
      { error: 'Failed to bootstrap countries' },
      { status: 500 }
    );
  }
}
