'use client';

import { ChangeEvent, useState, useEffect, useRef } from 'react';
import TimelineGrid from '../components/TimelineGrid';
import ProgressBar from '../components/ProgressBar';
import MusicControls from '../components/MusicControls';
import { President, Monarch, getMonarch } from '../data/presidents';
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  getCountryByCode,
} from '../data/countries';

const DAY_MS = 24 * 60 * 60 * 1000;

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultCountry = getCountryByCode(DEFAULT_COUNTRY_CODE) ?? COUNTRIES[0];
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    defaultCountry?.code ?? DEFAULT_COUNTRY_CODE
  );
  const [presidents, setPresidents] = useState<President[]>(
    defaultCountry?.presidents ?? []
  );
  const [monarchs, setMonarchs] = useState<Monarch[]>(
    defaultCountry?.monarchs ?? []
  );
  const [start, setStart] = useState<Date>(defaultCountry?.start ?? new Date());
  const [end, setEnd] = useState<Date>(defaultCountry?.end ?? new Date());
  const [current, setCurrent] = useState<Date>(defaultCountry?.start ?? new Date());
  const [running, setRunning] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCustomTimeline, setIsCustomTimeline] = useState<boolean>(false);

  const currentMonarch = getMonarch(current, monarchs);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const code = event.target.value;
    setSelectedCountryCode(code);
    if (code === 'custom') {
      setIsCustomTimeline(true);
      return;
    }
    const country = getCountryByCode(code);
    if (!country) return;
    setIsCustomTimeline(false);
    setPresidents(country.presidents);
    setMonarchs(country.monarchs);
    setStart(country.start);
    setEnd(country.end);
    setCurrent(country.start);
  };

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
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/presidents', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Failed to generate presidents: ${res.status} ${res.statusText}`);
      }
      const raw = (await res.json()) as President[];
      const data = raw.map(p => {
        const birth = new Date(p.birth as unknown as string);
        const death = p.death ? new Date(p.death as unknown as string) : null;
        const events = p.events.map(e => ({
          ...e,
          date: new Date(e.date as unknown as string)
        }));
        return { ...p, birth, death, events };
      });
      setPresidents(data);
      setMonarchs([]);
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
      setIsCustomTimeline(true);
      setSelectedCountryCode('custom');
    } catch (err) {
      console.error(err);
      setError('Failed to generate new presidents. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCountry = getCountryByCode(selectedCountryCode);
  const countryName = selectedCountry?.name ?? 'Custom';
  const heading = isCustomTimeline
    ? 'Generated Presidential Timeline'
    : `${countryName} Presidential Timeline`;

  return (
    <div className="container" ref={containerRef}>
      <h2>{heading}</h2>
      <div className="controls-row">
        <label htmlFor="country-select">Country:</label>
        <select
          id="country-select"
          value={selectedCountryCode}
          onChange={handleCountryChange}
        >
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
          {(isCustomTimeline || selectedCountryCode === 'custom') && (
            <option value="custom">Generated timeline</option>
          )}
        </select>
      </div>
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
        <button onClick={generatePresidents} disabled={isGenerating}>
          {isGenerating ? 'Generating…' : 'Generate'}
        </button>
      </div>
      {isGenerating && <div className="status">Generating timeline…</div>}
      {error && <div className="error" role="alert">{error}</div>}
      <MusicControls />
      <TimelineGrid current={current} presidents={presidents} />

    </div>
  );
}
