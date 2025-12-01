'use client';

import { useCallback, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'react-simple-code-editor/lib/index.css';
import 'prismjs/components/prism-json';

export interface JsonEditorProps {
    title: string;
    description: string;
    value: string;
    onChange: (value: string) => void;
    onApply: () => void;
    onReset: () => void;
    error?: string | null;
    dirty: boolean;
}

const JsonEditor = ({
    title,
    description,
    value,
    onChange,
    onApply,
    onReset,
    error,
    dirty,
}: JsonEditorProps) => {
    const editorHeight = useMemo(
        () => Math.max(260, value.split('\n').length * 22),
        [value]
    );
    const renderHighlight = useCallback(
        (code: string) => Prism.highlight(code, Prism.languages.json, 'json'),
        []
    );
    const editorId = useMemo(
        () => `${title.toLowerCase().replace(/\s+/g, '-')}-json-editor`,
        [title]
    );

    return (
        <div className="admin-json-editor-block">
            <header className="admin-json-editor-header">
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
                <div className="admin-json-editor-actions">
                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={onReset}
                        disabled={!dirty}
                    >
                        Reset to form
                    </button>
                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={onApply}
                    >
                        Apply JSON
                    </button>
                </div>
            </header>
            <div className="admin-code-wrapper">
                <Editor
                    value={value}
                    onValueChange={onChange}
                    highlight={renderHighlight}
                    padding={14}
                    textareaId={editorId}
                    textareaClassName="admin-code-input"
                    className="admin-code-editor"
                    preClassName="admin-code-pre"
                    spellCheck={false}
                    aria-label={`${title} JSON editor`}
                    style={{ minHeight: editorHeight }}
                />
            </div>
            {error && (
                <div className="admin-feedback admin-feedback-error admin-inline-feedback" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
};

export default JsonEditor;
