'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import JsonEditor from '../../../components/JsonEditor';
import {
    CountryDraft,
    formatMonarchsJson,
    formatPresidentsJson,
    parseMonarchsJson,
    parsePresidentsJson,
    toCountryDraft,
    buildPayload,
    normalizeDraftForSave,
    validateDraft,
    areDraftsEqual,
    cloneDraft,
    validatePresidentsJson,
    validateMonarchsJson,
    validateSemantics,
} from '../../shared';
import type { AdminCountry } from '../../../types';
import '../../../admin.css';

interface JsonEditorClientProps {
    initialCountry: AdminCountry;
}

interface SaveStatus {
    type: 'idle' | 'saving' | 'success' | 'error';
    message?: string;
}

const JsonEditorClient = ({ initialCountry }: JsonEditorClientProps) => {
    const router = useRouter();
    const initialDraft = useMemo(() => toCountryDraft(initialCountry), [initialCountry]);

    const [draft, setDraft] = useState<CountryDraft>(initialDraft);
    const [status, setStatus] = useState<SaveStatus>({ type: 'idle' });

    const [presidentsJson, setPresidentsJson] = useState(() =>
        formatPresidentsJson(initialDraft.presidents)
    );
    const [monarchsJson, setMonarchsJson] = useState(() =>
        formatMonarchsJson(initialDraft.monarchs)
    );

    const [presidentsJsonError, setPresidentsJsonError] = useState<string | null>(null);
    const [monarchsJsonError, setMonarchsJsonError] = useState<string | null>(null);

    const [presidentsWarnings, setPresidentsWarnings] = useState<string[]>([]);
    const [monarchsWarnings, setMonarchsWarnings] = useState<string[]>([]);
    const [semanticWarnings, setSemanticWarnings] = useState<string[]>([]);
    const [aiReviewIssues, setAiReviewIssues] = useState<string[]>([]);
    const [isAiReviewing, setIsAiReviewing] = useState(false);

    const [isPresidentsJsonDirty, setIsPresidentsJsonDirty] = useState(false);
    const [isMonarchsJsonDirty, setIsMonarchsJsonDirty] = useState(false);

    useEffect(() => {
        setDraft(initialDraft);
        setPresidentsJson(formatPresidentsJson(initialDraft.presidents));
        setMonarchsJson(formatMonarchsJson(initialDraft.monarchs));
        setPresidentsJsonError(null);
        setMonarchsJsonError(null);
        setPresidentsWarnings([]);
        setMonarchsWarnings([]);
        setSemanticWarnings([]);
        setAiReviewIssues([]);
        setIsPresidentsJsonDirty(false);
        setIsMonarchsJsonDirty(false);
    }, [initialDraft]);

    // Run semantic validation whenever draft changes
    useEffect(() => {
        const warnings = validateSemantics(draft);
        setSemanticWarnings(warnings);
    }, [draft]);

    const handlePresidentsJsonChange = useCallback((value: string) => {
        setPresidentsJson(value);
        setIsPresidentsJsonDirty(true);
        setPresidentsJsonError(null);

        const result = validatePresidentsJson(value);
        setPresidentsWarnings(result.errors);
    }, []);

    const handleMonarchsJsonChange = useCallback((value: string) => {
        setMonarchsJson(value);
        setIsMonarchsJsonDirty(true);
        setMonarchsJsonError(null);

        const result = validateMonarchsJson(value);
        setMonarchsWarnings(result.errors);
    }, []);

    const handleApplyPresidentsJson = useCallback(() => {
        try {
            const parsed = parsePresidentsJson(presidentsJson);
            setDraft(current => {
                const next = cloneDraft(current);
                next.presidents = parsed;
                return next;
            });
            setPresidentsJsonError(null);
            setIsPresidentsJsonDirty(false);
        } catch (error) {
            setPresidentsJsonError(
                error instanceof Error ? error.message : 'Invalid presidents JSON.'
            );
        }
    }, [presidentsJson]);

    const handleApplyMonarchsJson = useCallback(() => {
        try {
            const parsed = parseMonarchsJson(monarchsJson);
            setDraft(current => {
                const next = cloneDraft(current);
                next.monarchs = parsed;
                return next;
            });
            setMonarchsJsonError(null);
            setIsMonarchsJsonDirty(false);
        } catch (error) {
            setMonarchsJsonError(
                error instanceof Error ? error.message : 'Invalid monarchs JSON.'
            );
        }
    }, [monarchsJson]);

    const handleResetPresidentsJson = useCallback(() => {
        setPresidentsJson(formatPresidentsJson(draft.presidents));
        setIsPresidentsJsonDirty(false);
        setPresidentsJsonError(null);
        setPresidentsWarnings([]);
    }, [draft.presidents]);

    const handleResetMonarchsJson = useCallback(() => {
        setMonarchsJson(formatMonarchsJson(draft.monarchs));
        setIsMonarchsJsonDirty(false);
        setMonarchsJsonError(null);
        setMonarchsWarnings([]);
    }, [draft.monarchs]);

    const handleAiReview = async () => {
        setIsAiReviewing(true);
        setAiReviewIssues([]);
        try {
            // Ensure we are reviewing the latest applied state
            const payload = {
                presidents: draft.presidents,
                monarchs: draft.monarchs,
            };

            const response = await fetch('/api/ai/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.issues) {
                setAiReviewIssues(data.issues);
            } else if (data.error) {
                setAiReviewIssues([`Error: ${data.error}`]);
            }
        } catch (error) {
            setAiReviewIssues(['Failed to run AI review.']);
        } finally {
            setIsAiReviewing(false);
        }
    };

    const isGlobalDirty = useMemo(() => {
        return !areDraftsEqual(normalizeDraftForSave(draft), normalizeDraftForSave(initialDraft));
    }, [draft, initialDraft]);

    const handleSave = async () => {
        if (status.type === 'saving') return;

        let currentDraft = draft;

        if (isPresidentsJsonDirty) {
            if (presidentsWarnings.length > 0) {
                setPresidentsJsonError('Please fix validation warnings before saving.');
                return;
            }
            try {
                const parsed = parsePresidentsJson(presidentsJson);
                currentDraft = { ...currentDraft, presidents: parsed };
                setPresidentsJsonError(null);
            } catch (error) {
                setPresidentsJsonError(error instanceof Error ? error.message : 'Invalid JSON');
                return;
            }
        }

        if (isMonarchsJsonDirty) {
            if (monarchsWarnings.length > 0) {
                setMonarchsJsonError('Please fix validation warnings before saving.');
                return;
            }
            try {
                const parsed = parseMonarchsJson(monarchsJson);
                currentDraft = { ...currentDraft, monarchs: parsed };
                setMonarchsJsonError(null);
            } catch (error) {
                setMonarchsJsonError(error instanceof Error ? error.message : 'Invalid JSON');
                return;
            }
        }

        const normalizedDraft = normalizeDraftForSave(currentDraft);
        const errors = validateDraft(normalizedDraft);
        if (errors.length) {
            setStatus({
                type: 'error',
                message: 'Validation failed: ' + errors[0],
            });
            return;
        }

        setStatus({ type: 'saving', message: 'Saving changes…' });

        try {
            const payload = buildPayload(normalizedDraft);
            const response = await fetch(`/api/admin/countries/${normalizedDraft.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to save changes.');
            }

            setStatus({ type: 'success', message: 'Changes saved successfully.' });
            router.refresh();
        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Something went wrong.',
            });
        }
    };

    useEffect(() => {
        if (status.type === 'success') {
            const timeout = setTimeout(() => setStatus({ type: 'idle' }), 2000);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    return (
        <div className="admin-editor">
            <div className="admin-editor-toolbar">
                <div className="admin-editor-breadcrumbs">
                    <Link href="/admin">← Back to Admin</Link>
                    <span className="admin-editor-divider">/</span>
                    <Link href={`/admin/countries/${initialCountry.id}`}>{initialCountry.name}</Link>
                    <span className="admin-editor-divider">/</span>
                    <span>JSON Editor</span>
                </div>
                <div className="admin-editor-actions">
                    <button
                        className="admin-secondary-button"
                        type="button"
                        onClick={handleAiReview}
                        disabled={isAiReviewing}
                    >
                        {isAiReviewing ? 'Reviewing...' : 'AI Review'}
                    </button>
                    <button
                        className="admin-primary-button"
                        type="button"
                        onClick={handleSave}
                        disabled={(!isGlobalDirty && !isPresidentsJsonDirty && !isMonarchsJsonDirty) || status.type === 'saving' || presidentsWarnings.length > 0 || monarchsWarnings.length > 0}
                    >
                        {status.type === 'saving' ? 'Saving…' : 'Save Changes'}
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

            {semanticWarnings.length > 0 && (
                <div className="admin-feedback admin-feedback-warning" role="alert" style={{ margin: '0 2rem' }}>
                    <p><strong>Semantic Warnings:</strong></p>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {semanticWarnings.map((warning, i) => (
                            <li key={i}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            {aiReviewIssues.length > 0 && (
                <div className="admin-feedback admin-feedback-info" role="alert" style={{ margin: '1rem 2rem 0' }}>
                    <p><strong>AI Review Suggestions:</strong></p>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {aiReviewIssues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="admin-json-editor-grid full-page">
                <JsonEditor
                    title="Presidents JSON"
                    description="Edit presidents, parties, dates, and timeline events."
                    value={presidentsJson}
                    onChange={handlePresidentsJsonChange}
                    onApply={handleApplyPresidentsJson}
                    onReset={handleResetPresidentsJson}
                    error={presidentsJsonError}
                    warnings={presidentsWarnings}
                    dirty={isPresidentsJsonDirty}
                />
                <JsonEditor
                    title="Monarchs JSON"
                    description="Edit monarch biographies, reigns, and notes."
                    value={monarchsJson}
                    onChange={handleMonarchsJsonChange}
                    onApply={handleApplyMonarchsJson}
                    onReset={handleResetMonarchsJson}
                    error={monarchsJsonError}
                    warnings={monarchsWarnings}
                    dirty={isMonarchsJsonDirty}
                />
            </div>

            <style jsx global>{`
        .admin-json-editor-grid.full-page {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          padding: 2rem;
          padding-bottom: 5rem;
        }
        .admin-json-editor-grid.full-page .admin-json-editor-block {
          display: flex;
          flex-direction: column;
        }
        .admin-json-editor-grid.full-page .admin-code-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .admin-json-editor-grid.full-page .admin-code-editor {
          flex: 1;
        }
      `}</style>
        </div>
    );
};

export default JsonEditorClient;
