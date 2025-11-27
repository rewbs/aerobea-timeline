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
  timelineStart: Date;
}

export default function PresidentCard({ pres, visible, className, current, partyColour, currentEvent, isDead, isPresident, timelineStart }: PresidentCardProps) {
  const bgUrl = pres.imageUrl;
  const isBorn = current >= pres.birth;

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
      opacity: isBorn ? 1 : 0.4, // Dim if not born yet
    }
    : undefined;

  // Calculate bar heights
  const currentMs = current.getTime();
  const birthMs = pres.birth.getTime();
  const deathMs = pres.death ? pres.death.getTime() : currentMs; // If alive, death is "now" for calc? Or just full?
  // Actually if alive, life bar should probably be full or based on expected age?
  // "decreases... until they die". If they haven't died, it shouldn't decrease to 0.
  // But we don't know when they die if they are alive.
  // Let's assume for living presidents it stays full or we use a fixed max age?
  // The prompt implies historical context. If pres.death is null, maybe they are still alive.
  // If pres.death is null, let's just make it 100%? Or maybe we don't show the red bar?
  // "decreases... from born until die".
  // I'll use pres.death if exists. If not, maybe 100%?

  let lifeHeight = 0;
  if (isBorn) {
    if (pres.death) {
      if (currentMs < pres.death.getTime()) {
        lifeHeight = Math.max(0, (pres.death.getTime() - currentMs) / (pres.death.getTime() - birthMs));
      }
    } else {
      lifeHeight = 1; // Alive = full bar?
    }
  }

  let termHeight = 0;
  if (isPresident) {
    // Find current term
    // We need to find the specific term we are in.
    // pres.events has PRESIDENCY_BEGINS and PRESIDENCY_ENDS.
    // We can sort events and find the pair.
    const events = [...pres.events].sort((a, b) => a.date.getTime() - b.date.getTime());
    let termStart = 0;
    let termEnd = 0;

    for (let i = 0; i < events.length; i++) {
      if (events[i].type === 1) { // PRESIDENCY_BEGINS
        const start = events[i].date.getTime();
        // Find next ENDS or use current/future
        let end = Infinity;
        // Look ahead for ENDS
        for (let j = i + 1; j < events.length; j++) {
          if (events[j].type === 2) { // PRESIDENCY_ENDS
            end = events[j].date.getTime();
            break;
          }
          if (events[j].type === 1) {
            // Another term starts? Should assume previous ended?
            // Let's assume standard pairs.
            break;
          }
        }

        if (currentMs >= start && currentMs <= end) {
          termStart = start;
          termEnd = end === Infinity ? currentMs : end; // If ongoing, end is now?
          // If termEnd is Infinity (current president), maybe use next election?
          // Or just keep it full? "decreases... until end of their term".
          // If we don't know end, we can't decrease.
          // Let's assume 4 years if unknown? Or just 100%?
          if (end === Infinity) {
            termHeight = 1;
          } else {
            termHeight = Math.max(0, (end - currentMs) / (end - start));
          }
          break;
        }
      }
    }
  }

  let pinkHeight = 0;
  if (!isBorn) {
    const startMs = timelineStart.getTime();
    if (currentMs >= startMs && currentMs < birthMs) {
      pinkHeight = Math.max(0, (birthMs - currentMs) / (birthMs - startMs));
    } else if (currentMs < startMs) {
      pinkHeight = 1;
    }
  }

  return (
    <div className={className} style={{ ...style, position: 'relative' }}>
      {/* Pink Bar (Pre-birth) */}
      {!isBorn && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '6px',
            height: `${pinkHeight * 100}%`,
            backgroundColor: 'rgba(255, 192, 203, 0.7)', // Transparent pink
            zIndex: 10,
          }}
        />
      )}

      {/* Red Bar (Life) */}
      {isBorn && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '6px',
            height: `${lifeHeight * 100}%`,
            backgroundColor: 'red',
            zIndex: 10,
          }}
        />
      )}

      {/* Green Bar (Term) */}
      {isPresident && (
        <div
          style={{
            position: 'absolute',
            right: '8px', // Left of red bar
            bottom: 0,
            width: '6px',
            height: `${termHeight * 100}%`,
            backgroundColor: 'green',
            zIndex: 10,
          }}
        />
      )}

      {/* Content only if born (or maybe we show name but dimmed?) */}
      {isBorn && (
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

      {!isBorn && (
        <div className="name" style={{ opacity: 0.5 }}>{pres.name}</div>
      )}
    </div>
  );
}
