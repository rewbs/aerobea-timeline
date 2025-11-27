import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partyColourId = parseInt(id, 10);

    if (isNaN(partyColourId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    await prisma.partyColour.delete({
      where: { id: partyColourId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[party-colours DELETE] Failed to delete party colour', error);
    return NextResponse.json(
      { error: 'Failed to delete party colour' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partyColourId = parseInt(id, 10);
    const body = await request.json();
    const { colour } = body;

    if (isNaN(partyColourId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    if (!colour) {
      return NextResponse.json(
        { error: 'Colour is required' },
        { status: 400 }
      );
    }

    const partyColour = await prisma.partyColour.update({
      where: { id: partyColourId },
      data: { colour },
    });

    return NextResponse.json({ partyColour });
  } catch (error) {
    console.error('[party-colours PUT] Failed to update party colour', error);
    return NextResponse.json(
      { error: 'Failed to update party colour' },
      { status: 500 }
    );
  }
}
