"use client";

import { isPresident } from '../lib/timeline';
import type { President } from '../lib/timeline';
import PresidentCard from './PresidentCard';

interface TimelineGridProps {
  current: Date;
  presidents: President[];
  partyColours: Record<string, string>;
}

export default function TimelineGrid({ current, presidents, partyColours }: TimelineGridProps) {
  return (
    <div className="grid">
      {presidents.map((pres, idx) => {
        const visible = current >= pres.birth;
        const currentEvent = pres.events.find(
          e =>
            e.date <= current &&
            !pres.events.find(ne => ne.date > e.date && ne.date <= current)
        );
        const isDead = pres.death !== null && current >= pres.death;
        const isPres = isPresident(current, pres);
        const className = visible
          ? isPres
            ? 'cell president'
            : isDead
              ? 'cell dead'
              : 'cell active'
          : 'cell';
        const partyColour = partyColours[pres.party.toLowerCase()] || '#999';
        return (
          <PresidentCard
            key={idx}
            pres={pres}
            visible={visible}
            className={className}
            current={current}
            partyColour={partyColour}
            currentEvent={currentEvent}
            isPresident={isPres}
            isDead={isDead}
          />
        );
      })}
    </div>
  );
}
