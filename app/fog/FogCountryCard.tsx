'use client';

import { useMemo } from 'react';
import type { President, Monarch } from '../../lib/timeline';

interface FogCountryCardProps {
    code: string;
    name: string;
    currentDate: Date;
    president?: President;
    monarch?: Monarch;
}

export default function FogCountryCard({
    code,
    name,
    currentDate,
    president,
    monarch,
}: FogCountryCardProps) {
    // Helper to format date
    const formatDate = (date: Date) => date.toISOString().slice(0, 4);

    // Find current event for president
    const currentEvent = president?.events.find(
        e =>
            e.date <= currentDate &&
            !president.events.find(ne => ne.date > e.date && ne.date <= currentDate)
    );

    // Helper to calculate bars
    const calculateBars = (
        birth: Date,
        death: Date | null,
        termStart: Date,
        termEnd: Date | null
    ) => {
        const currentMs = currentDate.getTime();
        const birthMs = birth.getTime();
        const deathMs = death ? death.getTime() : null;
        const startMs = termStart.getTime();
        const endMs = termEnd ? termEnd.getTime() : null;

        // Life Bar (Red) - shrinks from birth to death
        let lifeHeight = 1;
        if (deathMs) {
            if (currentMs < deathMs) {
                lifeHeight = Math.max(0, (deathMs - currentMs) / (deathMs - birthMs));
            } else {
                lifeHeight = 0;
            }
        }

        // Term Bar (Green) - shrinks from start to end
        let termHeight = 1;
        if (endMs) {
            if (currentMs < endMs) {
                termHeight = Math.max(0, (endMs - currentMs) / (endMs - startMs));
            } else {
                termHeight = 0;
            }
        }

        return { lifeHeight, termHeight };
    };

    // Calculate Monarch Bars
    const monarchBars = monarch
        ? calculateBars(monarch.birth, monarch.death, monarch.start_reign, monarch.end_reign)
        : { lifeHeight: 0, termHeight: 0 };

    // Calculate President Bars
    let presidentBars = { lifeHeight: 0, termHeight: 0 };
    if (president) {
        // Find current term start/end
        let termStart = president.events[0]?.date; // Fallback
        let termEnd = null;

        // Sort events to be safe
        const sortedEvents = [...president.events].sort((a, b) => a.date.getTime() - b.date.getTime());

        for (let i = 0; i < sortedEvents.length; i++) {
            if (sortedEvents[i].type === 1) { // PRESIDENCY_BEGINS
                const start = sortedEvents[i].date;
                let end = null;
                // Find matching end
                for (let j = i + 1; j < sortedEvents.length; j++) {
                    if (sortedEvents[j].type === 2) { // PRESIDENCY_ENDS
                        end = sortedEvents[j].date;
                        break;
                    }
                    if (sortedEvents[j].type === 1) break; // Next term starts
                }

                if (currentDate >= start && (!end || currentDate <= end)) {
                    termStart = start;
                    termEnd = end;
                    break;
                }
            }
        }

        if (termStart) {
            presidentBars = calculateBars(president.birth, president.death, termStart, termEnd);
        }
    }

    return (
        <div className="fog-card">
            <div className="fog-card-header">
                <h3>{name}</h3>
                <span className="fog-code">{code.toUpperCase()}</span>
            </div>

            <div className="fog-leaders">
                {monarch ? (
                    <div className="fog-leader monarch">
                        <div className="fog-leader-image-container">
                            <div
                                className="fog-leader-image"
                                style={{
                                    backgroundImage: monarch.imageUrl ? `url(${monarch.imageUrl})` : undefined,
                                }}
                            >
                                {!monarch.imageUrl && <div className="fog-placeholder">👑</div>}
                            </div>
                            {/* Bars */}
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    width: '6px',
                                    height: `${monarchBars.lifeHeight * 100}%`,
                                    backgroundColor: 'red',
                                    zIndex: 10,
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    bottom: 0,
                                    width: '6px',
                                    height: `${monarchBars.termHeight * 100}%`,
                                    backgroundColor: 'green',
                                    zIndex: 10,
                                }}
                            />
                        </div>
                        <div className="fog-leader-info">
                            <span className="fog-role">Monarch</span>
                            <span className="fog-name">{monarch.name}</span>
                            <span className="fog-term">
                                {formatDate(monarch.start_reign)} –{' '}
                                {monarch.end_reign ? formatDate(monarch.end_reign) : 'Present'}
                            </span>
                            {monarch.death_cause && (
                                <div className="fog-death-cause">
                                    Known for: {monarch.death_cause}
                                </div>
                            )}
                            {monarch.notes && <div className="fog-details">{monarch.notes}</div>}
                        </div>
                    </div>
                ) : (
                    <div className="fog-leader-empty">
                        <span>No Monarch</span>
                    </div>
                )}

                {president ? (
                    <div className="fog-leader president">
                        <div className="fog-leader-image-container">
                            <div
                                className="fog-leader-image"
                                style={{
                                    backgroundImage: president.imageUrl ? `url(${president.imageUrl})` : undefined,
                                }}
                            >
                                {!president.imageUrl && <div className="fog-placeholder">👔</div>}
                            </div>
                            {/* Bars */}
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    width: '6px',
                                    height: `${presidentBars.lifeHeight * 100}%`,
                                    backgroundColor: 'red',
                                    zIndex: 10,
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    bottom: 0,
                                    width: '6px',
                                    height: `${presidentBars.termHeight * 100}%`,
                                    backgroundColor: 'green',
                                    zIndex: 10,
                                }}
                            />
                        </div>
                        <div className="fog-leader-info">
                            <span className="fog-role">President</span>
                            <span className="fog-name">{president.name}</span>
                            <span className="fog-party" style={{ opacity: 0.8 }}>{president.party}</span>
                            {currentEvent && (
                                <div className="fog-details">
                                    {currentEvent.text}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="fog-leader-empty">
                        <span>No President</span>
                    </div>
                )}
            </div>
        </div>
    );
}
