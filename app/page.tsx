'use client';

import { ChangeEvent, useState, useEffect, useRef } from 'react';
import TimelineGrid from '../components/TimelineGrid';
import ProgressBar from '../components/ProgressBar';
import MusicControls from '../components/MusicControls';
import { getMonarch } from '../lib/timeline';
import type { President, Monarch } from '../lib/timeline';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_COUNTRY_CODE = 'aerobea';

interface TimelineEventJson {
  date: string;
  type?: number;
  text: string;
}

interface PresidentJson {
  name: string;
  party: string;
  birth: string;
  death: string | null;
  events: TimelineEventJson[];
}

interface MonarchJson {
  name: string;
  birth: string;
  death: string | null;
  start_reign: string;
  end_reign: string | null;
  death_cause: string | null;
  notes?: string;
}

interface CountryResponse {
  code: string;
  name: string;
  start: string;
  end: string | null;
  presidents: PresidentJson[];
  monarchs: MonarchJson[];
}

interface CountryTimeline {
  code: string;
  name: string;
  start: Date;
  end: Date | null;
  presidents: President[];
  monarchs: Monarch[];
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialisedRef = useRef(false);
  const [countries, setCountries] = useState<CountryTimeline[]>([]);
  const [countriesLoading, setCountriesLoading] = useState<boolean>(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>(DEFAULT_COUNTRY_CODE);
  const [presidents, setPresidents] = useState<President[]>([]);
  const [monarchs, setMonarchs] = useState<Monarch[]>([]);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [current, setCurrent] = useState<Date>(new Date());
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
    const country = countries.find(c => c.code === code);
    if (!country) return;
    setIsCustomTimeline(false);
    setPresidents(country.presidents);
    setMonarchs(country.monarchs);
    setStart(country.start);
    setEnd(country.end ?? country.start);
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
    let cancelled = false;

    const hydrateCountries = (payload: CountryResponse[]): CountryTimeline[] =>
      payload.map(country => ({
        code: country.code,
        name: country.name,
        start: new Date(country.start),
        end: country.end ? new Date(country.end) : null,
        presidents: country.presidents.map(president => ({
          ...president,
          birth: new Date(president.birth),
          death: president.death ? new Date(president.death) : null,
          events: president.events.map(event => ({
            ...event,
            date: new Date(event.date),
          })),
        })),
        monarchs: country.monarchs.map(monarch => ({
          ...monarch,
          birth: new Date(monarch.birth),
          death: monarch.death ? new Date(monarch.death) : null,
          start_reign: new Date(monarch.start_reign),
          end_reign: monarch.end_reign ? new Date(monarch.end_reign) : null,
        })),
      }));

    const loadCountries = async () => {
      setCountriesLoading(true);
      setCountriesError(null);
      try {
        const res = await fetch('/api/countries');
        if (!res.ok) {
          throw new Error(`Failed to load countries: ${res.status} ${res.statusText}`);
        }
        const json = (await res.json()) as { countries: CountryResponse[] };
        if (!cancelled) {
          setCountries(json.countries ? hydrateCountries(json.countries) : []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setCountriesError('Failed to load countries. Please bootstrap the database.');
          setCountries([]);
        }
      } finally {
        if (!cancelled) {
          setCountriesLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (initialisedRef.current) return;
    if (!countries.length) return;
    const defaultCountry =
      countries.find(country => country.code === DEFAULT_COUNTRY_CODE) ??
      countries[0];
    if (!defaultCountry) return;
    setSelectedCountryCode(defaultCountry.code);
    setPresidents(defaultCountry.presidents);
    setMonarchs(defaultCountry.monarchs);
    setStart(defaultCountry.start);
    setEnd(defaultCountry.end ?? defaultCountry.start);
    setCurrent(defaultCountry.start);
    setIsCustomTimeline(false);
    initialisedRef.current = true;
  }, [countries]);

  useEffect(() => {
    if (countriesLoading) return;
    if (countries.length > 0) return;
    setSelectedCountryCode('custom');
    setIsCustomTimeline(true);
  }, [countries, countriesLoading]);

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

  const selectedCountry = countries.find(
    country => country.code === selectedCountryCode
  );
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
          disabled={countriesLoading && !countries.length}
        >
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
          {(isCustomTimeline || selectedCountryCode === 'custom') && (
            <option value="custom">Generated timeline</option>
          )}
        </select>
      </div>
      {countriesLoading && <div className="status">Loading countries…</div>}
      {countriesError && (
        <div className="error" role="alert">
          {countriesError}
        </div>
      )}
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
