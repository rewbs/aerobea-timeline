import { isPresident, President } from '../data/presidents';

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
          <div className={className} key={idx}>
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
      })}
    </div>
  );
}
