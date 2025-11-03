
import { Country } from '@prisma/client/edge';
import type {
  EventType,
  TimelineEvent,
  President,
  Monarch,
} from './timeline';

export interface SerializedTimelineEvent {
  date: string;
  type?: EventType;
  text: string;
}

export interface SerializedPresident {
  name: string;
  party: string;
  birth: string;
  death: string | null;
  events: SerializedTimelineEvent[];
}

export interface SerializedMonarch {
  name: string;
  birth: string;
  death: string | null;
  start_reign: string;
  end_reign: string | null;
  death_cause: string | null;
  notes?: string;
}

export interface SerializedCountryTimeline {
  code: string;
  name: string;
  start: string;
  end: string | null;
  presidents: SerializedPresident[];
  monarchs: SerializedMonarch[];
}

const serializeDate = (value: Date | null): string | null =>
  value ? value.toISOString() : null;

export const serializeBootstrapEvent = (
  event: TimelineEvent
): SerializedTimelineEvent => ({
  date: event.date.toISOString(),
  type: event.type,
  text: event.text,
});

export const serializeBootstrapPresident = (
  president: President
): SerializedPresident => ({
  name: president.name,
  party: president.party,
  birth: president.birth.toISOString(),
  death: serializeDate(president.death),
  events: president.events.map(serializeBootstrapEvent),
});

export const serializeBootstrapMonarch = (
  monarch: Monarch
): SerializedMonarch => ({
  name: monarch.name,
  birth: monarch.birth.toISOString(),
  death: serializeDate(monarch.death),
  start_reign: monarch.start_reign.toISOString(),
  end_reign: serializeDate(monarch.end_reign),
  death_cause: monarch.death_cause,
  notes: monarch.notes,
});

type CountryRecord = Pick<
  Country,
  'code' | 'name' | 'start' | 'end' | 'presidents' | 'monarchs'
>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const normalizeEvent = (
  value: unknown
): SerializedTimelineEvent | null => {
  if (!isObject(value) || !isString(value.date) || !isString(value.text)) {
    return null;
  }

  const type = value.type;

  return {
    date: value.date,
    text: value.text,
    ...(typeof type === 'number' ? { type: type as EventType } : {}),
  };
};

const normalizeArray = <T>(
  value: unknown,
  normalizer: (item: unknown) => T | null
): T[] => {
  if (!Array.isArray(value)) return [];
  const result: T[] = [];
  for (const item of value) {
    const normalized = normalizer(item);
    if (normalized) {
      result.push(normalized);
    }
  }
  return result;
};

const normalizePresident = (
  value: unknown
): SerializedPresident | null => {
  if (!isObject(value) || !isString(value.name) || !isString(value.party)) {
    return null;
  }
  if (!isString(value.birth)) {
    return null;
  }

  const events = normalizeEventCollection(value.events);

  const death = value.death;
  return {
    name: value.name,
    party: value.party,
    birth: value.birth,
    death: isString(death) ? death : null,
    events,
  };
};

const normalizeMonarch = (
  value: unknown
): SerializedMonarch | null => {
  if (!isObject(value) || !isString(value.name) || !isString(value.birth)) {
    return null;
  }
  if (!isString(value.start_reign)) {
    return null;
  }

  const death = value.death;
  const endReign = value.end_reign;
  const notes = value.notes;

  return {
    name: value.name,
    birth: value.birth,
    death: isString(death) ? death : null,
    start_reign: value.start_reign,
    end_reign: isString(endReign) ? endReign : null,
    death_cause: isString(value.death_cause) ? value.death_cause : null,
    notes: isString(notes) ? notes : undefined,
  };
};

const normalizeEventCollection = (value: unknown): SerializedTimelineEvent[] =>
  normalizeArray(value, normalizeEvent);

const normalizePresidentCollection = (
  value: unknown
): SerializedPresident[] => normalizeArray(value, normalizePresident);

const normalizeMonarchCollection = (
  value: unknown
): SerializedMonarch[] => normalizeArray(value, normalizeMonarch);

export const serializeCountryRecord = (
  country: CountryRecord
): SerializedCountryTimeline => ({
  code: country.code,
  name: country.name,
  start: country.start.toISOString(),
  end: serializeDate(country.end),
  presidents: normalizePresidentCollection(country.presidents),
  monarchs: normalizeMonarchCollection(country.monarchs),
});

export const extractCountryPresidents = (
  presidents: unknown
): SerializedPresident[] => normalizePresidentCollection(presidents);

export const extractCountryMonarchs = (
  monarchs: unknown
): SerializedMonarch[] => normalizeMonarchCollection(monarchs);
