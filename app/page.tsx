'use client';

import { useState, useEffect, useRef } from 'react';
import TimelineGrid from '../components/TimelineGrid';
import ProgressBar from '../components/ProgressBar';
import MusicControls from '../components/MusicControls';
import { START, END, PRESIDENTS, President } from '../data/presidents';

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [presidents, setPresidents] = useState<President[]>(PRESIDENTS);
  const [start, setStart] = useState<number>(START);
  const [end, setEnd] = useState<number>(END);
  const [current, setCurrent] = useState<number>(START);
  const [running, setRunning] = useState<boolean>(true);

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
        setCurrent(prev => (prev < end ? prev + 1 : start));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [running, start, end]);

  useEffect(() => {
    const births = presidents.filter(p => p.birth === current).length;
    const deaths = presidents.filter(p => p.death === current).length;
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
    <div className="container" ref={containerRef}>
      <h2>Aerobea Presidential Timeline</h2>
      <div className="year">{current}</div>
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
