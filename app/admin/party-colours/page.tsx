'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PartyColour {
  id: number;
  name: string;
  colour: string;
}

export default function PartyColoursPage() {
  const [partyColours, setPartyColours] = useState<PartyColour[]>([]);
  const [partiesInUse, setPartiesInUse] = useState<string[]>([]);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyColour, setNewPartyColour] = useState('#999999');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [coloursRes, partiesRes] = await Promise.all([
        fetch('/api/party-colours'),
        fetch('/api/parties'),
      ]);
      const coloursData = await coloursRes.json();
      const partiesData = await partiesRes.json();
      setPartyColours(coloursData.partyColours || []);
      setPartiesInUse(partiesData.parties || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const configuredPartyNames = new Set(partyColours.map(p => p.name));
  const missingParties = partiesInUse.filter(p => !configuredPartyNames.has(p));

  async function handleAddParty(e: React.FormEvent) {
    e.preventDefault();
    if (!newPartyName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/party-colours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPartyName, colour: newPartyColour }),
      });
      if (res.ok) {
        setNewPartyName('');
        setNewPartyColour('#999999');
        loadData();
      }
    } catch (error) {
      console.error('Failed to add party colour:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateColour(id: number, colour: string) {
    try {
      await fetch(`/api/party-colours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colour }),
      });
      setPartyColours(prev =>
        prev.map(p => (p.id === id ? { ...p, colour } : p))
      );
    } catch (error) {
      console.error('Failed to update colour:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this party colour?')) return;

    try {
      await fetch(`/api/party-colours/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Failed to delete party colour:', error);
    }
  }

  async function handleQuickAdd(partyName: string) {
    setSaving(true);
    try {
      const res = await fetch('/api/party-colours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: partyName, colour: '#999999' }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to add party colour:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <h1>Party Colours</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Party Colours</h1>
            <p>Configure the colours displayed for each political party.</p>
          </div>
          <Link className="admin-secondary-button" href="/admin">
            ← Back to Admin
          </Link>
        </div>
      </header>

      {missingParties.length > 0 && (
        <section className="admin-card" style={{ borderColor: 'rgba(255, 193, 7, 0.5)', background: 'rgba(255, 193, 7, 0.1)' }}>
          <div className="admin-card-header">
            <div>
              <h2>⚠️ Parties Without Colours</h2>
              <p style={{ margin: '8px 0 0', opacity: 0.9 }}>
                The following parties are associated with leaders but have no colour configured:
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {missingParties.map(party => (
              <div key={party} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px' }}>
                <span style={{ fontWeight: 'bold' }}>{party}</span>
                <button
                  onClick={() => handleQuickAdd(party)}
                  disabled={saving}
                  className="admin-copy-button"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Add New Party Colour</h2>
        </div>
        <form onSubmit={handleAddParty} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Party name"
            value={newPartyName}
            onChange={e => setNewPartyName(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              flex: 1,
              minWidth: '200px',
            }}
          />
          <input
            type="color"
            value={newPartyColour}
            onChange={e => setNewPartyColour(e.target.value)}
            style={{ width: '50px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          />
          <button type="submit" disabled={saving || !newPartyName.trim()} className="admin-primary-button">
            Add Party
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Configured Party Colours ({partyColours.length})</h2>
        </div>
        {partyColours.length === 0 ? (
          <p>No party colours configured yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', opacity: 0.8 }}>Party Name</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', opacity: 0.8 }}>Colour</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', opacity: 0.8 }}>Preview</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', opacity: 0.8 }}>In Use</th>
                <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', opacity: 0.8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partyColours.map(party => (
                <tr key={party.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{party.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="color"
                        value={party.colour.startsWith('#') ? party.colour.slice(0, 7) : '#999999'}
                        onChange={e => handleUpdateColour(party.id, e.target.value)}
                        style={{ width: '40px', height: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      />
                      <code style={{ fontSize: '0.85rem', opacity: 0.8 }}>{party.colour}</code>
                    </div>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: party.colour, color: 'white' }}>
                      {party.name}
                    </span>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {partiesInUse.includes(party.name) ? (
                      <span style={{ color: '#4caf50' }}>✓</span>
                    ) : (
                      <span style={{ opacity: 0.5 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                      onClick={() => handleDelete(party.id)}
                      className="admin-copy-button"
                      style={{ background: 'rgba(244, 67, 54, 0.3)', borderColor: 'rgba(244, 67, 54, 0.5)' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
