import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client/edge';
import { prisma } from '../../../../lib/prisma';
import { serializeAdminCountry } from '../../../admin/types';
import { validateAdminCountryInput } from '../../../../lib/adminValidation';

interface PrismaError {
  code?: string;
}

const isPrismaUniqueError = (error: unknown): boolean =>
  Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as PrismaError).code === 'P2002'
  );

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = validateAdminCountryInput(payload);

    const created = await prisma.country.create({
      data: {
        code: validated.code,
        name: validated.name,
        start: validated.start,
        end: validated.end,
        presidents: validated.presidents as unknown as Prisma.InputJsonValue,
        monarchs: validated.monarchs as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      { country: serializeAdminCountry(created) },
      { status: 201 }
    );
  } catch (error) {
    console.error('[admin countries POST]', error);

    if (isPrismaUniqueError(error)) {
      return NextResponse.json(
        { error: 'A country with this code already exists.' },
        { status: 409 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create country.' },
      { status: 500 }
    );
  }
}
