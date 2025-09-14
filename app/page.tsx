'use client';

import { useState, useEffect, useRef } from 'react';
import TimelineGrid from '../components/TimelineGrid';
import ProgressBar from '../components/ProgressBar';
import MusicControls from '../components/MusicControls';
import {
  START,
  END,
  PRESIDENTS,
  President,
  MONARCHS,
  getMonarch,
} from '../data/presidents';

const DAY_MS = 24 * 60 * 60 * 1000;

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [presidents, setPresidents] = useState<President[]>(PRESIDENTS);
  const [start, setStart] = useState<Date>(START);
  const [end, setEnd] = useState<Date>(END);
  const [current, setCurrent] = useState<Date>(START);
  const [running, setRunning] = useState<boolean>(true);

  const currentMonarch = getMonarch(current, MONARCHS);

  const playSound = (src: string, count: number, volume = 1, offset = 0) => {
    for (let i = 0; i < count; i++) {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.currentTime = offset;
      setTimeout(() => audio.play(), i * 200);
    }
  };

  useEffect(() => {
    if (running) {
      const timer = setInterval(() => {
        setCurrent(prev =>
          prev < end ? new Date(prev.getTime() + DAY_MS) : start
        );
      }, 4);
      return () => clearInterval(timer);
    }
  }, [running, start, end]);

  useEffect(() => {
    const births = presidents.filter(p => p.birth.getTime() === current.getTime()).length;
    const deaths = presidents.filter(p => p.death && p.death.getTime() === current.getTime()).length;
    if (births) playSound('/pop-cartoon-328167.mp3', births);
    if (deaths) playSound('/bell.mp3', deaths);
  }, [current, presidents]);

  useEffect(() => {
    const resize = () => {
      const el = containerRef.current;
      if (!el) return;
      const scale = Math.min(
        window.innerWidth / el.scrollWidth,
        window.innerHeight / el.scrollHeight,
        1
      );
      //el.style.transform = `scale(${scale})`;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const generatePresidents = async () => {
    try {
      const res = await fetch('/api/presidents', { method: 'POST' });
      if (!res.ok) return;
      const data: President[] = await res.json();
      setPresidents(data);
      data.forEach(p => {
        p.birth = new Date(p.birth as unknown as string);
        if (p.death) p.death = new Date(p.death as unknown as string);
        p.events = p.events.map(e => ({ ...e, date: new Date(e.date as unknown as string) }));
      });
      const times = data.flatMap(p => [
        p.birth.getTime(),
        (p.death ?? p.birth).getTime(),
        ...p.events.map(e => e.date.getTime())
      ]);
      const newStart = new Date(Math.min(...times));
      const newEnd = new Date(Math.max(...times));
      setStart(newStart);
      setEnd(newEnd);
      setCurrent(newStart);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <h2>Aerobea Presidential Timeline</h2>
      <div className="year">{current.toISOString().slice(0, 10)}</div>
      <div
        className="monarch"
        title={
          currentMonarch?.death_cause
            ? `Died of ${currentMonarch.death_cause}`
            : undefined
        }
      >
        Monarch: {currentMonarch ? currentMonarch.name : '—'}
      </div>
      <ProgressBar
        current={current}
        setCurrent={setCurrent}
        running={running}
        setRunning={setRunning}
        start={start}
        end={end}
      />
      <div>
        <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Play'}</button>
        <button onClick={() => setCurrent(start)}>Reset</button>
        <button onClick={generatePresidents}>Generate</button>
      </div>
      <MusicControls />      
      <TimelineGrid current={current} presidents={presidents} />

    </div>
  );
}
