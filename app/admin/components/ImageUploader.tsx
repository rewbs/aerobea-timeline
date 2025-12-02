'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
    label: string;
    imageUrl?: string | null;
    onImageChange: (url: string) => void;
}

export default function ImageUploader({
    label,
    imageUrl,
    onImageChange,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const response = await fetch(
                `/api/upload?filename=${encodeURIComponent(filename)}`,
                {
                    method: 'POST',
                    body: file,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const blob = await response.json();
            onImageChange(blob.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            void handleUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            void handleUpload(file);
        }
    };

    const handlePaste = useCallback(
        (e: React.ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        void handleUpload(file);
                        return;
                    }
                }
            }
        },
        []
    );

    return (
        <div className="admin-image-uploader">
            <div
                className={`admin-image-dropzone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onPaste={handlePaste}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                role="button"
                aria-label={`Upload image for ${label}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {isUploading ? (
                    <div className="admin-image-loading">Uploading...</div>
                ) : imageUrl ? (
                    <div className="admin-image-preview">
                        <img src={imageUrl} alt={label} />
                        <div className="admin-image-overlay">Click or Paste to Replace</div>
                    </div>
                ) : (
                    <div className="admin-image-placeholder">
                        <p>Click, Drag & Drop, or Paste Image</p>
                    </div>
                )}
            </div>

            {imageUrl && (
                <div className="admin-image-actions">
                    <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-image-link"
                    >
                        Open image in new tab
                    </a>
                </div>
            )}
        </div>
    );
}
