'use client';

import { useState, useEffect } from 'react';
import TimelineGrid from '../components/TimelineGrid';
import ProgressBar from '../components/ProgressBar';
import MusicControls from '../components/MusicControls';
import { START, END, PRESIDENTS, President } from '../data/presidents';

export default function Page() {
  const [presidents, setPresidents] = useState<President[]>(PRESIDENTS);
  const [start, setStart] = useState<number>(START);
  const [end, setEnd] = useState<number>(END);
  const [current, setCurrent] = useState<number>(START);
  const [running, setRunning] = useState<boolean>(true);

  useEffect(() => {
    if (running) {
      const timer = setInterval(() => {
        setCurrent(prev => (prev < end ? prev + 1 : start));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [running, start, end]);

  const generatePresidents = async () => {
    try {
      const res = await fetch('/api/presidents', { method: 'POST' });
      if (!res.ok) return;
      const data: President[] = await res.json();
      setPresidents(data);
      const years = data.flatMap(p => [
        p.birth,
        p.death ?? p.birth,
        ...p.events.map(e => e.year)
      ]);
      const newStart = Math.min(...years);
      const newEnd = Math.max(...years);
      setStart(newStart);
      setEnd(newEnd);
      setCurrent(newStart);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Aerobea Presidential Timeline</h2>
      <TimelineGrid current={current} presidents={presidents} />
      <div className="year">{current}</div>
      <ProgressBar current={current} setCurrent={setCurrent} running={running} setRunning={setRunning} start={start} end={end} />
      <div>
        <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Play'}</button>
        <button onClick={() => setCurrent(start)}>Reset</button>
        <button onClick={generatePresidents}>Generate</button>
      </div>
      <MusicControls />
    </div>
  );
}
