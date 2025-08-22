'use client';

import { useState, useEffect } from 'react';
import TimelineGrid from '../components/TimelineGrid';
import ProgressBar from '../components/ProgressBar';
import MusicControls from '../components/MusicControls';
import { START, END } from '../data/presidents';

export default function Page() {
  const [current, setCurrent] = useState<number>(START);
  const [running, setRunning] = useState<boolean>(true);

  useEffect(() => {
    if (running) {
      const timer = setInterval(() => {
        setCurrent(prev => (prev < END ? prev + 1 : START));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [running]);

  return (
    <div className="container">
      <h2>Aerobea Presidential Timeline</h2>
      <TimelineGrid current={current} />
      <div className="year">{current}</div>
      <ProgressBar current={current} setCurrent={setCurrent} running={running} setRunning={setRunning} />
      <div>
        <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Play'}</button>
        <button onClick={() => setCurrent(START)}>Reset</button>
      </div>
      <MusicControls />
    </div>
  );
}
