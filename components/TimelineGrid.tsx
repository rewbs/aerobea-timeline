"use client";

import { isPresident, President } from '../data/presidents';
import PresidentCard from './PresidentCard';

const PARTY_COLOURS: Record<string, string> = {
  whig: '#93c8f4ff',
  conservative: '#2639e6ff',
  labour: '#d51313ff',
  gsc: '#9467bd',
  donex: '#ff7f0e',
  'liberal democratic': '#c4d76eff',
  'Independent': '#c3dae9ff',
  'socialist': '#f79badff',
  'radical': '#0b3e16ff',
  'feather first': '#000000ff',
  'snackalist': '#c15c22ff',
  'ghanaio party': '#1f6f50',
  'organisational conservative party': '#1f3d7a',
};

interface TimelineGridProps {
  current: Date;
  presidents: President[];
}

export default function TimelineGrid({ current, presidents }: TimelineGridProps) {
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
            isPresident={isPres}
            isDead={isDead}
          />
        );
      })}
    </div>
  );
}
