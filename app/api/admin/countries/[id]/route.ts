import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client/edge';
import { prisma } from '../../../../../lib/prisma';
import { serializeAdminCountry } from '../../../../admin/types';
import { validateAdminCountryInput } from '../../../../../lib/adminValidation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

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

const isPrismaNotFoundError = (error: unknown): boolean =>
  Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as PrismaError).code === 'P2025'
  );

export async function PUT(request: Request, { params }: RouteParams) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid country id.' }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const validated = validateAdminCountryInput(payload);

    const updated = await prisma.country.update({
      where: { id },
      data: {
        code: validated.code,
        name: validated.name,
        start: validated.start,
        end: validated.end,
        presidents: validated.presidents as unknown as Prisma.InputJsonValue,
        monarchs: validated.monarchs as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ country: serializeAdminCountry(updated) });
  } catch (error) {
    console.error('[admin countries PUT]', error);

    if (isPrismaNotFoundError(error)) {
      return NextResponse.json(
        { error: 'Country not found.' },
        { status: 404 }
      );
    }

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
      { error: 'Failed to update country.' },
      { status: 500 }
    );
  }
}
