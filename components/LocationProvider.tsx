"use client";

import { getCountryByCode } from '@/lib/countries';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation {
  countryCode?: string;
  city?: string;
  coordinates?: Coordinates;
}

interface LocationContextValue {
  location: UserLocation;
  setLocation: (location: UserLocation) => void;
  detectLocation: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

const STORAGE_KEY = 'cc_location_v1';
const LEGACY_COUNTRY_KEY = 'cc_country';

function readInitialLocation(): UserLocation {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserLocation;
    }
  } catch (error) {
    // Failed to parse stored location
  }

  const legacyCountry = window.localStorage.getItem(LEGACY_COUNTRY_KEY);
  if (legacyCountry) {
    return { countryCode: legacyCountry };
  }

  return {};
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<UserLocation>(() => readInitialLocation());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (location.countryCode || location.city || location.coordinates) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
        if (location.countryCode) {
          window.localStorage.setItem(LEGACY_COUNTRY_KEY, location.countryCode);
        }
      }
    } catch (storageError) {
      // Unable to persist location
    }
  }, [location]);

  const setLocation = useCallback((value: UserLocation) => {
    setLocationState((prev) => {
      const next = { ...prev, ...value };
      if (!value.countryCode) {
        next.countryCode = prev.countryCode;
      }
      return next;
    });
  }, []);

  const detectLocation = useCallback(async () => {
    if (
      typeof window === 'undefined' ||
      typeof navigator === 'undefined' ||
      !('geolocation' in navigator)
    ) {
      setError('Location detection is not supported on this device.');
      return;
    }

    setLoading(true);
    setError(null);

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const nextLocation: UserLocation = {
            coordinates: { lat: latitude, lng: longitude },
          };

          try {
            const response = await fetch(
              `/api/geocode/reverse?lat=${latitude}&lng=${longitude}`,
              {
                headers: {
                  Accept: 'application/json',
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const countryCode = data?.countryCode?.toUpperCase();
              const city = data?.city;

              if (countryCode) {
                const country = getCountryByCode(countryCode);
                if (country) {
                  nextLocation.countryCode = country.code;
                }
              }

              if (city) {
                nextLocation.city = city;
              }
            }
          } catch (geoError) {
            // Reverse geocoding failed
          }

          setLocationState((prev) => {
            const next = { ...prev, ...nextLocation };
            return next;
          });
          setLoading(false);
          resolve();
        },
        (geoError) => {
          // Geolocation error
          setError('We could not detect your location. Please choose it manually.');
          setLoading(false);
          resolve();
        },
        { timeout: 10000 }
      );
    });
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      setLocation,
      detectLocation,
      loading,
      error,
      clearError: () => setError(null),
    }),
    [location, loading, error, detectLocation, setLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
