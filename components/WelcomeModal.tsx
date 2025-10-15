'use client';

import { countries, getCountriesByRegion } from '@/lib/countries';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Show modal if user hasn't selected a location yet
    const hasLocation = localStorage.getItem('cc_country');
    const dismissed = sessionStorage.getItem('cc_welcome_dismissed');
    if (!hasLocation && !dismissed) {
      setOpen(true);
    }
  }, []);

  function selectCountry(code: string) {
    localStorage.setItem('cc_country', code);
    setOpen(false);
  }

  function dismiss() {
    sessionStorage.setItem('cc_welcome_dismissed', 'true');
    setOpen(false);
  }

  if (!open) return null;

  const popularCities = [
    { code: 'DE', city: 'Berlin', flag: '🇩🇪' },
    { code: 'CZ', city: 'Prague', flag: '🇨🇿' },
    { code: 'TR', city: 'Istanbul', flag: '🇹🇷' },
    { code: 'US', city: 'New York', flag: '🇺🇸' },
    { code: 'GB', city: 'London', flag: '🇬🇧' },
    { code: 'FR', city: 'Paris', flag: '🇫🇷' },
  ];

  const euCountries = getCountriesByRegion('EU').slice(0, 8);
  const filtered = query
    ? countries.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : countries.slice(0, 20);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Welcome to Courier Connect!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Where are you? We'll show you local couriers nearby.
              </p>
            </div>
            <button onClick={dismiss} className="p-2 hover:bg-gray-100 rounded-md">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Popular Cities */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Popular cities</h3>
            <div className="grid grid-cols-2 gap-2">
              {popularCities.map(city => (
                <button
                  key={city.code}
                  onClick={() => selectCountry(city.code)}
                  className="flex items-center gap-2 px-4 py-3 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl">{city.flag}</span>
                  <span className="font-medium">{city.city}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              placeholder="Or search your country..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-4 py-3 border rounded-md"
            />
          </div>

          {/* Results */}
          <div className="space-y-1 max-h-60 overflow-auto">
            {filtered.map(c => (
              <button
                key={c.code}
                onClick={() => selectCountry(c.code)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-md transition-colors"
              >
                <span className="text-xl">{c.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.continent}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Skip button */}
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={dismiss}
              className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
