'use client';

import { useLocationContext } from '@/components/LocationProvider';
import { countries } from '@/lib/countries';
import { Crosshair, MapPin, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function WelcomeModal() {
  const { location, setLocation, detectLocation, loading, error, clearError } = useLocationContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const dismissed = typeof window !== 'undefined' ? sessionStorage.getItem('cc_welcome_dismissed') : null;
    if (!location.countryCode && !dismissed) {
      setOpen(true);
    }
  }, [location.countryCode]);

  useEffect(() => {
    if (location.countryCode) {
      setOpen(false);
    }
  }, [location.countryCode]);

  function selectCountry(code: string, city?: string) {
    setLocation({ countryCode: code, city });
    sessionStorage.setItem('cc_welcome_dismissed', 'true');
    setOpen(false);
  }

  function dismiss() {
    sessionStorage.setItem('cc_welcome_dismissed', 'true');
    clearError();
    setOpen(false);
  }

  const popularCities = [
    { code: 'DE', city: 'Berlin', flag: '🇩🇪' },
    { code: 'CZ', city: 'Prague', flag: '🇨🇿' },
    { code: 'TR', city: 'Istanbul', flag: '🇹🇷' },
    { code: 'US', city: 'New York', flag: '🇺🇸' },
    { code: 'GB', city: 'London', flag: '🇬🇧' },
    { code: 'FR', city: 'Paris', flag: '🇫🇷' },
  ];

  const filtered = useMemo(() => {
    if (!query) {
      return countries.slice(0, 30);
    }
    const lower = query.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(lower) ||
      country.nativeName.toLowerCase().includes(lower) ||
      country.code.toLowerCase().includes(lower)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Courier Connect</h2>
              <p className="text-sm text-gray-600 mt-1">
                Tell us where you are so we can match you with fast couriers nearby.
              </p>
            </div>
            <button
              onClick={dismiss}
              className="self-end p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
              aria-label="Close welcome modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Popular hubs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularCities.map((item) => (
                <button
                  key={item.code}
                  onClick={() => selectCountry(item.code, item.city)}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all"
                >
                  <span className="text-xl" aria-hidden="true">{item.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">{item.city}</p>
                    <p className="text-xs text-gray-500">Tap to start here</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">
              Search another country
            </label>
            <input
              placeholder="Start typing your country, region, or code"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-sm"
            />
          </div>

          <div className="space-y-2 max-h-52 overflow-auto">
            {filtered.map((country) => (
              <button
                key={country.code}
                onClick={() => selectCountry(country.code)}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left hover:bg-gray-50 focus:bg-gray-100 transition-colors"
              >
                <span className="text-xl" aria-hidden="true">{country.flag}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{country.name}</p>
                  <p className="text-xs text-gray-500">{country.nativeName}</p>
                </div>
                <span className="ml-auto text-[11px] text-gray-400 uppercase">{country.region}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100 pt-4">
            <button
              onClick={detectLocation}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-60"
            >
              <Crosshair className="w-4 h-4" />
              {loading ? 'Detecting location…' : 'Use my current location'}
            </button>
            {error ? (
              <p className="text-xs text-red-500 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {error}
              </p>
            ) : (
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Choose any country — we cover EU, Americas, and beyond
              </p>
            )}
          </div>

          <button
            onClick={dismiss}
            className="w-full text-center text-xs text-gray-500 underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
