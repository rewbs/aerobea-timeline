'use client';

import Link from 'next/link';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  DEATH,
  PRESIDENCY_BEGINS,
  PRESIDENCY_ENDS,
} from '../../../lib/timeline';
import type {
  SerializedMonarch,
  SerializedPresident,
  SerializedTimelineEvent,
} from '../../../lib/serialize';
import type { AdminCountry } from '../types';

const MAX_HISTORY = 20;

type EventTypeString = '' | '1' | '2' | '3';

interface TimelineEventForm {
  formId: string;
  date: string;
  type: EventTypeString;
  text: string;
}

interface PresidentForm {
  formId: string;
  name: string;
  party: string;
  birth: string;
  death: string;
  events: TimelineEventForm[];
}

interface MonarchForm {
  formId: string;
  name: string;
  birth: string;
  death: string;
  start_reign: string;
  end_reign: string;
  death_cause: string;
  notes: string;
}

interface CountryDraft {
  id?: number;
  code: string;
  name: string;
  start: string;
  end: string;
  presidents: PresidentForm[];
  monarchs: MonarchForm[];
}

type EditorMode = 'create' | 'edit';

interface AdminCountryEditorClientProps {
  mode: EditorMode;
  initialCountry?: AdminCountry;
}

interface SaveStatus {
  type: 'idle' | 'saving' | 'success' | 'error';
  message?: string;
}

const eventTypeOptions: Array<{ value: EventTypeString; label: string }> = [
  { value: '', label: 'General' },
  { value: '1', label: 'Presidency Begins' },
  { value: '2', label: 'Presidency Ends' },
  { value: '3', label: 'Death' },
];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);

const DEFAULT_DATE = '1800-01-01';
const DEFAULT_DATETIME = '1800-01-01T00:00';
const DEFAULT_EVENT_TEXT = 'Details pending';
const DEFAULT_NAME = 'Unnamed';
const DEFAULT_PARTY = 'Independent';
const DEFAULT_CODE = 'new-country';

const cloneDraft = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const areDraftsEqual = (a: CountryDraft, b: CountryDraft): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

const toDateInputValue = (value: string | null): string =>
  value ? value.slice(0, 10) : '';

const toDateTimeInputValue = (value: string): string =>
  value ? value.slice(0, 16) : '';

const createEmptyEvent = (): TimelineEventForm => ({
  formId: createId(),
  date: '',
  type: '',
  text: '',
});

const createEmptyPresident = (): PresidentForm => ({
  formId: createId(),
  name: '',
  party: '',
  birth: '',
  death: '',
  events: [],
});

const createEmptyMonarch = (): MonarchForm => ({
  formId: createId(),
  name: '',
  birth: '',
  death: '',
  start_reign: '',
  end_reign: '',
  death_cause: '',
  notes: '',
});

const createEmptyDraft = (): CountryDraft => ({
  code: '',
  name: '',
  start: '',
  end: '',
  presidents: [],
  monarchs: [],
});

const IMAGE_BASES = [''];
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

const useEntityImage = (name: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>(
    'idle'
  );

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setImageUrl(null);
      setStatus('idle');
      return;
    }
    let cancelled = false;
    const candidateNames = Array.from(
      new Set([trimmed, trimmed.toLowerCase()])
    );

    setStatus('loading');
    setImageUrl(null);

    (async () => {
      for (const base of IMAGE_BASES) {
        for (const candidate of candidateNames) {
          const encoded = encodeURIComponent(candidate);
          for (const ext of IMAGE_EXTENSIONS) {
            const url =
              base === ''
                ? `/${encoded}.${ext}`
                : `${base.replace(/\/$/, '')}/${encoded}.${ext}`;
            try {
              const res = await fetch(url, { method: 'HEAD' });
              if (res.ok) {
                if (!cancelled) {
                  setImageUrl(url);
                  setStatus('success');
                }
                return;
              }
            } catch {
              // Ignore network errors; try next candidate
            }
          }
        }
      }
      if (!cancelled) {
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [name]);

  return { imageUrl, status };
};

const AdminEntityImagePreview = ({
  name,
  label,
}: {
  name: string;
  label: string;
}) => {
  const { imageUrl, status } = useEntityImage(name);

  const placeholder =
    name.trim().length < 3
      ? 'Enter a name to look for a matching image.'
      : status === 'loading'
      ? 'Searching image library…'
      : 'No matching image found.';

  return (
    <div className="admin-entity-image" aria-live="polite">
      {imageUrl ? (
        <>
          <img
            alt={`${label} portrait for ${name}`}
            src={imageUrl}
            loading="lazy"
          />
          <span className="admin-entity-image-caption">
            Auto-detected from /public
          </span>
        </>
      ) : (
        <div className="admin-entity-image-placeholder">{placeholder}</div>
      )}
    </div>
  );
};

const isSerializedEvent = (
  value: unknown
): value is SerializedTimelineEvent =>
  isObject(value) && isString(value.date) && isString(value.text);

const isSerializedPresident = (
  value: unknown
): value is SerializedPresident =>
  isObject(value) &&
  isString(value.name) &&
  isString(value.party) &&
  isString(value.birth) &&
  Array.isArray(value.events) &&
  value.events.every(isSerializedEvent);

const isSerializedMonarch = (value: unknown): value is SerializedMonarch =>
  isObject(value) &&
  isString(value.name) &&
  isString(value.birth) &&
  isString(value.start_reign);

const toEventForm = (event: SerializedTimelineEvent): TimelineEventForm => ({
  formId: createId(),
  date: toDateTimeInputValue(event.date),
  type: typeof event.type === 'number' ? String(event.type) as EventTypeString : '',
  text: event.text,
});

const toPresidentForm = (president: SerializedPresident): PresidentForm => ({
  formId: createId(),
  name: president.name,
  party: president.party,
  birth: toDateInputValue(president.birth),
  death: president.death ? toDateInputValue(president.death) : '',
  events: president.events.map(toEventForm),
});

const toMonarchForm = (monarch: SerializedMonarch): MonarchForm => ({
  formId: createId(),
  name: monarch.name,
  birth: toDateInputValue(monarch.birth),
  death: monarch.death ? toDateInputValue(monarch.death) : '',
  start_reign: toDateInputValue(monarch.start_reign),
  end_reign: monarch.end_reign ? toDateInputValue(monarch.end_reign) : '',
  death_cause: monarch.death_cause ?? '',
  notes: monarch.notes ?? '',
});

const toCountryDraft = (country?: AdminCountry): CountryDraft => {
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

const isValidDateValue = (value: string): boolean =>
  Boolean(value) && !Number.isNaN(Date.parse(value));

const eventTypeToNumber = (value: EventTypeString) => {
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

const toIsoOrNull = (value: string): string | null =>
  value ? new Date(value).toISOString() : null;

const buildPayload = (draft: CountryDraft) => ({
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
  })),
  monarchs: draft.monarchs.map(monarch => ({
    name: monarch.name.trim(),
    birth: monarch.birth,
    death: monarch.death || null,
    start_reign: monarch.start_reign,
    end_reign: monarch.end_reign || null,
    death_cause: monarch.death_cause.trim() || null,
    notes: monarch.notes.trim() || undefined,
  })),
});

const ensureDateValue = (value: string, fallback: string): string =>
  isValidDateValue(value) ? value : fallback;

const ensureDateTimeValue = (value: string, fallback: string): string =>
  isValidDateValue(value) ? value : fallback;

const ensureTextValue = (value: string, fallback: string): string =>
  value.trim() || fallback;

const normalizeDraftForSave = (draft: CountryDraft): CountryDraft => {
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

const validateDraft = (draft: CountryDraft): string[] => {
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

const AdminCountryEditorClient = ({
  mode,
  initialCountry,
}: AdminCountryEditorClientProps) => {
  const router = useRouter();
  const initialDraft = useMemo(
    () => toCountryDraft(initialCountry),
    [initialCountry]
  );
  const presidentRefs = useRef<Record<string, HTMLElement | null>>({});
  const eventRefs = useRef<Record<string, HTMLElement | null>>({});
  const [baseline, setBaseline] = useState<CountryDraft>(initialDraft);
  const [draft, setDraft] = useState<CountryDraft>(initialDraft);
  const [history, setHistory] = useState<CountryDraft[]>([]);
  const [status, setStatus] = useState<SaveStatus>({ type: 'idle' });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setBaseline(initialDraft);
    setDraft(initialDraft);
    setHistory([]);
    setValidationErrors([]);
    setStatus({ type: 'idle' });
  }, [initialDraft]);

  const isDirty = useMemo(
    () => !areDraftsEqual(draft, baseline),
    [draft, baseline]
  );

  const applyChange = useCallback(
    (updater: (current: CountryDraft) => CountryDraft) => {
      setDraft(current => {
        const next = updater(cloneDraft(current));
        if (areDraftsEqual(next, current)) {
          return current;
        }
        setHistory(prev => {
          const snapshot = cloneDraft(current);
          const trimmed =
            prev.length >= MAX_HISTORY
              ? [...prev.slice(-(MAX_HISTORY - 1)), snapshot]
              : [...prev, snapshot];
          return trimmed;
        });
        setValidationErrors([]);
        return next;
      });
    },
    []
  );

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      if (!prev.length) return prev;
      const previous = prev[prev.length - 1];
      setDraft(cloneDraft(previous));
      return prev.slice(0, -1);
    });
  }, []);

  const handleReset = useCallback(() => {
    setDraft(cloneDraft(baseline));
    setHistory([]);
    setValidationErrors([]);
    setStatus({ type: 'idle' });
  }, [baseline]);

  const handleCountryFieldChange = useCallback(
    (field: 'code' | 'name' | 'start' | 'end') =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        applyChange(draft => {
          draft[field] = value;
          if (field === 'code') {
            draft[field] = value.toLowerCase();
          }
          return draft;
        });
      },
    [applyChange]
  );

  const handleAddPresident = () => {
    applyChange(draft => {
      draft.presidents.push(createEmptyPresident());
      return draft;
    });
  };

  const handleRemovePresident = (index: number) => {
    applyChange(draft => {
      draft.presidents.splice(index, 1);
      return draft;
    });
  };

  const updatePresident = (
    index: number,
    updater: (president: PresidentForm) => void
  ) => {
    applyChange(draft => {
      const president = draft.presidents[index];
      if (president) {
        updater(president);
      }
      return draft;
    });
  };

  type PresidentFieldKey = 'name' | 'party' | 'birth' | 'death';

  const handlePresidentFieldChange =
    (index: number, field: PresidentFieldKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      updatePresident(index, president => {
        president[field] = value;
      });
    };

  const handleAddPresidentEvent = (index: number) => {
    updatePresident(index, president => {
      president.events.push(createEmptyEvent());
    });
  };

  const handleRemovePresidentEvent = (presidentIndex: number, eventIndex: number) => {
    updatePresident(presidentIndex, president => {
      president.events.splice(eventIndex, 1);
    });
  };

  type EventFieldKey = 'date' | 'type' | 'text';

  const handleEventFieldChange =
    (presidentIndex: number, eventIndex: number, field: EventFieldKey) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value = event.target.value;
      updatePresident(presidentIndex, president => {
        const targetEvent = president.events[eventIndex];
        if (targetEvent) {
          if (field === 'type') {
            targetEvent.type = value as EventTypeString;
          } else if (field === 'date') {
            targetEvent.date = value;
          } else {
            targetEvent.text = value;
          }
        }
      });
    };

  const handleAddMonarch = () => {
    applyChange(draft => {
      draft.monarchs.push(createEmptyMonarch());
      return draft;
    });
  };

  const handleRemoveMonarch = (index: number) => {
    applyChange(draft => {
      draft.monarchs.splice(index, 1);
      return draft;
    });
  };

  const updateMonarch = (
    index: number,
    updater: (monarch: MonarchForm) => void
  ) => {
    applyChange(draft => {
      const monarch = draft.monarchs[index];
      if (monarch) {
        updater(monarch);
      }
      return draft;
    });
  };

  type MonarchFieldKey =
    | 'name'
    | 'birth'
    | 'death'
    | 'start_reign'
    | 'end_reign'
    | 'death_cause'
    | 'notes';

  const handleMonarchFieldChange =
    (index: number, field: MonarchFieldKey) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value = event.target.value;
      updateMonarch(index, monarch => {
        monarch[field] = value;
      });
    };

  const isSaving = status.type === 'saving';

  const presidentSummaries = useMemo(
    () =>
      draft.presidents.map((president, index) => {
        const emptyEvents = president.events.filter(
          event => !event.date || !event.text.trim()
        );

        return {
          formId: president.formId,
          label: president.name.trim() || `President ${index + 1}`,
          emptyEvents,
        };
      }),
    [draft.presidents]
  );

  const firstEmptyEvent = useMemo(() => {
    for (const president of draft.presidents) {
      for (const event of president.events) {
        if (!event.date || !event.text.trim()) {
          return { presidentId: president.formId, eventId: event.formId };
        }
      }
    }
    return null;
  }, [draft.presidents]);

  const scrollToPresident = (formId: string) => {
    const element = presidentRefs.current[formId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToEvent = (presidentId: string, eventId: string) => {
    scrollToPresident(presidentId);
    const element = eventRefs.current[eventId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const saveDraft = useCallback(
    async (reason: 'manual' | 'auto' = 'manual') => {
      if (isSaving) return;

      const normalizedDraft = normalizeDraftForSave(draft);
      setDraft(normalizedDraft);

      const errors = validateDraft(normalizedDraft);
      if (errors.length) {
        setValidationErrors(errors);
        setStatus({
          type: 'error',
          message: 'Please fix the highlighted issues before saving.',
        });
        return;
      }

      setStatus({
        type: 'saving',
        message: reason === 'auto' ? 'Saving…' : 'Saving changes…',
      });

      try {
        const payload = buildPayload(normalizedDraft);
        const endpoint =
          mode === 'edit' && normalizedDraft.id
            ? `/api/admin/countries/${normalizedDraft.id}`
            : '/api/admin/countries';
        const method = mode === 'edit' && normalizedDraft.id ? 'PUT' : 'POST';

        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          const message =
            typeof data?.error === 'string'
              ? data.error
              : 'Failed to save changes.';
          setStatus({ type: 'error', message });
          return;
        }

        if (!data?.country) {
          setStatus({
            type: 'error',
            message: 'Unexpected response from the server.',
          });
          return;
        }

        const nextDraft = toCountryDraft(data.country as AdminCountry);
        setBaseline(nextDraft);
        setDraft(nextDraft);
        setHistory([]);
        setValidationErrors([]);
        setStatus({
          type: 'success',
          message: 'Changes saved successfully.',
        });

        if (mode === 'create' && data.country?.id) {
          router.replace(`/admin/countries/${data.country.id}`);
          router.refresh();
        } else {
          router.refresh();
        }
      } catch (error) {
        console.error('[admin editor] Failed to save country', error);
        setStatus({
          type: 'error',
          message: 'Something went wrong while saving. Please try again.',
        });
      }
    },
    [draft, isSaving, mode, router]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveDraft('manual');
  };

  useEffect(() => {
    if (status.type === 'success') {
      const timeout = setTimeout(
        () => setStatus({ type: 'idle' }),
        2000
      );
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [status]);

  useEffect(() => {
    if (mode !== 'edit') return undefined;
    if (!isDirty || isSaving) return undefined;

    const timeout = setTimeout(() => {
      void saveDraft('auto');
    }, 1200);

    return () => clearTimeout(timeout);
  }, [isDirty, isSaving, mode, saveDraft]);

  return (
    <form className="admin-editor" onSubmit={handleSubmit}>
      <div className="admin-editor-toolbar">
        <div className="admin-editor-breadcrumbs">
          <Link href="/admin">← Back to Admin</Link>
          <span className="admin-editor-divider">/</span>
          <span>{mode === 'edit' ? draft.name || 'Edit Country' : 'New Country'}</span>
        </div>
        <div className="admin-editor-actions">
          <button
            className="admin-secondary-button"
            type="button"
            onClick={handleUndo}
            disabled={!history.length}
          >
            Undo
          </button>
          <button
            className="admin-secondary-button"
            type="button"
            onClick={handleReset}
            disabled={!isDirty && !history.length}
          >
            Reset
          </button>
          <button
            className="admin-primary-button"
            type="submit"
            disabled={!isDirty || isSaving}
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {status.type !== 'idle' && status.message && (
        <div
          className={`admin-feedback admin-feedback-${status.type}`}
          role={status.type === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="admin-feedback admin-feedback-error" role="alert">
          <p>Please review the following issues:</p>
          <ul>
            {validationErrors.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {(draft.presidents.length > 0 || firstEmptyEvent) && (
        <section className="admin-quick-nav" aria-label="Quick navigation">
          <div className="admin-quick-nav-heading">
            <h3>Jump around faster</h3>
            {firstEmptyEvent && (
              <button
                className="admin-secondary-button"
                type="button"
                onClick={() =>
                  scrollToEvent(
                    firstEmptyEvent.presidentId,
                    firstEmptyEvent.eventId
                  )
                }
              >
                Go to first empty event
              </button>
            )}
          </div>
          <div className="admin-quick-nav-grid">
            <div className="admin-quick-nav-label">Presidents</div>
            <div className="admin-quick-nav-buttons">
              {draft.presidents.length === 0 && (
                <span className="admin-chip-muted">None yet — add your first president below.</span>
              )}
              {presidentSummaries.map(summary => (
                <button
                  key={summary.formId}
                  className="admin-chip-button"
                  type="button"
                  onClick={() => scrollToPresident(summary.formId)}
                >
                  <span className="admin-chip-label">{summary.label}</span>
                  {summary.emptyEvents.length > 0 && (
                    <span className="admin-chip-badge">
                      {summary.emptyEvents.length} empty event
                      {summary.emptyEvents.length > 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="admin-editor-section">
        <h2>Country details</h2>
        <div className="admin-form-grid">
          <label>
            <span>Code</span>
            <input
              autoComplete="off"
              value={draft.code}
              onChange={handleCountryFieldChange('code')}
              placeholder="e.g. aerobea"
              required
            />
          </label>
          <label>
            <span>Name</span>
            <input
              value={draft.name}
              onChange={handleCountryFieldChange('name')}
              placeholder="Country name"
              required
            />
          </label>
          <label>
            <span>Timeline start</span>
            <input
              type="date"
              value={draft.start}
              onChange={handleCountryFieldChange('start')}
              required
            />
          </label>
          <label>
            <span>Timeline end</span>
            <input
              type="date"
              value={draft.end}
              onChange={handleCountryFieldChange('end')}
              placeholder="Leave blank if ongoing"
            />
          </label>
        </div>
      </section>

      <section className="admin-editor-section">
        <div className="admin-section-header">
          <h2>Presidents</h2>
          <button
            className="admin-secondary-button"
            type="button"
            onClick={handleAddPresident}
          >
            + Add President
          </button>
        </div>

        {draft.presidents.length === 0 && (
          <p className="admin-empty-hint">
            No presidents have been added yet. Use &ldquo;Add President&rdquo; to
            get started.
          </p>
        )}

          {draft.presidents.map((president, index) => (
            <article
              className="admin-entity-card"
              key={president.formId}
              ref={element => {
                presidentRefs.current[president.formId] = element;
              }}
            >
            <header className="admin-entity-header">
              <h3>President {index + 1}</h3>
              <button
                className="admin-text-button"
                type="button"
                onClick={() => handleRemovePresident(index)}
              >
                Remove
              </button>
            </header>

            <AdminEntityImagePreview
              label={`President ${index + 1}`}
              name={president.name}
            />

            <div className="admin-form-grid">
              <label>
                <span>Name</span>
                <input
                  value={president.name}
                  onChange={handlePresidentFieldChange(index, 'name')}
                  placeholder="Full name"
                  required
                />
              </label>
              <label>
                <span>Party</span>
                <input
                  value={president.party}
                  onChange={handlePresidentFieldChange(index, 'party')}
                  placeholder="Political party"
                  required
                />
              </label>
              <label>
                <span>Birth date</span>
                <input
                  type="date"
                  value={president.birth}
                  onChange={handlePresidentFieldChange(index, 'birth')}
                  required
                />
              </label>
              <label>
                <span>Death date</span>
                <input
                  type="date"
                  value={president.death}
                  onChange={handlePresidentFieldChange(index, 'death')}
                  placeholder="Leave blank if alive"
                />
              </label>
            </div>

            <div className="admin-subsection">
              <div className="admin-section-header">
                <h4>Key events</h4>
                <button
                  className="admin-text-button"
                  type="button"
                  onClick={() => handleAddPresidentEvent(index)}
                >
                  + Add Event
                </button>
              </div>

              {president.events.length === 0 && (
                <p className="admin-empty-hint">
                  No events recorded yet. Use &ldquo;Add Event&rdquo; to capture
                  milestones.
                </p>
              )}

                
              {president.events.map((event, eventIndex) => {
                const isIncomplete = !event.date || !event.text.trim();
                return (
                  <div
                    className={`admin-event-row${
                      isIncomplete ? ' admin-event-row-incomplete' : ''
                    }`}
                    key={event.formId}
                    ref={element => {
                      eventRefs.current[event.formId] = element;
                    }}
                  >
                    <div className="admin-event-fields">
                      <label>
                        <span>Date &amp; time</span>
                        <input
                          type="datetime-local"
                          value={event.date}
                          onChange={handleEventFieldChange(
                            index,
                            eventIndex,
                            'date'
                          )}
                          required
                        />
                      </label>
                      <label>
                        <span>Event type</span>
                        <select
                          value={event.type}
                          onChange={handleEventFieldChange(
                            index,
                            eventIndex,
                            'type'
                          )}
                        >
                          {eventTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="admin-event-text">
                      <span>Description</span>
                      <textarea
                        value={event.text}
                        onChange={handleEventFieldChange(
                          index,
                          eventIndex,
                          'text'
                        )}
                        rows={3}
                        placeholder="Describe what happened…"
                        required
                      />
                    </label>
                    <button
                      className="admin-text-button admin-event-remove"
                      type="button"
                      onClick={() =>
                        handleRemovePresidentEvent(index, eventIndex)
                      }
                    >
                      Remove event
                    </button>
                  </div>
                );
              })}

              </div>
            </article>
          ))}
      </section>

      <section className="admin-editor-section">
        <div className="admin-section-header">
          <h2>Monarchs</h2>
          <button
            className="admin-secondary-button"
            type="button"
            onClick={handleAddMonarch}
          >
            + Add Monarch
          </button>
        </div>

        {draft.monarchs.length === 0 && (
          <p className="admin-empty-hint">
            No monarchs recorded. Use &ldquo;Add Monarch&rdquo; to include their
            timeline.
          </p>
        )}

        {draft.monarchs.map((monarch, index) => (
          <article className="admin-entity-card" key={monarch.formId}>
            <header className="admin-entity-header">
              <h3>Monarch {index + 1}</h3>
              <button
                className="admin-text-button"
                type="button"
                onClick={() => handleRemoveMonarch(index)}
              >
                Remove
              </button>
            </header>

            <AdminEntityImagePreview
              label={`Monarch ${index + 1}`}
              name={monarch.name}
            />

            <div className="admin-form-grid">
              <label>
                <span>Name</span>
                <input
                  value={monarch.name}
                  onChange={handleMonarchFieldChange(index, 'name')}
                  placeholder="Full name"
                  required
                />
              </label>
              <label>
                <span>Birth date</span>
                <input
                  type="date"
                  value={monarch.birth}
                  onChange={handleMonarchFieldChange(index, 'birth')}
                  required
                />
              </label>
              <label>
                <span>Death date</span>
                <input
                  type="date"
                  value={monarch.death}
                  onChange={handleMonarchFieldChange(index, 'death')}
                  placeholder="Leave blank if alive"
                />
              </label>
              <label>
                <span>Reign starts</span>
                <input
                  type="date"
                  value={monarch.start_reign}
                  onChange={handleMonarchFieldChange(index, 'start_reign')}
                  required
                />
              </label>
              <label>
                <span>Reign ends</span>
                <input
                  type="date"
                  value={monarch.end_reign}
                  onChange={handleMonarchFieldChange(index, 'end_reign')}
                  placeholder="Leave blank if ongoing"
                />
              </label>
              <label>
                <span>Death cause</span>
                <input
                  value={monarch.death_cause}
                  onChange={handleMonarchFieldChange(index, 'death_cause')}
                  placeholder="Optional"
                />
              </label>
            </div>

            <label className="admin-notes-field">
              <span>Notes</span>
              <textarea
                rows={3}
                value={monarch.notes}
                onChange={handleMonarchFieldChange(index, 'notes')}
                placeholder="Optional notes or context"
              />
            </label>
          </article>
        ))}
      </section>
    </form>
  );
};

export default AdminCountryEditorClient;
