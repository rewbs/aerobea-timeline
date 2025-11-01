'use client';

import { useEffect, useState } from 'react';
import type { President, TimelineEvent } from '../lib/timeline';

interface PresidentCardProps {
  pres: President;
  visible: boolean;
  className: string;
  current: Date;
  partyColour: string;
  currentEvent?: TimelineEvent;
  isPresident: boolean;
  isDead: boolean;
}

export default function PresidentCard({ pres, visible, className, current, partyColour, currentEvent, isDead, isPresident }: PresidentCardProps) {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const bases = ['', '/images', '/presidents'];
    const exts = ['jpg', 'jpeg', 'png', 'webp'];
    const nameCandidates = Array.from(
      new Set([pres.name.toLowerCase(), pres.name])
    );

    (async () => {
      for (const base of bases) {
        for (const candidate of nameCandidates) {
          const encodedName = encodeURIComponent(candidate);
          for (const ext of exts) {
            const url = `${base}/${encodedName}.${ext}`;
            try {
              const res = await fetch(url, { method: 'HEAD' });
              if (res.ok) {
                if (!cancelled) setBgUrl(url);
                return;
              }
            } catch {
              // Ignore errors and try next extension
            }
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pres.name]);

  const style = bgUrl
    ? {
        backgroundImage: isDead
          ? `linear-gradient(rgba(100,0,0,0.5), rgba(100,0,0,0)), url(${bgUrl})`
          : isPresident
          ? `linear-gradient(rgba(0,100,0,0.5), rgba(0,100,0,0)), url(${bgUrl})`
          : `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : undefined;

  return (
    <div className={className} style={style}>
      {visible && (
        <>
          <div className="name">{pres.name}</div>
          <div className="lifespan">
            {pres.birth.toISOString().slice(0, 10)} – {pres.death ? pres.death.toISOString().slice(0, 10) : 'present'}
          </div>
          <div className="party" style={{ backgroundColor: partyColour }}>
            {pres.party}
          </div>
          <div className="age">
            {Math.floor(
              (Math.min(current.getTime(), (pres.death ?? current).getTime()) -
                pres.birth.getTime()) /
                (1000 * 60 * 60 * 24 * 365.25)
            )}yo
          </div>
          {currentEvent && <div className="event">{currentEvent.text}</div>}
        </>
      )}
    </div>
  );
}
