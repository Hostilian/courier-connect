'use client';

import { useEffect, useState } from 'react';
import { countries, getCountryByCode, searchCountries } from '@/lib/countries';

interface Props {
  onChange?: (countryCode: string) => void;
}

export default function LocationSelector({ onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(countries.slice(0, 50));
  const [selected, setSelected] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('cc_country') || '';
  });

  useEffect(() => {
    if (!query) {
      setResults(countries.slice(0, 50));
      return;
    }
    setResults(searchCountries(query));
  }, [query]);

  useEffect(() => {
    if (!selected) return;
    localStorage.setItem('cc_country', selected);
    onChange?.(selected);
  }, [selected, onChange]);

  function choose(code: string) {
    setSelected(code);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white shadow-sm border"
      >
        <span>{selected ? (getCountryByCode(selected)?.flag ?? '📍') : '📍'}</span>
        <span className="text-sm">{selected ? getCountryByCode(selected)?.name : 'Select location'}</span>
        <span className="ml-2 text-xs text-muted-foreground">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 right-0 mt-2 w-72 bg-white border rounded-md shadow-lg p-3">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search country or city"
            className="w-full px-3 py-2 border rounded-md mb-2"
          />

          <div className="max-h-60 overflow-auto">
            {results.map(c => (
              <button
                key={c.code}
                onClick={() => choose(c.code)}
                className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded-md flex items-center gap-2"
              >
                <span className="text-lg">{c.flag}</span>
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.nativeName}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md bg-gray-100">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
