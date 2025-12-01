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
  type EventType,
} from '../../../lib/timeline';
import type { AdminCountry } from '../types';
import '../admin.css';
import ImageUploader from '../components/ImageUploader';
import AiImageModal from '../components/AiImageModal';
import {
  CountryDraft,
  EditorMode,
  EventTypeString,
  MonarchForm,
  PresidentForm,
  SaveStatus,
  TimelineEventForm,
  areDraftsEqual,
  buildPayload,
  cloneDraft,
  createEmptyEvent,
  createEmptyMonarch,
  createEmptyPresident,
  eventTypeOptions,
  normalizeDraftForSave,
  toCountryDraft,
  validateDraft,
  MAX_HISTORY,
} from './shared';

interface AdminCountryEditorClientProps {
  mode: EditorMode;
  initialCountry?: AdminCountry;
}

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
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(false);
  const [activePresidentId, setActivePresidentId] = useState<string | null>(
    initialDraft.presidents[0]?.formId || null
  );
  const [activeMonarchId, setActiveMonarchId] = useState<string | null>(
    initialDraft.monarchs[0]?.formId || null
  );
  const [immediateSavePending, setImmediateSavePending] = useState(false);

  // AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalLeaderName, setAiModalLeaderName] = useState('');
  const [aiModalDecade, setAiModalDecade] = useState('');
  const [aiModalInitialImage, setAiModalInitialImage] = useState<string | undefined>(undefined);
  const [aiModalOnSelect, setAiModalOnSelect] = useState<(url: string) => void>(() => { });

  // Refs to track state across refreshes (router.refresh() updates initialDraft with new IDs)
  const draftRef = useRef(draft);
  const activePresidentIdRef = useRef(activePresidentId);
  const activeMonarchIdRef = useRef(activeMonarchId);

  useEffect(() => {
    draftRef.current = draft;
    activePresidentIdRef.current = activePresidentId;
    activeMonarchIdRef.current = activeMonarchId;
  }, [draft, activePresidentId, activeMonarchId]);

  useEffect(() => {
    if (draft.presidents.length > 0 && !activePresidentId) {
      setActivePresidentId(draft.presidents[0].formId);
    }
  }, [draft.presidents, activePresidentId]);

  useEffect(() => {
    if (draft.monarchs.length > 0 && !activeMonarchId) {
      setActiveMonarchId(draft.monarchs[0].formId);
    }
  }, [draft.monarchs, activeMonarchId]);

  useEffect(() => {
    // Capture indices from the PREVIOUS draft state (stored in refs)
    const prevDraft = draftRef.current;
    const prevActivePresidentId = activePresidentIdRef.current;
    const prevActiveMonarchId = activeMonarchIdRef.current;

    const activePresidentIndex = prevDraft.presidents.findIndex(
      p => p.formId === prevActivePresidentId
    );
    const activeMonarchIndex = prevDraft.monarchs.findIndex(
      m => m.formId === prevActiveMonarchId
    );

    setBaseline(initialDraft);
    setDraft(initialDraft);
    setHistory([]);
    setValidationErrors([]);
    setStatus({ type: 'idle' });

    // Restore selection using indices
    if (activePresidentIndex !== -1 && initialDraft.presidents[activePresidentIndex]) {
      setActivePresidentId(initialDraft.presidents[activePresidentIndex].formId);
    } else if (initialDraft.presidents.length > 0 && !activePresidentIdRef.current) {
      // Fallback to first if no selection existed (or if it was lost)
    }

    if (activeMonarchIndex !== -1 && initialDraft.monarchs[activeMonarchIndex]) {
      setActiveMonarchId(initialDraft.monarchs[activeMonarchIndex].formId);
    }
  }, [initialDraft]);

  const isDirty = useMemo(
    () =>
      !areDraftsEqual(
        normalizeDraftForSave(draft),
        normalizeDraftForSave(baseline)
      ),
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
    const newPresident = createEmptyPresident();
    applyChange(draft => {
      draft.presidents.push(newPresident);
      return draft;
    });
    setActivePresidentId(newPresident.formId);
  };

  const handleRemovePresident = (index: number) => {
    const presidentToRemove = draft.presidents[index];
    applyChange(draft => {
      draft.presidents.splice(index, 1);
      return draft;
    });
    if (presidentToRemove.formId === activePresidentId) {
      // If we removed the active one, switch to the previous one, or the first one, or null
      // We rely on useEffect to pick a new one if needed
      setActivePresidentId(null);
    }
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
          // @ts-ignore - dynamic key access
          president[field] = value;
        });
      };

  const handlePresidentImageChange = (index: number) => (url: string) => {
    updatePresident(index, president => {
      president.imageUrl = url;
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
    const newMonarch = createEmptyMonarch();
    applyChange(draft => {
      draft.monarchs.push(newMonarch);
      return draft;
    });
    setActiveMonarchId(newMonarch.formId);
  };

  const handleRemoveMonarch = (index: number) => {
    const monarchToRemove = draft.monarchs[index];
    applyChange(draft => {
      draft.monarchs.splice(index, 1);
      return draft;
    });
    if (monarchToRemove.formId === activeMonarchId) {
      setActiveMonarchId(null);
    }
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
          // @ts-ignore - dynamic key access
          monarch[field] = value;
        });
      };

  const handleMonarchImageChange = (index: number) => (url: string) => {
    updateMonarch(index, monarch => {
      monarch.imageUrl = url;
    });
  };

  const isSaving = status.type === 'saving';

  const saveDraft = useCallback(
    async (reason: 'manual' | 'auto' = 'manual'): Promise<AdminCountry | null> => {
      if (isSaving) return null;

      const normalizedDraft = normalizeDraftForSave(draft);

      const errors = validateDraft(normalizedDraft);
      if (errors.length) {
        setValidationErrors(errors);
        setStatus({
          type: 'error',
          message: 'Please fix the highlighted issues before saving.',
        });
        return null;
      }

      // Capture active indices before save to restore selection after ID regeneration
      const activePresidentIndex = draft.presidents.findIndex(
        p => p.formId === activePresidentId
      );
      const activeMonarchIndex = draft.monarchs.findIndex(
        m => m.formId === activeMonarchId
      );

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
          return null;
        }

        if (!data?.country) {
          setStatus({
            type: 'error',
            message: 'Unexpected response from the server.',
          });
          return null;
        }

        const nextDraft = toCountryDraft(data.country as AdminCountry);
        setBaseline(nextDraft);
        if (reason === 'manual') {
          setDraft(nextDraft);

          // Restore active selection by index
          if (activePresidentIndex !== -1 && nextDraft.presidents[activePresidentIndex]) {
            setActivePresidentId(nextDraft.presidents[activePresidentIndex].formId);
          }
          if (activeMonarchIndex !== -1 && nextDraft.monarchs[activeMonarchIndex]) {
            setActiveMonarchId(nextDraft.monarchs[activeMonarchIndex].formId);
          }
        }
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

        return data.country as AdminCountry;
      } catch (error) {
        console.error('[admin editor] Failed to save country', error);
        setStatus({
          type: 'error',
          message: 'Something went wrong while saving. Please try again.',
        });
        return null;
      }
    },
    [draft, isSaving, mode, router, activePresidentId, activeMonarchId]
  );

  const handleViewTimeline = useCallback(async () => {
    if (mode !== 'edit' || isSaving) return;

    const normalizedDraft = normalizeDraftForSave(draft);
    let targetCode = normalizedDraft.code;

    if (isDirty) {
      const saved = await saveDraft('manual');
      if (!saved) return;
      targetCode = saved.code;
    }

    router.push(`/#${targetCode.toLowerCase()}`);
  }, [draft, isDirty, isSaving, mode, router, saveDraft]);

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
    if (!autosaveEnabled) return undefined;
    if (!isDirty || isSaving) return undefined;

    const timeout = setTimeout(() => {
      void saveDraft('auto');
    }, 1200);

    return () => clearTimeout(timeout);
  }, [autosaveEnabled, isDirty, isSaving, mode, saveDraft]);

  // Immediate save effect for AI image selection
  useEffect(() => {
    if (immediateSavePending && !isSaving && isDirty) {
      void saveDraft('manual');
      setImmediateSavePending(false);
    }
  }, [draft, immediateSavePending, isSaving, isDirty, saveDraft]);

  return (
    <form className="admin-editor" onSubmit={handleSubmit}>
      <div className="admin-editor-toolbar">
        <div className="admin-editor-breadcrumbs">
          <Link href="/admin">← Back to Admin</Link>
          <span className="admin-editor-divider">/</span>
          <span>{mode === 'edit' ? draft.name || 'Edit Country' : 'New Country'}</span>
        </div>
        <div className="admin-editor-actions">
          {mode === 'edit' && draft.id && (
            <Link
              href={`/admin/countries/${draft.id}/json`}
              className="admin-secondary-button"
            >
              Edit JSON
            </Link>
          )}
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={autosaveEnabled}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setAutosaveEnabled(event.target.checked)
              }
            />
            <span>Autosave</span>
          </label>
          {mode === 'edit' && (
            <button
              className="admin-secondary-button"
              type="button"
              onClick={handleViewTimeline}
              disabled={isSaving}
            >
              View Timeline
            </button>
          )}
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

      <div className="admin-feedback-slot" aria-live="polite">
        {status.type !== 'idle' && status.message && (
          <div
            className={`admin-feedback admin-feedback-${status.type}`}
            role={status.type === 'error' ? 'alert' : 'status'}
          >
            {status.message}
          </div>
        )}
      </div>

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

        {draft.presidents.length > 0 && (
          <div className="admin-tabs">
            {draft.presidents.map((president, index) => (
              <button
                key={president.formId}
                type="button"
                className={`admin-tab ${activePresidentId === president.formId ? 'active' : ''}`}
                onClick={() => setActivePresidentId(president.formId)}
              >
                {president.name.trim() || `President ${index + 1}`}
              </button>
            ))}
          </div>
        )}

        {draft.presidents.map((president, index) => {
          if (president.formId !== activePresidentId) return null;

          return (
            <article
              className="admin-entity-card"
              key={president.formId}
              ref={element => {
                presidentRefs.current[president.formId] = element;
              }}
            >
              <header className="admin-entity-header">
                <h3>{president.name.trim() || `President ${index + 1}`}</h3>
                <button
                  className="admin-text-button"
                  type="button"
                  onClick={() => handleRemovePresident(index)}
                >
                  Remove
                </button>
              </header>

              <ImageUploader
                label={`President ${index + 1}`}
                imageUrl={president.imageUrl}
                onImageChange={handlePresidentImageChange(index)}
              />
              <div className="admin-ai-buttons">
                <button
                  type="button"
                  className="admin-button ai"
                  onClick={() => {
                    const startEvent = president.events.find(e => e.type === '1');
                    const dateStr = startEvent?.date || president.birth || draft.start;
                    const year = parseInt(dateStr.slice(0, 4));
                    const decade = isNaN(year) ? '1800s' : `${Math.floor(year / 10) * 10}s`;

                    setAiModalLeaderName(president.name);
                    setAiModalDecade(decade);
                    setAiModalInitialImage(president.imageUrl);
                    setAiModalOnSelect(() => handlePresidentImageChange(index));
                    setIsAiModalOpen(true);
                  }}
                >
                  Generate / Edit AI Portrait
                </button>
              </div>

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
                      className={`admin-event-row${isIncomplete ? ' admin-event-row-incomplete' : ''
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
          );
        })}
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

        {draft.monarchs.length > 0 && (
          <div className="admin-tabs">
            {draft.monarchs.map((monarch, index) => (
              <button
                key={monarch.formId}
                type="button"
                className={`admin-tab ${activeMonarchId === monarch.formId ? 'active' : ''}`}
                onClick={() => setActiveMonarchId(monarch.formId)}
              >
                {monarch.name.trim() || `Monarch ${index + 1}`}
              </button>
            ))}
          </div>
        )}

        {draft.monarchs.map((monarch, index) => {
          if (monarch.formId !== activeMonarchId) return null;

          return (
            <article className="admin-entity-card" key={monarch.formId}>
              <header className="admin-entity-header">
                <h3>{monarch.name.trim() || `Monarch ${index + 1}`}</h3>
                <button
                  className="admin-text-button"
                  type="button"
                  onClick={() => handleRemoveMonarch(index)}
                >
                  Remove
                </button>
              </header>

              <ImageUploader
                label={`Monarch ${index + 1}`}
                imageUrl={monarch.imageUrl}
                onImageChange={handleMonarchImageChange(index)}
              />
              <div className="admin-ai-buttons">
                <button
                  type="button"
                  className="admin-button ai"
                  onClick={() => {
                    const dateStr = monarch.start_reign || monarch.birth || draft.start;
                    const year = parseInt(dateStr.slice(0, 4));
                    const decade = isNaN(year) ? '1800s' : `${Math.floor(year / 10) * 10}s`;

                    setAiModalLeaderName(monarch.name);
                    setAiModalDecade(decade);
                    setAiModalInitialImage(monarch.imageUrl);
                    setAiModalOnSelect(() => handleMonarchImageChange(index));
                    setIsAiModalOpen(true);
                  }}
                >
                  Generate / Edit AI Portrait
                </button>
              </div>

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
          );
        })}
      </section>

      <AiImageModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectImage={(url) => {
          aiModalOnSelect(url);
          setImmediateSavePending(true);
        }}
        initialImage={aiModalInitialImage}
        leaderName={aiModalLeaderName}
        decade={aiModalDecade}
      />
    </form>
  );
};

export default AdminCountryEditorClient;
