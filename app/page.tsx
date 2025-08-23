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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (running) {
      const timer = setInterval(() => {
        setCurrent(prev => (prev < end ? prev + 1 : start));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [running, start, end]);

  const generatePresidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/presidents', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to generate presidents');
      }
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
      setError('Failed to generate presidents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="modal">
          <div className="modal-content">Generating...</div>
        </div>
      )}
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
        {error && <div className="error">{error}</div>}
        <MusicControls />
      </div>
    </>
  );
}
