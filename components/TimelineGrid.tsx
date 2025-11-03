"use client";

import { isPresident } from '../lib/timeline';
import type { President } from '../lib/timeline';
import PresidentCard from './PresidentCard';

const PARTY_COLOURS: Record<string, string> = {
  'whig': '#93c8f4ff',
  'conservative': '#2639e6ff',
  'labour': '#d51313ff',
  'gsc': '#9467bd',
  'donex': '#ff7f0e',
  'liberal democratic': '#c4d76eff',
  'independent': '#c3dae9ff',
  'socialist': '#f79badff',
  'radical': '#0b3e16ff',
  'feather first': '#000000ff',
  'snackalist': '#c15c22ff',
  'ghanaio party': '#1f6f50',
  'organisational conservative party': '#1f3d7a',
  'cow party': 'pink',
  'united party': 'red',
  'goat party':'teal',
  'alpaca justice party': 'brown',
  'republican fogpipe party': 'black',
  'zxmo party': 'yellow',
  'fleece party': 'purple',
  'fish and curiosity party': 'green',
  'mischief party': 'black',
  'labour party': '#d51313ff',
  'labour alliance': 'orange',
  'national populist party': '#9467bd',
  'liberal conservative party': '#1f3d7a',
  'moderate nationalist': '#1f3d7a',
  'nationalist': 'black',
  'liberal democrat': '#c4d76eff',
  'liberal': '#d51313ff',
  'conservative republican': '#1f3d7a',
  'liberal (populist wing)': '#fa862dff',
  'fogpipe party': 'black'


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
