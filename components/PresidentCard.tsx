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
  const bgUrl = pres.imageUrl;

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
