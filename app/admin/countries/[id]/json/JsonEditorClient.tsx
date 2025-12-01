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

    // We maintain a "draft" state similar to the main editor, but here we primarily
    // manipulate it via JSON parsing.
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

    const [isPresidentsJsonDirty, setIsPresidentsJsonDirty] = useState(false);
    const [isMonarchsJsonDirty, setIsMonarchsJsonDirty] = useState(false);

    // Sync draft from initialCountry when it changes (e.g. after save)
    useEffect(() => {
        setDraft(initialDraft);
        setPresidentsJson(formatPresidentsJson(initialDraft.presidents));
        setMonarchsJson(formatMonarchsJson(initialDraft.monarchs));
        setPresidentsJsonError(null);
        setMonarchsJsonError(null);
        setIsPresidentsJsonDirty(false);
        setIsMonarchsJsonDirty(false);
    }, [initialDraft]);

    const handlePresidentsJsonChange = useCallback((value: string) => {
        setPresidentsJson(value);
        setIsPresidentsJsonDirty(true);
        setPresidentsJsonError(null);

        // Try to parse and update draft immediately to keep them in sync?
        // Or just wait for "Apply"? The original editor had "Apply" buttons.
        // But here, the whole page IS the editor.
        // Let's keep the "Apply" logic for validation feedback, but maybe we don't strictly need it
        // if we validate on save. However, the JsonEditor component has an "Apply" button.
        // Let's use the Apply button to "commit" the JSON to the internal draft state,
        // which then enables the global "Save" button.
    }, []);

    const handleMonarchsJsonChange = useCallback((value: string) => {
        setMonarchsJson(value);
        setIsMonarchsJsonDirty(true);
        setMonarchsJsonError(null);
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
            // We don't clear dirty flag here because "dirty" in JsonEditor means "different from prop value"
            // But here we want to track "different from saved state".
            // Actually, in the original component, `isPresidentsJsonDirty` tracked if the text area
            // content differed from the `draft` state.
            // Here, let's say "Apply" updates the draft.
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
    }, [draft.presidents]);

    const handleResetMonarchsJson = useCallback(() => {
        setMonarchsJson(formatMonarchsJson(draft.monarchs));
        setIsMonarchsJsonDirty(false);
        setMonarchsJsonError(null);
    }, [draft.monarchs]);

    // Global save
    const isGlobalDirty = useMemo(() => {
        // If JSON is dirty (not applied), we consider it dirty but maybe not saveable yet?
        // Or we can try to apply on save.
        // Let's check if the draft is different from initialDraft.
        return !areDraftsEqual(normalizeDraftForSave(draft), normalizeDraftForSave(initialDraft));
    }, [draft, initialDraft]);

    const handleSave = async () => {
        if (status.type === 'saving') return;

        // First, try to apply any pending JSON changes
        let currentDraft = draft;

        if (isPresidentsJsonDirty) {
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
            try {
                const parsed = parseMonarchsJson(monarchsJson);
                currentDraft = { ...currentDraft, monarchs: parsed };
                setMonarchsJsonError(null);
            } catch (error) {
                setMonarchsJsonError(error instanceof Error ? error.message : 'Invalid JSON');
                return;
            }
        }

        // Validate
        const normalizedDraft = normalizeDraftForSave(currentDraft);
        const errors = validateDraft(normalizedDraft);
        if (errors.length) {
            setStatus({
                type: 'error',
                message: 'Validation failed: ' + errors[0], // Just show first error for now
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
                        className="admin-primary-button"
                        type="button"
                        onClick={handleSave}
                        disabled={(!isGlobalDirty && !isPresidentsJsonDirty && !isMonarchsJsonDirty) || status.type === 'saving'}
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

            <div className="admin-json-editor-grid full-page">
                <JsonEditor
                    title="Presidents JSON"
                    description="Edit presidents, parties, dates, and timeline events."
                    value={presidentsJson}
                    onChange={handlePresidentsJsonChange}
                    onApply={handleApplyPresidentsJson}
                    onReset={handleResetPresidentsJson}
                    error={presidentsJsonError}
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
                    dirty={isMonarchsJsonDirty}
                />
            </div>

            <style jsx global>{`
        .admin-json-editor-grid.full-page {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem;
          height: calc(100vh - 80px);
        }
        .admin-json-editor-grid.full-page .admin-json-editor-block {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .admin-json-editor-grid.full-page .admin-code-wrapper {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .admin-json-editor-grid.full-page .admin-code-editor {
          flex: 1;
          overflow: auto;
        }
      `}</style>
        </div>
    );
};

export default JsonEditorClient;
