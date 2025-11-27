import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { extractCountryMonarchs } from '../../../../lib/serialize';

interface RouteParams {
  params: Promise<{
    country: string;
  }>;
}

export async function GET(_: Request, context: RouteParams) {
  const { country: countryParam } = await context.params;
  const countryCode = countryParam.toLowerCase();
  const countryRecord = await prisma.country.findUnique({
    where: { code: countryCode },
    select: {
      monarchs: true,
    },
  });

  if (!countryRecord) {
    return NextResponse.json(
      { error: `Country '${countryCode}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(extractCountryMonarchs(countryRecord.monarchs));
}
