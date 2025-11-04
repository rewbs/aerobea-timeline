'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { AdminCountry } from './types';

interface AdminPageClientProps {
  countries: AdminCountry[];
}

const formatJson = (value: unknown): string =>
  JSON.stringify(value, null, 2);

const buildCountryPayload = (country: AdminCountry): Record<string, unknown> => ({
  id: country.id,
  code: country.code,
  name: country.name,
  start: country.start,
  end: country.end,
  createdAt: country.createdAt,
  updatedAt: country.updatedAt,
  presidents: country.presidents,
  monarchs: country.monarchs,
});

const useCopyToClipboard = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (key: string, text: string) => {
    const reset = () =>
      setTimeout(() => {
        setCopiedKey(current => (current === key ? null : current));
      }, 1800);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        reset();
        return true;
      }
    } catch (err) {
      console.warn('[admin copy] navigator.clipboard failed, falling back', err);
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) {
        setCopiedKey(key);
        reset();
        return true;
      }
    } catch (err) {
      console.error('[admin copy] execCommand fallback failed', err);
    }

    return false;
  }, []);

  return { copiedKey, copy };
};

const CopyButton = ({
  label,
  copyKey,
  payload,
  onCopy,
  copiedKey,
}: {
  label: string;
  copyKey: string;
  payload: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => Promise<boolean>;
}) => {
  const handleClick = useCallback(() => {
    void onCopy(copyKey, payload);
  }, [copyKey, onCopy, payload]);

  return (
    <button className="admin-copy-button" onClick={handleClick} type="button">
      {copiedKey === copyKey ? 'Copied!' : label}
    </button>
  );
};

const AdminPageClient = ({ countries }: AdminPageClientProps) => {
  const { copiedKey, copy } = useCopyToClipboard();

  const sortedCountries = useMemo(
    () =>
      [...countries].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      ),
    [countries]
  );

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Admin JSON Explorer</h1>
            <p>
              Inspect the stored country records, copy their JSON payloads, or
              jump into the editor for detailed changes.
            </p>
          </div>
          <Link className="admin-primary-button" href="/admin/countries/new">
            + Add New Country
          </Link>
        </div>
      </header>

      {sortedCountries.map(country => {
        const countryPayload = buildCountryPayload(country);
        const countryJson = formatJson(countryPayload);
        const presidentsJson = formatJson(country.presidents);
        const monarchsJson = formatJson(country.monarchs);

        const baseKey = `country-${country.id}`;

        return (
          <section className="admin-card" key={country.id}>
            <div className="admin-card-header">
              <div>
                <h2>{country.name}</h2>
                <div className="admin-meta">
                  <span className="admin-tag">{country.code.toUpperCase()}</span>
                  <span>
                    Start: <strong>{country.start}</strong>
                  </span>
                  <span>
                    End: <strong>{country.end ?? '—'}</strong>
                  </span>
                </div>
              </div>
              <div className="admin-card-actions">
                <Link
                  className="admin-secondary-button"
                  href={`/admin/countries/${country.id}`}
                >
                  Edit
                </Link>
                <CopyButton
                  label="Copy Country JSON"
                  copyKey={`${baseKey}-all`}
                  payload={countryJson}
                  copiedKey={copiedKey}
                  onCopy={copy}
                />
              </div>
            </div>

            <dl className="admin-details">
              <div>
                <dt>Created</dt>
                <dd>{country.createdAt}</dd>
              </div>
              <div>
                <dt>Last Updated</dt>
                <dd>{country.updatedAt}</dd>
              </div>
            </dl>

            <div className="admin-json-grid">
              <article className="admin-json-block">
                <div className="admin-json-header">
                  <h3>Presidents</h3>
                  <CopyButton
                    label="Copy Presidents JSON"
                    copyKey={`${baseKey}-presidents`}
                    payload={presidentsJson}
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                </div>
                <pre className="admin-json">{presidentsJson}</pre>
              </article>

              <article className="admin-json-block">
                <div className="admin-json-header">
                  <h3>Monarchs</h3>
                  <CopyButton
                    label="Copy Monarchs JSON"
                    copyKey={`${baseKey}-monarchs`}
                    payload={monarchsJson}
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                </div>
                <pre className="admin-json">{monarchsJson}</pre>
              </article>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AdminPageClient;
