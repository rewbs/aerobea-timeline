
import { useState, useEffect } from 'react';

interface AiImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
    initialImage?: string;
    leaderName: string;
    decade: string;
}

interface GeneratedImage {
    url: string;
    width: number;
    height: number;
    content_type: string;
}

import { historicalFacts } from './historicalFacts';

export default function AiImageModal({
    isOpen,
    onClose,
    onSelectImage,
    initialImage,
    leaderName,
    decade,
}: AiImageModalProps) {
    const [mode, setMode] = useState<'generate' | 'edit'>('generate');
    const [characterType, setCharacterType] = useState('anthropomorphic female goat');
    const [extraDetails, setExtraDetails] = useState('They are holding a pen');
    const [selectedModel, setSelectedModel] = useState('fal-ai/nano-banana-pro');
    const [editPrompt, setEditPrompt] = useState('make black and white');
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
            // Pick a random fact initially
            setCurrentFact(historicalFacts[Math.floor(Math.random() * historicalFacts.length)]);

            // Cycle every 5 seconds
            interval = setInterval(() => {
                setCurrentFact(historicalFacts[Math.floor(Math.random() * historicalFacts.length)]);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    if (!isOpen) return null;

    const generatePrompt = `Generate a presidential portrait from ${decade} for ${leaderName}, a ${characterType}. ${extraDetails}. Do not put a frame around the image. Do not include any text or flags. Ensure the medium of the portrait and the fashion are period approriate.`;

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const endpoint = mode === 'generate' ? '/api/ai/generate' : '/api/ai/edit';
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
                throw new Error(json.error || 'Failed to generate images');
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
            // Fetch the image from FAL
            const res = await fetch(imageUrl);
            const blob = await res.blob();

            // Upload to our own storage
            const filename = `${leaderName.replace(/\s+/g, '-')}-${Date.now()}.png`;
            const uploadRes = await fetch(
                `/api/upload?filename=${encodeURIComponent(filename)}`,
                {
                    method: 'POST',
                    body: blob,
                }
            );

            if (!uploadRes.ok) {
                throw new Error('Failed to upload image to storage');
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
            <div className="admin-modal-content">
                <button className="admin-modal-close" onClick={onClose}>&times;</button>
                <h3>AI Image Studio</h3>

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
                            <label>Character Type</label>
                            <input
                                type="text"
                                className="admin-input-large variable-1"
                                value={characterType}
                                onChange={(e) => setCharacterType(e.target.value)}
                                placeholder="e.g. anthropomorphic female goat"
                            />

                            <label>Extra Details</label>
                            <input
                                type="text"
                                className="admin-input-large variable-2"
                                value={extraDetails}
                                onChange={(e) => setExtraDetails(e.target.value)}
                                placeholder="e.g. They are holding a pen"
                            />

                            <label>Prompt Preview (Read-only)</label>
                            <div className="admin-prompt-preview">
                                <span className="prompt-static">Generate a presidential portrait from {decade} for {leaderName}, a </span>
                                <span className="prompt-variable-1">{characterType}</span>
                                <span className="prompt-static">. </span>
                                <span className="prompt-variable-2">{extraDetails}</span>
                                <span className="prompt-static">. Do not put a frame around the image. Do not include any text or flags. Ensure the medium of the portrait and the fashion are period approriate.</span>
                            </div>

                            <label>Model</label>
                            <select
                                className="admin-input-large"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            >
                                <option value="fal-ai/nano-banana-pro">Nano Banana Pro (Default)</option>
                                <option value="bytedance/seedream/v4/text-to-image">Seedream v4</option>
                                <option value="gpt-image-1-mini">GPT Image 1 Mini</option>
                            </select>
                        </div>
                    ) : (
                        <div className="admin-form-group">
                            <label>Edit Prompt</label>
                            <textarea
                                className="admin-input-large"
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                placeholder="e.g. make black and white"
                                rows={6}
                            />
                            {initialImage && (
                                <div className="admin-image-preview-small">
                                    <img src={initialImage} alt="Original" />
                                    <span>Original Image</span>
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
                            'Generate Images'
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
                        <div className="admin-generated-grid">
                            {generatedImages.map((img, idx) => (
                                <div key={idx} className="admin-generated-item">
                                    <img src={img.url} alt={`Generated ${idx + 1}`} />
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
                                            'Accept This Image'
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
