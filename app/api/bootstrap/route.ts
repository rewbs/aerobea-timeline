import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { COUNTRIES } from '../../../data/countries';
import type {
  President,
  Monarch,
  TimelineEvent,
} from '../../../lib/timeline';

type SerializableTimelineEvent = Omit<TimelineEvent, 'date'> & {
  date: string;
};

type SerializablePresident = Omit<
  President,
  'birth' | 'death' | 'events'
> & {
  birth: string;
  death: string | null;
  events: SerializableTimelineEvent[];
};

type SerializableMonarch = Omit<
  Monarch,
  'birth' | 'death' | 'start_reign' | 'end_reign'
> & {
  birth: string;
  death: string | null;
  start_reign: string;
  end_reign: string | null;
};

function serializeEvent(event: TimelineEvent): SerializableTimelineEvent {
  return {
    ...event,
    date: event.date.toISOString(),
  };
}

function serializePresident(president: President): SerializablePresident {
  return {
    ...president,
    birth: president.birth.toISOString(),
    death: president.death ? president.death.toISOString() : null,
    events: president.events.map(serializeEvent),
  };
}

function serializeMonarch(monarch: Monarch): SerializableMonarch {
  return {
    ...monarch,
    birth: monarch.birth.toISOString(),
    death: monarch.death ? monarch.death.toISOString() : null,
    start_reign: monarch.start_reign.toISOString(),
    end_reign: monarch.end_reign ? monarch.end_reign.toISOString() : null,
  };
}

export async function POST() {
  try {
    const existingCount = await prisma.country.count();
    if (existingCount > 0) {
      return NextResponse.json(
        { message: 'Countries already bootstrapped', countries: existingCount },
        { status: 200 }
      );
    }

    for (const country of COUNTRIES) {
      await prisma.country.create({
        data: {
          code: country.code,
          name: country.name,
          start: country.start,
          end: country.end,
          presidents: country.presidents.map(serializePresident),
          monarchs: country.monarchs.map(serializeMonarch),
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
