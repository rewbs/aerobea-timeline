import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const partyColours = await prisma.partyColour.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ partyColours });
  } catch (error) {
    console.error('[party-colours GET] Failed to load party colours', error);
    return NextResponse.json(
      { error: 'Failed to load party colours' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, colour } = body;

    if (!name || !colour) {
      return NextResponse.json(
        { error: 'Name and colour are required' },
        { status: 400 }
      );
    }

    const partyColour = await prisma.partyColour.upsert({
      where: { name: name.toLowerCase() },
      update: { colour },
      create: { name: name.toLowerCase(), colour },
    });

    return NextResponse.json({ partyColour });
  } catch (error) {
    console.error('[party-colours POST] Failed to save party colour', error);
    return NextResponse.json(
      { error: 'Failed to save party colour' },
      { status: 500 }
    );
  }
}
