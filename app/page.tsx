'use client';

import { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import TimelineGrid from '../components/TimelineGrid';
import ProgressBar from '../components/ProgressBar';
import MusicControls from '../components/MusicControls';
import { getMonarch, PRESIDENCY_BEGINS, PRESIDENCY_ENDS, DEATH } from '../lib/timeline';
import type { President, Monarch, EventType } from '../lib/timeline';

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
  imageUrl?: string;
}

interface MonarchJson {
  name: string;
  birth: string;
  death: string | null;
  start_reign: string;
  end_reign: string | null;
  death_cause: string | null;
  notes?: string;
  imageUrl?: string;
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

const isEventType = (value: number | undefined): value is EventType =>
  value === PRESIDENCY_BEGINS || value === PRESIDENCY_ENDS || value === DEATH;

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
  const [partyColours, setPartyColours] = useState<Record<string, string>>({});

  const updateHashFragment = useCallback((code: string) => {
    if (typeof window === 'undefined') return;
    const normalized = code.toLowerCase();
    const { pathname, search } = window.location;
    const newUrl = `${pathname}${search}#${normalized}`;
    if (`#${normalized}` !== window.location.hash) {
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  const getHashCountryCode = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    const raw = window.location.hash ? window.location.hash.slice(1) : '';
    if (!raw) return null;
    return decodeURIComponent(raw).toLowerCase();
  }, []);

  const applyCountryState = useCallback(
    (country: CountryTimeline, shouldUpdateHash: boolean) => {
      setIsCustomTimeline(false);
      setSelectedCountryCode(country.code);
      setPresidents(country.presidents);
      setMonarchs(country.monarchs);
      setStart(country.start);
      setEnd(country.end ?? country.start);
      setCurrent(country.start);
      if (shouldUpdateHash) {
        updateHashFragment(country.code);
      }
    },
    [updateHashFragment]
  );

  const selectCountryByCode = useCallback(
    (
      code: string,
      options?: { updateHash?: boolean; allowFallback?: boolean }
    ) => {
      const { updateHash = true, allowFallback = true } = options ?? {};
      const normalized = code.toLowerCase();
      if (normalized === 'custom') {
        setIsCustomTimeline(true);
        setSelectedCountryCode('custom');
        if (updateHash) {
          updateHashFragment('custom');
        }
        return true;
      }
      const country = countries.find(
        c => c.code.toLowerCase() === normalized
      );
      if (country) {
        applyCountryState(country, updateHash);
        return true;
      }
      if (allowFallback) {
        const fallback =
          countries.find(c => c.code.toLowerCase() === DEFAULT_COUNTRY_CODE) ??
          countries[0];
        if (fallback) {
          applyCountryState(fallback, updateHash);
          return true;
        }
      }
      return false;
    },
    [applyCountryState, countries, updateHashFragment]
  );

  const currentMonarch = getMonarch(current, monarchs);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const code = event.target.value;
    if (code === 'custom') {
      setSelectedCountryCode('custom');
      setIsCustomTimeline(true);
      updateHashFragment('custom');
      return;
    }
    selectCountryByCode(code);
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
            type: isEventType(event.type) ? event.type : undefined,
          })),
        })).sort((a, b) => {
          const startA = a.events.find(e => e.type === PRESIDENCY_BEGINS)?.date.getTime() ?? Infinity;
          const startB = b.events.find(e => e.type === PRESIDENCY_BEGINS)?.date.getTime() ?? Infinity;
          return startA - startB;
        }),
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

    const loadPartyColours = async () => {
      try {
        const res = await fetch('/api/party-colours');
        if (res.ok) {
          const json = await res.json();
          const colours: Record<string, string> = {};
          for (const pc of json.partyColours || []) {
            colours[pc.name] = pc.colour;
          }
          if (!cancelled) {
            setPartyColours(colours);
          }
        }
      } catch (err) {
        console.error('Failed to load party colours:', err);
      }
    };

    loadPartyColours();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (initialisedRef.current) return;
    if (!countries.length) return;
    const hashCode = getHashCountryCode();
    let applied = false;
    if (hashCode) {
      applied = selectCountryByCode(hashCode, {
        allowFallback: false,
      });
    }
    if (!applied) {
      selectCountryByCode(DEFAULT_COUNTRY_CODE);
    }
    initialisedRef.current = true;
  }, [countries, getHashCountryCode, selectCountryByCode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      const hashCode = getHashCountryCode();
      if (!hashCode) {
        selectCountryByCode(DEFAULT_COUNTRY_CODE);
        return;
      }
      selectCountryByCode(hashCode);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [getHashCountryCode, selectCountryByCode]);

  useEffect(() => {
    if (countriesLoading) return;
    if (countries.length > 0) return;
    setSelectedCountryCode('custom');
    setIsCustomTimeline(true);
    updateHashFragment('custom');
    const now = new Date();
    setPresidents([]);
    setMonarchs([]);
    setStart(now);
    setEnd(now);
    setCurrent(now);
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
      updateHashFragment('custom');
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
        <Link href="/admin" style={{ marginLeft: '10px', color: '#00d4ff', textDecoration: 'none' }}>
          Admin
        </Link>
      </div>
      {isGenerating && <div className="status">Generating timeline…</div>}
      {error && <div className="error" role="alert">{error}</div>}
      <MusicControls />
      <TimelineGrid current={current} presidents={presidents} partyColours={partyColours} start={start} />

    </div>
  );
}
