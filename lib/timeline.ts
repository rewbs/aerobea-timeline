export const PRESIDENCY_BEGINS = 1 as const;
export const PRESIDENCY_ENDS = 2 as const;
export const DEATH = 3 as const;

export type EventType =
  | typeof PRESIDENCY_BEGINS
  | typeof PRESIDENCY_ENDS
  | typeof DEATH;

export interface TimelineEvent {
  date: Date;
  type?: EventType;
  text: string;
}

export interface President {
  name: string;
  party: string;
  birth: Date;
  death: Date | null;
  events: TimelineEvent[];
}

export interface Monarch {
  name: string;
  birth: Date;
  death: Date | null;
  start_reign: Date;
  end_reign: Date | null;
  death_cause: string | null;
  notes?: string;
}

export function isPresident(date: Date, president: President): boolean {
  const begins = president.events.filter(e => e.type === PRESIDENCY_BEGINS);
  const ends = president.events.filter(e => e.type === PRESIDENCY_ENDS);
  begins.sort((a, b) => a.date.getTime() - b.date.getTime());
  ends.sort((a, b) => a.date.getTime() - b.date.getTime());
  const cur = date.getTime();
  for (let i = 0; i < begins.length; i++) {
    const start = begins[i].date.getTime();
    const end = (ends[i]?.date.getTime() ?? Infinity) - 1;
    if (cur >= start && cur <= end) return true;
  }
  return false;
}

export function getMonarch(
  date: Date,
  monarchs: Monarch[]
): Monarch | undefined {
  return monarchs.find(
    m =>
      date >= m.start_reign && (m.end_reign === null || date <= m.end_reign)
  );
}
