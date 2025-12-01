import {
    DEATH,
    PRESIDENCY_BEGINS,
    PRESIDENCY_ENDS,
    type EventType,
} from '../../../lib/timeline';
import type {
    SerializedMonarch,
    SerializedPresident,
    SerializedTimelineEvent,
} from '../../../lib/serialize';
import type { AdminCountry } from '../types';

export const MAX_HISTORY = 20;

export type EventTypeString = '' | '1' | '2' | '3';

export interface TimelineEventForm {
    formId: string;
    date: string;
    type: EventTypeString;
    text: string;
}

export interface PresidentForm {
    formId: string;
    name: string;
    party: string;
    birth: string;
    death: string;
    events: TimelineEventForm[];
    imageUrl?: string;
}

export interface MonarchForm {
    formId: string;
    name: string;
    birth: string;
    death: string;
    start_reign: string;
    end_reign: string;
    death_cause: string;
    notes: string;
    imageUrl?: string;
}

export interface CountryDraft {
    id?: number;
    code: string;
    name: string;
    start: string;
    end: string;
    presidents: PresidentForm[];
    monarchs: MonarchForm[];
}

export type EditorMode = 'create' | 'edit';

export interface SaveStatus {
    type: 'idle' | 'saving' | 'success' | 'error';
    message?: string;
}

export const eventTypeOptions: Array<{ value: EventTypeString; label: string }> = [
    { value: '', label: 'General' },
    { value: '1', label: 'Presidency Begins' },
    { value: '2', label: 'Presidency Ends' },
    { value: '3', label: 'Death' },
];

export const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

export const isString = (value: unknown): value is string => typeof value === 'string';

export const createId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 12);

export const DEFAULT_DATE = '1800-01-01';
export const DEFAULT_DATETIME = '1800-01-01T00:00';
export const DEFAULT_EVENT_TEXT = 'Details pending';
export const DEFAULT_NAME = 'Unnamed';
export const DEFAULT_PARTY = 'Independent';
export const DEFAULT_CODE = 'new-country';

export const cloneDraft = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const areDraftsEqual = (a: CountryDraft, b: CountryDraft): boolean =>
    JSON.stringify(a) === JSON.stringify(b);

export const toDateInputValue = (value: string | null): string =>
    value ? value.slice(0, 10) : '';

export const toDateTimeInputValue = (value: string): string =>
    value ? value.slice(0, 16) : '';

export const createEmptyEvent = (): TimelineEventForm => ({
    formId: createId(),
    date: '',
    type: '',
    text: '',
});

export const createEmptyPresident = (): PresidentForm => ({
    formId: createId(),
    name: '',
    party: '',
    birth: '',
    death: '',
    events: [],
    imageUrl: undefined,
});

export const createEmptyMonarch = (): MonarchForm => ({
    formId: createId(),
    name: '',
    birth: '',
    death: '',
    start_reign: '',
    end_reign: '',
    death_cause: '',
    notes: '',
    imageUrl: undefined,
});

export const createEmptyDraft = (): CountryDraft => ({
    code: '',
    name: '',
    start: '',
    end: '',
    presidents: [],
    monarchs: [],
});

export const eventTypeToNumber = (value: EventTypeString) => {
    if (!value) return undefined;
    const parsed = Number(value);
    switch (parsed) {
        case PRESIDENCY_BEGINS:
        case PRESIDENCY_ENDS:
        case DEATH:
            return parsed;
        default:
            return undefined;
    }
};

export const formatPresidentsJson = (presidents: PresidentForm[]) =>
    JSON.stringify(
        presidents.map(president => ({
            name: president.name,
            party: president.party,
            birth: president.birth,
            death: president.death || null,
            events: president.events.map(event => ({
                date: event.date,
                type: eventTypeToNumber(event.type),
                text: event.text,
            })),
            imageUrl: president.imageUrl,
        })),
        null,
        2
    );

export const formatMonarchsJson = (monarchs: MonarchForm[]) =>
    JSON.stringify(
        monarchs.map(monarch => ({
            name: monarch.name,
            birth: monarch.birth,
            death: monarch.death || null,
            start_reign: monarch.start_reign,
            end_reign: monarch.end_reign || null,
            death_cause: monarch.death_cause || null,
            notes: monarch.notes || undefined,
            imageUrl: monarch.imageUrl,
        })),
        null,
        2
    );

export const isSerializedEvent = (
    value: unknown
): value is SerializedTimelineEvent =>
    isObject(value) && isString(value.date) && isString(value.text);

export const isSerializedPresident = (
    value: unknown
): value is SerializedPresident =>
    isObject(value) &&
    isString(value.name) &&
    isString(value.party) &&
    isString(value.birth) &&
    Array.isArray(value.events) &&
    value.events.every(isSerializedEvent);

export const isSerializedMonarch = (value: unknown): value is SerializedMonarch =>
    isObject(value) &&
    isString(value.name) &&
    isString(value.birth) &&
    isString(value.start_reign);

export const toEventForm = (event: SerializedTimelineEvent): TimelineEventForm => ({
    formId: createId(),
    date: toDateTimeInputValue(event.date),
    type: typeof event.type === 'number' ? String(event.type) as EventTypeString : '',
    text: event.text,
});

export const toPresidentForm = (president: SerializedPresident): PresidentForm => ({
    formId: createId(),
    name: president.name,
    party: president.party,
    birth: toDateInputValue(president.birth),
    death: president.death ? toDateInputValue(president.death) : '',
    events: president.events.map(toEventForm),
    imageUrl: president.imageUrl,
});

export const toMonarchForm = (monarch: SerializedMonarch): MonarchForm => ({
    formId: createId(),
    name: monarch.name,
    birth: toDateInputValue(monarch.birth),
    death: monarch.death ? toDateInputValue(monarch.death) : '',
    start_reign: toDateInputValue(monarch.start_reign),
    end_reign: monarch.end_reign ? toDateInputValue(monarch.end_reign) : '',
    death_cause: monarch.death_cause ?? '',
    notes: monarch.notes ?? '',
    imageUrl: monarch.imageUrl,
});

export const toCountryDraft = (country?: AdminCountry): CountryDraft => {
    if (!country) return createEmptyDraft();
    const presidentsSource = Array.isArray(country.presidents)
        ? (country.presidents as unknown[])
        : [];
    const monarchsSource = Array.isArray(country.monarchs)
        ? (country.monarchs as unknown[])
        : [];

    const presidents = presidentsSource
        .filter(isSerializedPresident)
        .map(toPresidentForm);
    const monarchs = monarchsSource
        .filter(isSerializedMonarch)
        .map(toMonarchForm);

    return {
        id: country.id,
        code: country.code,
        name: country.name,
        start: toDateInputValue(country.start),
        end: toDateInputValue(country.end),
        presidents,
        monarchs,
    };
};

export const isValidDateValue = (value: string): boolean =>
    Boolean(value) && !Number.isNaN(Date.parse(value));

export const toIsoOrNull = (value: string): string | null =>
    value ? new Date(value).toISOString() : null;

export const buildPayload = (draft: CountryDraft) => ({
    id: draft.id,
    code: draft.code.trim(),
    name: draft.name.trim(),
    start: draft.start,
    end: draft.end || null,
    presidents: draft.presidents.map(president => ({
        name: president.name.trim(),
        party: president.party.trim(),
        birth: president.birth,
        death: president.death || null,
        events: president.events.map(event => ({
            date: event.date,
            type: eventTypeToNumber(event.type),
            text: event.text.trim(),
        })),
        imageUrl: president.imageUrl,
    })),
    monarchs: draft.monarchs.map(monarch => ({
        name: monarch.name.trim(),
        birth: monarch.birth,
        death: monarch.death || null,
        start_reign: monarch.start_reign,
        end_reign: monarch.end_reign || null,
        death_cause: monarch.death_cause.trim() || null,
        notes: monarch.notes.trim() || undefined,
        imageUrl: monarch.imageUrl,
    })),
});

export const ensureDateValue = (value: string, fallback: string): string =>
    isValidDateValue(value) ? value : fallback;

export const ensureDateTimeValue = (value: string, fallback: string): string =>
    isValidDateValue(value) ? value : fallback;

export const ensureTextValue = (value: string, fallback: string): string =>
    value.trim() || fallback;

export const normalizeDraftForSave = (draft: CountryDraft): CountryDraft => {
    const normalizeCode = (value: string) => {
        const trimmed = value.trim();
        if (trimmed) return trimmed.toLowerCase();
        const nameAsCode = draft.name.trim().toLowerCase().replace(/\s+/g, '-');
        return nameAsCode || DEFAULT_CODE;
    };

    const normalizeEvent = (event: TimelineEventForm): TimelineEventForm => ({
        ...event,
        date: ensureDateTimeValue(event.date, DEFAULT_DATETIME),
        text: ensureTextValue(event.text, DEFAULT_EVENT_TEXT),
    });

    const normalizePresident = (president: PresidentForm): PresidentForm => ({
        ...president,
        name: ensureTextValue(president.name, DEFAULT_NAME),
        party: ensureTextValue(president.party, DEFAULT_PARTY),
        birth: ensureDateValue(president.birth, DEFAULT_DATE),
        death: president.death && !isValidDateValue(president.death)
            ? DEFAULT_DATE
            : president.death,
        events: president.events.map(normalizeEvent),
        imageUrl: president.imageUrl,
    });

    const normalizeMonarch = (monarch: MonarchForm): MonarchForm => ({
        ...monarch,
        name: ensureTextValue(monarch.name, DEFAULT_NAME),
        birth: ensureDateValue(monarch.birth, DEFAULT_DATE),
        death:
            monarch.death && !isValidDateValue(monarch.death)
                ? DEFAULT_DATE
                : monarch.death,
        start_reign: ensureDateValue(monarch.start_reign, DEFAULT_DATE),
        end_reign:
            monarch.end_reign && !isValidDateValue(monarch.end_reign)
                ? DEFAULT_DATE
                : monarch.end_reign,
        death_cause: monarch.death_cause,
        notes: monarch.notes,
        imageUrl: monarch.imageUrl,
    });

    const start = ensureDateValue(draft.start, DEFAULT_DATE);
    const end = draft.end && !isValidDateValue(draft.end) ? DEFAULT_DATE : draft.end;

    return {
        ...draft,
        code: normalizeCode(draft.code),
        name: ensureTextValue(draft.name, DEFAULT_NAME),
        start,
        end,
        presidents: draft.presidents.map(normalizePresident),
        monarchs: draft.monarchs.map(normalizeMonarch),
    };
};

export const validateDraft = (draft: CountryDraft): string[] => {
    const errors: string[] = [];

    if (!draft.code.trim()) {
        errors.push('Country code is required.');
    }

    if (!draft.name.trim()) {
        errors.push('Country name is required.');
    }

    if (!isValidDateValue(draft.start)) {
        errors.push('A valid start date is required.');
    }

    if (draft.end && !isValidDateValue(draft.end)) {
        errors.push('End date must be a valid date or left blank.');
    }

    draft.presidents.forEach((president, index) => {
        if (!president.name.trim()) {
            errors.push(`President ${index + 1}: name is required.`);
        }
        if (!president.party.trim()) {
            errors.push(`President ${index + 1}: party is required.`);
        }
        if (!isValidDateValue(president.birth)) {
            errors.push(`President ${index + 1}: birth date is required.`);
        }
        if (president.death && !isValidDateValue(president.death)) {
            errors.push(`President ${index + 1}: death date must be valid or blank.`);
        }
        president.events.forEach((event, eventIndex) => {
            if (!isValidDateValue(event.date)) {
                errors.push(
                    `President ${index + 1}, event ${eventIndex + 1}: event date is required.`
                );
            }
            if (!event.text.trim()) {
                errors.push(
                    `President ${index + 1}, event ${eventIndex + 1}: description is required.`
                );
            }
        });
    });

    draft.monarchs.forEach((monarch, index) => {
        if (!monarch.name.trim()) {
            errors.push(`Monarch ${index + 1}: name is required.`);
        }
        if (!isValidDateValue(monarch.birth)) {
            errors.push(`Monarch ${index + 1}: birth date is required.`);
        }
        if (monarch.death && !isValidDateValue(monarch.death)) {
            errors.push(`Monarch ${index + 1}: death date must be valid or blank.`);
        }
        if (!isValidDateValue(monarch.start_reign)) {
            errors.push(`Monarch ${index + 1}: reign start date is required.`);
        }
        if (monarch.end_reign && !isValidDateValue(monarch.end_reign)) {
            errors.push(`Monarch ${index + 1}: reign end date must be valid or blank.`);
        }
    });

    return errors;
};

export const validateSemantics = (draft: CountryDraft): string[] => {
    const warnings: string[] = [];

    // President checks
    draft.presidents.forEach((president, index) => {
        const name = president.name.trim() || `President ${index + 1}`;

        // Birth vs Death
        if (president.birth && president.death) {
            if (new Date(president.birth) >= new Date(president.death)) {
                warnings.push(`${name}: Birth date must be before death date.`);
            }
        }

        // Events vs Birth/Death
        president.events.forEach((event, eventIndex) => {
            if (!event.date) return;
            const eventDate = new Date(event.date);

            if (president.birth && eventDate < new Date(president.birth)) {
                warnings.push(`${name}: Event "${event.text}" occurs before birth.`);
            }

            if (president.death && eventDate > new Date(president.death)) {
                // Allow posthumous events if explicitly marked or context implies?
                // For now, just warn.
                warnings.push(`${name}: Event "${event.text}" occurs after death.`);
            }
        });
    });

    // Overlapping Presidencies
    // Sort presidents by start date (assuming first event is start)
    const sortedPresidents = [...draft.presidents]
        .map((p, i) => {
            const startEvent = p.events.find(e => e.type === '1'); // PRESIDENCY_BEGINS
            const endEvent = p.events.find(e => e.type === '2'); // PRESIDENCY_ENDS
            return {
                ...p,
                originalIndex: i,
                startDate: startEvent ? new Date(startEvent.date) : null,
                endDate: endEvent ? new Date(endEvent.date) : null,
            };
        })
        .filter(p => p.startDate && p.endDate)
        .sort((a, b) => (a.startDate!.getTime() - b.startDate!.getTime()));

    for (let i = 0; i < sortedPresidents.length - 1; i++) {
        const current = sortedPresidents[i];
        const next = sortedPresidents[i + 1];

        if (current.endDate && next.startDate && current.endDate > next.startDate) {
            warnings.push(
                `Overlap detected: ${current.name} ends (${current.endDate.toISOString().slice(0, 10)}) after ${next.name} starts (${next.startDate.toISOString().slice(0, 10)}).`
            );
        }
    }

    // Monarch checks
    draft.monarchs.forEach((monarch, index) => {
        const name = monarch.name.trim() || `Monarch ${index + 1}`;

        if (monarch.birth && monarch.death) {
            if (new Date(monarch.birth) >= new Date(monarch.death)) {
                warnings.push(`${name}: Birth date must be before death date.`);
            }
        }

        if (monarch.start_reign && monarch.end_reign) {
            if (new Date(monarch.start_reign) >= new Date(monarch.end_reign)) {
                warnings.push(`${name}: Reign start must be before reign end.`);
            }
        }

        if (monarch.birth && monarch.start_reign) {
            if (new Date(monarch.birth) >= new Date(monarch.start_reign)) {
                warnings.push(`${name}: Birth date must be before reign start.`);
            }
        }
    });

    return warnings;
};

export const VALID_EVENT_TYPES = new Set<EventType>([PRESIDENCY_BEGINS, PRESIDENCY_ENDS, DEATH]);

export const isValidEventType = (value: unknown): value is EventType =>
    typeof value === 'number' && VALID_EVENT_TYPES.has(value as EventType);

export const parseSerializedEvent = (
    value: unknown,
    context: string,
    errors: string[]
): SerializedTimelineEvent | null => {
    const initialErrorCount = errors.length;
    if (!isObject(value)) {
        errors.push(`${context} must be an object.`);
        return null;
    }

    if (!isString(value.date) || !isValidDateValue(value.date)) {
        errors.push(`${context} requires a valid date string.`);
    }

    if (!isString(value.text) || !value.text.trim()) {
        errors.push(`${context} requires event text.`);
    }

    let parsedType: EventType | undefined;
    if (value.type !== undefined && value.type !== null) {
        if (!isValidEventType(value.type)) {
            errors.push(
                `${context} has an invalid type; expected one of ${Array.from(VALID_EVENT_TYPES).join(', ')}.`,
            );
        } else {
            parsedType = value.type as EventType;
        }
    }

    if (errors.length !== initialErrorCount) return null;

    return {
        date: value.date as string,
        ...(parsedType !== undefined ? { type: parsedType } : {}),
        text: value.text as string,
    };
};

export const parseSerializedPresident = (
    value: unknown,
    index: number,
    errors: string[]
): SerializedPresident | null => {
    const initialErrorCount = errors.length;
    if (!isObject(value)) {
        errors.push(`President ${index + 1} must be an object.`);
        return null;
    }

    if (!isString(value.name) || !value.name.trim()) {
        errors.push(`President ${index + 1} requires a name.`);
    }

    if (!isString(value.party) || !value.party.trim()) {
        errors.push(`President ${index + 1} requires a party value.`);
    }

    if (!isString(value.birth) || !isValidDateValue(value.birth)) {
        errors.push(`President ${index + 1} requires a valid birth date.`);
    }

    const events: SerializedTimelineEvent[] = [];
    if (!Array.isArray(value.events)) {
        errors.push(`President ${index + 1} must include an events array.`);
    } else {
        value.events.forEach((event, eventIndex) => {
            const parsed = parseSerializedEvent(
                event,
                `President ${index + 1} event ${eventIndex + 1}`,
                errors
            );
            if (parsed) {
                events.push(parsed);
            }
        });
    }

    if (errors.length !== initialErrorCount) return null;

    return {
        name: value.name as string,
        party: value.party as string,
        birth: value.birth as string,
        death: isString(value.death) ? value.death : null,
        events,
        imageUrl: isString(value.imageUrl) ? value.imageUrl : undefined,
    };
};

export const parseSerializedMonarch = (
    value: unknown,
    index: number,
    errors: string[]
): SerializedMonarch | null => {
    const initialErrorCount = errors.length;
    if (!isObject(value)) {
        errors.push(`Monarch ${index + 1} must be an object.`);
        return null;
    }

    if (!isString(value.name) || !value.name.trim()) {
        errors.push(`Monarch ${index + 1} requires a name.`);
    }

    if (!isString(value.birth) || !isValidDateValue(value.birth)) {
        errors.push(`Monarch ${index + 1} requires a valid birth date.`);
    }

    if (!isString(value.start_reign) || !isValidDateValue(value.start_reign)) {
        errors.push(`Monarch ${index + 1} requires a valid reign start date.`);
    }

    const endReign = value.end_reign;
    if (endReign && (!isString(endReign) || !isValidDateValue(endReign))) {
        errors.push(`Monarch ${index + 1} has an invalid reign end date.`);
    }

    const death = value.death;
    if (death && (!isString(death) || !isValidDateValue(death))) {
        errors.push(`Monarch ${index + 1} has an invalid death date.`);
    }

    if (value.death_cause && !isString(value.death_cause)) {
        errors.push(`Monarch ${index + 1} has an invalid death cause.`);
    }

    if (value.notes && !isString(value.notes)) {
        errors.push(`Monarch ${index + 1} has invalid notes (must be text).`);
    }

    if (errors.length !== initialErrorCount) return null;

    return {
        name: value.name as string,
        birth: value.birth as string,
        death: isString(death) ? death : null,
        start_reign: value.start_reign as string,
        end_reign: isString(endReign) ? endReign : null,
        death_cause: isString(value.death_cause) ? value.death_cause : null,
        notes: isString(value.notes) ? value.notes : undefined,
        imageUrl: isString(value.imageUrl) ? value.imageUrl : undefined,
    };
};

export interface ValidationResult<T> {
    data: T | null;
    errors: string[];
}

export const validatePresidentsJson = (json: string): ValidationResult<SerializedPresident[]> => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        return { data: null, errors: [(e as Error).message] };
    }

    if (!Array.isArray(parsed)) {
        return { data: null, errors: ['Presidents JSON must be an array of president objects.'] };
    }

    const errors: string[] = [];
    const presidents = parsed
        .map((value, index) => parseSerializedPresident(value, index, errors))
        .filter((value): value is SerializedPresident => Boolean(value));

    if (errors.length) {
        return { data: null, errors };
    }

    return { data: presidents, errors: [] };
};

export const validateMonarchsJson = (json: string): ValidationResult<SerializedMonarch[]> => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        return { data: null, errors: [(e as Error).message] };
    }

    if (!Array.isArray(parsed)) {
        return { data: null, errors: ['Monarchs JSON must be an array of monarch objects.'] };
    }

    const errors: string[] = [];
    const monarchs = parsed
        .map((value, index) => parseSerializedMonarch(value, index, errors))
        .filter((value): value is SerializedMonarch => Boolean(value));

    if (errors.length) {
        return { data: null, errors };
    }

    return { data: monarchs, errors: [] };
};

export const parseSerializedPresidents = (json: string): SerializedPresident[] => {
    const result = validatePresidentsJson(json);
    if (result.errors.length) {
        throw new Error(result.errors.join(' '));
    }
    return result.data!;
};

export const parseSerializedMonarchs = (json: string): SerializedMonarch[] => {
    const result = validateMonarchsJson(json);
    if (result.errors.length) {
        throw new Error(result.errors.join(' '));
    }
    return result.data!;
};

export const parsePresidentsJson = (json: string): PresidentForm[] =>
    parseSerializedPresidents(json).map(toPresidentForm);

export const parseMonarchsJson = (json: string): MonarchForm[] =>
    parseSerializedMonarchs(json).map(toMonarchForm);
