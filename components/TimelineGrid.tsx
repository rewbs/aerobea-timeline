"use client";

import { isPresident, President } from '../data/presidents';
import PresidentCard from './PresidentCard';

const PARTY_COLOURS: Record<string, string> = {
  whig: '#95bde9ff',
  conservative: '#2639e6ff',
  labour: '#d51313ff',
  gsc: '#9467bd',
  donex: '#ff7f0e',
  'liberal democratic': '#c4d76eff',
  'Independent': '#c3dae9ff',
  'socialist': '#f79badff',
  'radical': '#0b3e16ff',
};

interface TimelineGridProps {
  current: number;
  presidents: President[];
}

export default function TimelineGrid({ current, presidents }: TimelineGridProps) {
  return (
    <div className="grid">
      {presidents.map((pres, idx) => {
        const visible = current >= pres.birth;
        const currentEvent = pres.events.find(
          e => e.year <= current && !pres.events.find(ne => ne.year > e.year && ne.year <= current)
        );
        const className = visible
          ? isPresident(current, pres)
            ? 'cell president'
            : pres.death && current > pres.death
              ? 'cell dead'
              : 'cell active'
          : 'cell';
        const partyColour = PARTY_COLOURS[pres.party.toLowerCase()] || '#999';
        return (
          <PresidentCard
            key={idx}
            pres={pres}
            visible={visible}
            className={className}
            current={current}
            partyColour={partyColour}
            currentEvent={currentEvent}
          />
        );
      })}
    </div>
  );
}
