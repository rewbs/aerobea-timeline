'use client';

import { useState, useEffect, useMemo } from 'react';
import FogCountryCard from './FogCountryCard';
import { getMonarch, isPresident } from '../../lib/timeline';
import type { President, Monarch } from '../../lib/timeline';

// Re-using types from page.tsx (or similar) since they aren't exported centrally yet
// Ideally we'd move these to lib/types.ts
interface CountryTimeline {
  code: string;
  name: string;
  start: Date;
  end: Date | null;
  presidents: President[];
  monarchs: Monarch[];
}

interface FogViewProps {
  countries: CountryTimeline[];
}

export default function FogView({ countries }: FogViewProps) {
  // Find global start/end for the slider
  const { minDate, maxDate } = useMemo(() => {
    let min = new Date().getTime();
    let max = new Date().getTime();
    if (countries.length > 0) {
      min = Math.min(...countries.map(c => c.start.getTime()));
      // Use current date as max if no end date, or find max end date
      // Actually let's just go to today
    }
    return { minDate: min, maxDate: max };
  }, [countries]);

  const [currentMs, setCurrentMs] = useState<number>(minDate);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentDate = useMemo(() => new Date(currentMs), [currentMs]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentMs(prev => {
          const next = prev + (1000 * 60 * 60 * 24 * 30); // ~1 month per tick
          if (next >= maxDate) {
            setIsPlaying(false);
            return maxDate;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, maxDate]);

  return (
    <div className="fog-container">
      <div className="fog-controls">
        <button
          className="fog-play-button"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min={minDate}
          max={maxDate}
          value={currentMs}
          onChange={(e) => {
            setCurrentMs(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="fog-slider"
        />
        <div className="fog-date-display">
          {currentDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
        </div>
      </div>

      <div className="fog-grid">
        {countries.map(country => {
          // Determine active leaders
          const currentMonarch = getMonarch(currentDate, country.monarchs);
          // isPresident checks if a specific president is active. We need to find WHICH one is active.
          const currentPresident = country.presidents.find(p => isPresident(currentDate, p));

          return (
            <FogCountryCard
              key={country.code}
              code={country.code}
              name={country.name}
              currentDate={currentDate}
              monarch={currentMonarch}
              president={currentPresident}
            />
          );
        })}
      </div>

      <style jsx global>{`
        .fog-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1a1a1a;
          color: #fff;
          font-family: system-ui, sans-serif;
          overflow: hidden;
        }
        .fog-grid {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); /* Wider cards, auto-fit */
          gap: 16px; /* Tighter gap */
          align-content: start;
        }
        .fog-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: transform 0.2s;
          /* Removed fixed width, let grid handle it */
          display: flex;
          flex-direction: column;
        }
        .fog-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .fog-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 8px;
        }
        .fog-card-header h3 {
          margin: 0;
          font-size: 1.1rem; /* Slightly smaller header */
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .fog-code {
          font-size: 0.8rem;
          opacity: 0.5;
          font-weight: bold;
          background: rgba(255,255,255,0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .fog-leaders {
          display: flex;
          flex-direction: row; /* Side by side */
          gap: 12px;
          flex: 1;
        }
        .fog-leader {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(0, 0, 0, 0.2);
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          flex: 1; /* Share space equally */
          min-width: 0; /* Allow shrinking */
        }
        .fog-leader.monarch {
          border-top: 3px solid #ffd700;
        }
        .fog-leader.president {
          border-top: 3px solid #4caf50;
        }
        .fog-leader-image-container {
          width: 100%;
          aspect-ratio: 3/4;
          background-color: #333;
          position: relative;
          max-height: 180px; /* Limit height to keep cards compact */
        }
        .fog-leader-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: top center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fog-placeholder {
          font-size: 2.5rem;
          opacity: 0.2;
        }
        .fog-leader-info {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .fog-role {
          font-size: 0.65rem;
          text-transform: uppercase;
          opacity: 0.6;
          letter-spacing: 0.1em;
          font-weight: bold;
        }
        .fog-name {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fog-term {
          font-size: 0.75rem;
          opacity: 0.5;
          margin-top: 2px;
        }
        .fog-details {
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px solid rgba(255,255,255,0.1);
          font-size: 0.75rem;
          color: #ddd;
          font-style: italic;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fog-death-cause {
          color: #ff6b6b;
          font-size: 0.7rem;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fog-leader-empty {
          padding: 20px;
          text-align: center;
          font-size: 0.8rem;
          opacity: 0.3;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(0,0,0,0.1);
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fog-controls {
          height: 60px; /* Compact controls */
          background: rgba(0, 0, 0, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 20px;
          z-index: 100;
          backdrop-filter: blur(20px);
        }
        .fog-play-button {
          background: #fff;
          color: #000;
          border: none;
          padding: 6px 20px;
          border-radius: 20px;
          font-weight: 800;
          cursor: pointer;
          font-size: 0.9rem;
          transition: transform 0.1s;
        }
        .fog-play-button:active {
          transform: scale(0.95);
        }
        .fog-play-button:hover {
          background: #f0f0f0;
        }
        .fog-slider {
          flex: 1;
          accent-color: #fff;
          height: 4px;
        }
        .fog-date-display {
          font-variant-numeric: tabular-nums;
          font-weight: 800;
          font-size: 1.2rem;
          min-width: 160px;
          text-align: right;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
}
