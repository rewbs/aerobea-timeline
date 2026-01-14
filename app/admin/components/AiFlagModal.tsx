'use client';

import { useState, useEffect } from 'react';
import { historicalFacts } from './historicalFacts';

interface AiFlagModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
    initialImage?: string;
    countryName: string;
}

interface GeneratedImage {
    url: string;
    width: number;
    height: number;
    content_type: string;
}

const STYLE_ERAS = [
    { value: 'heraldic', label: 'Heraldic (Medieval)' },
    { value: 'colonial', label: 'Colonial Era' },
    { value: 'revolutionary', label: 'Revolutionary' },
    { value: 'victorian', label: 'Victorian / Imperial' },
    { value: 'art-deco', label: 'Art Deco (1920s-40s)' },
    { value: 'socialist', label: 'Socialist / Communist' },
    { value: 'modern', label: 'Modern (Post-1950)' },
    { value: 'minimalist', label: 'Minimalist / Contemporary' },
];

export default function AiFlagModal({
    isOpen,
    onClose,
    onSelectImage,
    initialImage,
    countryName,
}: AiFlagModalProps) {
    const [mode, setMode] = useState<'generate' | 'edit'>('generate');
    const [styleEra, setStyleEra] = useState('modern');
    const [primaryColor, setPrimaryColor] = useState('');
    const [secondaryColor, setSecondaryColor] = useState('');
    const [accentColor, setAccentColor] = useState('');
    const [symbols, setSymbols] = useState('');
    const [description, setDescription] = useState('');
    const [selectedModel, setSelectedModel] = useState('fal-ai/flux-2-pro');
    const [editPrompt, setEditPrompt] = useState('');
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [currentFact, setCurrentFact] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMode(initialImage ? 'edit' : 'generate');
            setGeneratedImages([]);
            setError(null);
        }
    }, [isOpen, initialImage]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            setCurrentFact(historicalFacts[Math.floor(Math.random() * historicalFacts.length)]);
            interval = setInterval(() => {
                setCurrentFact(historicalFacts[Math.floor(Math.random() * historicalFacts.length)]);
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    if (!isOpen) return null;

    const colorPalette = [primaryColor, secondaryColor, accentColor]
        .filter(c => c.trim())
        .join(', ');

    const generatePrompt = `A national flag design for ${countryName} in ${STYLE_ERAS.find(s => s.value === styleEra)?.label || styleEra} style.${colorPalette ? ` Colors: ${colorPalette}.` : ''}${symbols ? ` Symbols and motifs: ${symbols}.` : ''}${description ? ` ${description}.` : ''} Aspect ratio 3:2, clean flag design, no text, no fraying edges, flat illustration style.`;

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const endpoint = mode === 'generate' ? '/api/ai/generate-flag' : '/api/ai/edit-flag';
            const body = mode === 'generate'
                ? { prompt: generatePrompt, model: selectedModel }
                : { prompt: editPrompt, imageUrl: initialImage };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to generate flags');
            }

            const data = await res.json();
            if (data.images) {
                setGeneratedImages(data.images);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (imageUrl: string) => {
        setUploading(true);
        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();

            const filename = `flag-${countryName.replace(/\s+/g, '-')}-${Date.now()}.png`;
            const uploadRes = await fetch(
                `/api/upload?filename=${encodeURIComponent(filename)}`,
                {
                    method: 'POST',
                    body: blob,
                }
            );

            if (!uploadRes.ok) {
                throw new Error('Failed to upload flag to storage');
            }

            const uploadData = await uploadRes.json();
            onSelectImage(uploadData.url);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content admin-modal-wide">
                <button className="admin-modal-close" onClick={onClose}>&times;</button>
                <h3>AI Flag Generator</h3>

                <div className="admin-modal-tabs">
                    <button
                        className={`admin-tab ${mode === 'generate' ? 'active' : ''}`}
                        onClick={() => setMode('generate')}
                    >
                        Generate
                    </button>
                    <button
                        className={`admin-tab ${mode === 'edit' ? 'active' : ''}`}
                        onClick={() => setMode('edit')}
                        disabled={!initialImage}
                    >
                        Edit
                    </button>
                </div>

                <div className="admin-modal-body">
                    {mode === 'generate' ? (
                        <div className="admin-form-group">
                            <label>Style Era</label>
                            <select
                                className="admin-input-large"
                                value={styleEra}
                                onChange={(e) => setStyleEra(e.target.value)}
                            >
                                {STYLE_ERAS.map(era => (
                                    <option key={era.value} value={era.value}>
                                        {era.label}
                                    </option>
                                ))}
                            </select>

                            <label>Color Palette</label>
                            <div className="admin-color-inputs">
                                <input
                                    type="text"
                                    className="admin-input"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    placeholder="Primary (e.g. red, blue)"
                                />
                                <input
                                    type="text"
                                    className="admin-input"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    placeholder="Secondary"
                                />
                                <input
                                    type="text"
                                    className="admin-input"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    placeholder="Accent"
                                />
                            </div>

                            <label>Symbols / Motifs</label>
                            <input
                                type="text"
                                className="admin-input-large"
                                value={symbols}
                                onChange={(e) => setSymbols(e.target.value)}
                                placeholder="e.g. eagle, stars, wheat, sun"
                            />

                            <label>Additional Description</label>
                            <textarea
                                className="admin-input-large"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. horizontal tricolor with coat of arms in center"
                                rows={3}
                            />

                            <label>Prompt Preview (Read-only)</label>
                            <div className="admin-prompt-preview">
                                {generatePrompt}
                            </div>

                            <label>Model</label>
                            <select
                                className="admin-input-large"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            >
                                <option value="fal-ai/flux-2-pro">Flux 2 Pro (Recommended)</option>
                                <option value="fal-ai/nano-banana-pro">Nano Banana Pro</option>
                                <option value="fal-ai/gpt-image-1-mini">GPT Image 1 Mini</option>
                            </select>
                        </div>
                    ) : (
                        <div className="admin-form-group">
                            <label>Edit Prompt</label>
                            <textarea
                                className="admin-input-large"
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                placeholder="e.g. change the eagle to a lion, make the colors more vibrant"
                                rows={6}
                            />
                            {initialImage && (
                                <div className="admin-flag-preview">
                                    <img src={initialImage} alt="Original Flag" />
                                    <span>Original Flag</span>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="admin-button primary"
                        onClick={handleGenerate}
                        disabled={loading || uploading}
                    >
                        {loading ? (
                            <>
                                <span className="admin-spinner"></span>
                                Generating...
                            </>
                        ) : (
                            'Generate Flags'
                        )}
                    </button>

                    {loading && (
                        <div className="admin-fact-display">
                            <div className="admin-fact-title">Did you know?</div>
                            <div className="admin-fact-text">{currentFact}</div>
                        </div>
                    )}

                    {error && <div className="admin-error">{error}</div>}

                    {generatedImages.length > 0 && (
                        <div className="admin-generated-grid admin-flag-grid">
                            {generatedImages.map((img, idx) => (
                                <div key={idx} className="admin-generated-item admin-flag-item">
                                    <img src={img.url} alt={`Generated Flag ${idx + 1}`} />
                                    <button
                                        className="admin-button secondary"
                                        onClick={() => handleSelect(img.url)}
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <>
                                                <span className="admin-spinner small"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Accept This Flag'
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
