import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

const INITIAL_PARTY_COLOURS: Record<string, string> = {
  'whig': '#93c8f4ff',
  'conservative': '#2639e6ff',
  'labour': '#d51313ff',
  'gsc': '#9467bd',
  'donex': '#ff7f0e',
  'liberal democratic': '#c4d76eff',
  'independent': '#c3dae9ff',
  'socialist': '#f79badff',
  'radical': '#0b3e16ff',
  'feather first': '#000000ff',
  'snackalist': '#c15c22ff',
  'ghanaio party': '#1f6f50',
  'organisational conservative party': '#1f3d7a',
  'cow party': 'pink',
  'united party': 'red',
  'goat party': 'teal',
  'alpaca justice party': 'brown',
  'republican fogpipe party': 'black',
  'zxmo party': 'yellow',
  'fleece party': 'purple',
  'fish and curiosity party': 'green',
  'mischief party': 'black',
  'labour party': '#d51313ff',
  'labour alliance': 'orange',
  'national populist party': '#9467bd',
  'liberal conservative party': '#1f3d7a',
  'moderate nationalist': '#1f3d7a',
  'nationalist': 'black',
  'liberal democrat': '#c4d76eff',
  'liberal': '#d51313ff',
  'conservative republican': '#1f3d7a',
  'liberal (populist wing)': '#fa862dff',
  'fogpipe party': 'black'
};

export async function POST() {
  try {
    const existing = await prisma.partyColour.count();
    if (existing > 0) {
      return NextResponse.json(
        { message: 'Party colours already seeded', count: existing },
        { status: 200 }
      );
    }

    const entries = Object.entries(INITIAL_PARTY_COLOURS);
    await prisma.partyColour.createMany({
      data: entries.map(([name, colour]) => ({ name, colour })),
    });

    return NextResponse.json({
      message: 'Party colours seeded successfully',
      count: entries.length,
    });
  } catch (error) {
    console.error('[party-colours seed] Failed to seed party colours', error);
    return NextResponse.json(
      { error: 'Failed to seed party colours' },
      { status: 500 }
    );
  }
}
