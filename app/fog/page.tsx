'use client';

import { useEffect, useState } from 'react';
import FogView from './FogView';
import { PRESIDENCY_BEGINS, PRESIDENCY_ENDS, DEATH } from '../../lib/timeline';
import type { EventType } from '../../lib/timeline';

// Duplicated types/hydration logic from app/page.tsx to avoid disruption
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

const isEventType = (value: number | undefined): value is EventType =>
    value === PRESIDENCY_BEGINS || value === PRESIDENCY_ENDS || value === DEATH;

export default function FogPage() {
    const [countries, setCountries] = useState<any[]>([]); // Using any to avoid complex type duplication for now, or we can infer
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hydrateCountries = (payload: CountryResponse[]) =>
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
                    // Sort logic copied from page.tsx to ensure correct order
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

        fetch('/api/countries')
            .then(res => res.json())
            .then((data: { countries: CountryResponse[] }) => {
                if (data.countries) {
                    setCountries(hydrateCountries(data.countries));
                }
            })
            .catch(err => console.error('Failed to load countries for fog view', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1a1a1a',
                color: '#fff'
            }}>
                Loading history...
            </div>
        );
    }

    return <FogView countries={countries} />;
}
