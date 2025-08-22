import { PRESIDENTS, isPresident } from '../data/presidents';

interface TimelineGridProps {
  current: number;
}

export default function TimelineGrid({ current }: TimelineGridProps) {
  return (
    <div className="grid">
      {PRESIDENTS.map((pres, idx) => {
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
        return (
          <div className={className} key={idx}>
            {visible && (
              <>
                <div className="name">{pres.name}</div>
                <div className="age">{Math.min(current, pres.death ?? current) - pres.birth}yo</div>
                <div className="party">{pres.party}</div>
                {currentEvent && <div className="event">{currentEvent.text}</div>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
