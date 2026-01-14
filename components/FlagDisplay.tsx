'use client';

import { useRef, useEffect } from 'react';
import type { Flag } from '../lib/timeline';
import { getFlag } from '../lib/timeline';

interface FlagDisplayProps {
  flags: Flag[];
  current: Date;
}

export default function FlagDisplay({ flags, current }: FlagDisplayProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const currentFlag = getFlag(current, flags);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const newUrl = currentFlag?.imageUrl ?? null;
    if (prevUrlRef.current !== newUrl) {
      img.style.opacity = '0';
      const timer = setTimeout(() => {
        img.style.opacity = '1';
      }, 50);
      prevUrlRef.current = newUrl;
      return () => clearTimeout(timer);
    }
  }, [currentFlag?.imageUrl]);

  if (!currentFlag) {
    return (
      <div className="flag-display flag-display-empty">
        <span className="flag-placeholder">No flag for this period</span>
      </div>
    );
  }

  return (
    <div className="flag-display">
      <img
        ref={imageRef}
        src={currentFlag.imageUrl}
        alt={currentFlag.description}
        title={currentFlag.reasonForChange ?? currentFlag.description}
        className="flag-image"
      />
    </div>
  );
}
