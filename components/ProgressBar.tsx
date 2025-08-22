'use client';

import { useRef, useState, useEffect } from 'react';

interface ProgressBarProps {
  current: number;
  setCurrent: (year: number) => void;
  running: boolean;
  setRunning: (running: boolean) => void;
  start: number;
  end: number;
}

export default function ProgressBar({ current, setCurrent, running, setRunning, start, end }: ProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const rect = containerRef.current!.getBoundingClientRect();
      const percentage = (clientX - rect.left) / rect.width;
      const year = start + percentage * (end - start);
      setCurrent(Math.max(start, Math.min(end, Math.round(year))));
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, setCurrent]);

  const progress = ((current - start) / (end - start)) * 100;

  return (
    <div
      className="progress-container"
      ref={containerRef}
      onMouseDown={() => { setIsDragging(true); if (running) setRunning(false); }}
      onTouchStart={e => { e.preventDefault(); setIsDragging(true); if (running) setRunning(false); }}
    >
      <div className="progress" style={{ width: `${progress}%` }}>
        <div className="slider"></div>
      </div>
    </div>
  );
}
