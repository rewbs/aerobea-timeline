'use client';

import { useEffect, useState } from 'react';
import { President, TimelineEvent } from '../data/presidents';

interface PresidentCardProps {
  pres: President;
  visible: boolean;
  className: string;
  current: number;
  partyColour: string;
  currentEvent?: TimelineEvent;
}

export default function PresidentCard({ pres, visible, className, current, partyColour, currentEvent }: PresidentCardProps) {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const bases = ['', '/images', '/presidents'];
    const exts = ['jpg', 'jpeg', 'png', 'webp'];
    (async () => {
      for (const base of bases) {
        for (const ext of exts) {
          const url = `${base}/${encodeURIComponent(pres.name)}.${ext}`;
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
    })();
    return () => {
      cancelled = true;
    };
  }, [pres.name]);

  const style = bgUrl
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgUrl})`,
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
            {pres.birth} – {pres.death ?? 'present'} ()
          </div>
          <div className="party" style={{ backgroundColor: partyColour }}>
            {pres.party}
          </div>
          <div className="age">
            {Math.min(current, pres.death ?? current) - pres.birth}yo
          </div>
          {currentEvent && <div className="event">{currentEvent.text}</div>}
        </>
      )}
    </div>
  );
}

