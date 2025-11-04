import type {
  SerializedMonarch,
  SerializedPresident,
  SerializedTimelineEvent,
} from './serialize';
import { DEATH, PRESIDENCY_BEGINS, PRESIDENCY_ENDS } from './timeline';

interface RawCountryPayload {
  code?: unknown;
  name?: unknown;
  start?: unknown;
  end?: unknown;
  presidents?: unknown;
  monarchs?: unknown;
}

const CODE_REGEX = /^[a-z0-9-]+$/i;
const VALID_EVENT_TYPES = new Set<number>([
  PRESIDENCY_BEGINS,
  PRESIDENCY_ENDS,
  DEATH,
]);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const expectString = (
  value: unknown,
  field: string,
  { allowEmpty = false }: { allowEmpty?: boolean } = {}
): string => {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string.`);
  }
  if (!allowEmpty && !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value;
};

const toLowercaseCode = (value: string): string => value.trim().toLowerCase();

const ensureCountryCode = (value: string): string => {
  const normalized = toLowercaseCode(value);
  if (!CODE_REGEX.test(normalized)) {
    throw new Error(
      'Country code may only contain letters, numbers, or dashes.'
    );
  }
  return normalized;
};

const ensureDate = (value: string, field: string): string => {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    throw new Error(`${field} must be a valid date.`);
  }
  return new Date(timestamp).toISOString();
};

const ensureOptionalDate = (
  value: unknown,
  field: string
): string | null => {
  if (value === null || value === undefined || value === '') return null;
  const asString = expectString(value, field);
  if (!asString.trim()) return null;
  return ensureDate(asString, field);
};

const ensureEventType = (
  value: unknown,
  context: string
): SerializedTimelineEvent['type'] => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  if (typeof value !== 'number' || !VALID_EVENT_TYPES.has(value)) {
    throw new Error(`${context} has an invalid event type.`);
  }
  return value as SerializedTimelineEvent['type'];
};

const parseEvent = (
  value: unknown,
  presidentIndex: number,
  eventIndex: number
): SerializedTimelineEvent => {
  if (!isObject(value)) {
    throw new Error(
      `President ${presidentIndex + 1}, event ${
        eventIndex + 1
      } must be an object.`
    );
  }

  const dateRaw = expectString(
    value.date,
    `President ${presidentIndex + 1}, event ${eventIndex + 1} date`
  );
  const textRaw = expectString(
    value.text,
    `President ${presidentIndex + 1}, event ${eventIndex + 1} description`
  );
  const typeRaw = ensureEventType(
    value.type,
    `President ${presidentIndex + 1}, event ${eventIndex + 1}`
  );

  return {
    date: ensureDate(dateRaw, 'Event date'),
    text: textRaw.trim(),
    ...(typeRaw ? { type: typeRaw } : {}),
  };
};

const parsePresident = (
  value: unknown,
  index: number
): SerializedPresident => {
  if (!isObject(value)) {
    throw new Error(`President ${index + 1} must be an object.`);
  }

  const name = expectString(
    value.name,
    `President ${index + 1} name`
  ).trim();
  const party = expectString(
    value.party,
    `President ${index + 1} party`
  ).trim();
  const birth = ensureDate(
    expectString(
      value.birth,
      `President ${index + 1} birth date`
    ),
    `President ${index + 1} birth date`
  );
  const death = ensureOptionalDate(
    value.death,
    `President ${index + 1} death date`
  );

  const eventsSource = Array.isArray(value.events) ? value.events : [];
  const events = eventsSource.map((event, eventIndex) =>
    parseEvent(event, index, eventIndex)
  );

  return {
    name,
    party,
    birth,
    death,
    events,
  };
};

const parseMonarch = (
  value: unknown,
  index: number
): SerializedMonarch => {
  if (!isObject(value)) {
    throw new Error(`Monarch ${index + 1} must be an object.`);
  }

  const name = expectString(
    value.name,
    `Monarch ${index + 1} name`
  ).trim();
  const birth = ensureDate(
    expectString(
      value.birth,
      `Monarch ${index + 1} birth date`
    ),
    `Monarch ${index + 1} birth date`
  );

  const death = ensureOptionalDate(
    value.death,
    `Monarch ${index + 1} death date`
  );

  const startReign = ensureDate(
    expectString(
      value.start_reign,
      `Monarch ${index + 1} reign start`
    ),
    `Monarch ${index + 1} reign start`
  );

  const endReign = ensureOptionalDate(
    value.end_reign,
    `Monarch ${index + 1} reign end`
  );

  const deathCause = value.death_cause
    ? expectString(
        value.death_cause,
        `Monarch ${index + 1} death cause`,
        { allowEmpty: true }
      ).trim() || null
    : null;

  const notes =
    value.notes && typeof value.notes === 'string' && value.notes.trim()
      ? value.notes.trim()
      : undefined;

  return {
    name,
    birth,
    death,
    start_reign: startReign,
    end_reign: endReign,
    death_cause: deathCause,
    notes,
  };
};

export interface ValidatedCountryInput {
  code: string;
  name: string;
  start: Date;
  end: Date | null;
  presidents: SerializedPresident[];
  monarchs: SerializedMonarch[];
}

export const validateAdminCountryInput = (
  input: unknown
): ValidatedCountryInput => {
  if (!isObject(input)) {
    throw new Error('Payload must be an object.');
  }

  const payload = input as RawCountryPayload;

  const code = ensureCountryCode(expectString(payload.code, 'Country code'));
  const name = expectString(payload.name, 'Country name').trim();

  const startIso = ensureDate(
    expectString(payload.start, 'Timeline start'),
    'Timeline start'
  );
  const endIso = ensureOptionalDate(payload.end, 'Timeline end');

  const presidentsSource = Array.isArray(payload.presidents)
    ? payload.presidents
    : [];
  const monarchsSource = Array.isArray(payload.monarchs)
    ? payload.monarchs
    : [];

  const presidents = presidentsSource.map(parsePresident);
  const monarchs = monarchsSource.map(parseMonarch);

  return {
    code,
    name,
    start: new Date(startIso),
    end: endIso ? new Date(endIso) : null,
    presidents,
    monarchs,
  };
};
