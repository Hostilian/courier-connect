'use client';

import { useLocationContext, UserLocation } from '@/components/LocationProvider';
import { countries, getCountryByCode, searchCountries } from '@/lib/countries';
import { Compass, Crosshair, Globe2, MapPin, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  onChange?: (countryCode: string) => void;
}

const quickLocations = [
  { code: 'DE', label: 'Berlin, Germany', city: 'Berlin' },
  { code: 'CZ', label: 'Prague, Czechia', city: 'Prague' },
  { code: 'TR', label: 'Istanbul, Türkiye', city: 'İstanbul' },
  { code: 'US', label: 'New York, USA', city: 'New York' },
  { code: 'CA', label: 'Toronto, Canada', city: 'Toronto' },
  { code: 'BR', label: 'São Paulo, Brazil', city: 'São Paulo' },
];

export default function LocationSelector({ onChange }: Props) {
  const { location, setLocation, detectLocation, loading, error, clearError } = useLocationContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [manualCity, setManualCity] = useState(location.city ?? '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const country = location.countryCode ? getCountryByCode(location.countryCode) : undefined;

  useEffect(() => {
    setManualCity(location.city ?? '');
  }, [location.city]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
        clearError();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, clearError]);

  useEffect(() => {
    if (location.countryCode) {
      onChange?.(location.countryCode);
    }
  }, [location.countryCode, onChange]);

  const results = useMemo(() => {
    if (!query) {
      return countries.slice(0, 40);
    }
    return searchCountries(query).slice(0, 60);
  }, [query]);

  function selectCountry(code: string, city?: string) {
    const newLocation: Partial<UserLocation> = { countryCode: code };
    if (city) {
      newLocation.city = city;
    } else {
      // When changing country, clear the city unless it's a quick selection
      newLocation.city = undefined;
    }
    setLocation(newLocation);
    setOpen(false);
    setQuery('');
  }

  function applyManualCity() {
    setLocation({ city: manualCity.trim() || undefined });
    setOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value);
          clearError();
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all min-w-[48px]"
      >
        <span className="text-lg" aria-hidden="true">
          {country?.flag ?? '📍'}
        </span>
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {country ? country.name : 'Choose location'}
        </span>
        <span className="sm:hidden text-sm font-medium text-gray-700">
          {country ? country.flag : 'Set'}
        </span>
        <span className="text-xs text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 right-0 mt-2 w-80 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold flex items-center gap-2 text-gray-800">
              <MapPin className="w-4 h-4" />
              Where can we help?
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setQuery('');
                clearError();
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close location selector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {quickLocations.map((item) => (
              <button
                key={item.code + item.label}
                type="button"
                onClick={() => selectCountry(item.code, item.city)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm hover:border-gray-300 hover:bg-gray-50"
              >
                {getCountryByCode(item.code)?.flag ?? '🌍'} {item.label}
              </button>
            ))}
          </div>

          <div className="relative mb-3">
            <Globe2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country or region"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-sm"
            />
          </div>

          <div className="max-h-56 overflow-auto mb-4">
            {results.map((countryItem) => {
              const isActive = countryItem.code === country?.code;
              return (
                <button
                  key={countryItem.code}
                  type="button"
                  onClick={() => selectCountry(countryItem.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-yellow-50 border border-yellow-200' : ''
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {countryItem.flag}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{countryItem.name}</span>
                    <span className="text-xs text-gray-500">{countryItem.nativeName}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-2 mb-3">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <Compass className="w-3 h-3" />
              Preferred city (optional)
            </label>
            <input
              value={manualCity}
              onChange={(event) => setManualCity(event.target.value)}
              placeholder="City, neighborhood, or marketplace link"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setManualCity('')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={applyManualCity}
                className="text-xs font-semibold text-yellow-600 hover:text-yellow-700"
              >
                Save city
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={detectLocation}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              <Crosshair className="w-3 h-3" />
              {loading ? 'Detecting…' : 'Use my current location'}
            </button>
            {error ? (
              <span className="text-[11px] text-red-500 max-w-[55%] text-right">{error}</span>
            ) : (
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {country ? country.name : 'Worldwide coverage'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
