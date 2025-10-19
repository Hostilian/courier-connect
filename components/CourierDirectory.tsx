'use client';

import { useLocationContext } from '@/components/LocationProvider';
import { getCountryByCode } from '@/lib/countries';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, MessageCircle, Package, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const RATING_MIN = 3;

export type CourierSpecialty =
  | 'express'
  | 'urgent'
  | 'scheduled'
  | 'fragile'
  | 'longDistance'
  | 'documents'
  | 'food';

type DirectoryCourier = {
  id: string;
  name: string;
  city: string;
  country?: string;
  rating: number;
  totalReviews: number;
  completedDeliveries: number;
  vehicle: string;
  languages: string[];
  specialties: CourierSpecialty[];
  isTopPerformer: boolean;
};

function formatSpecialtyLabel(specialty: CourierSpecialty, translate: (key: string, values?: Record<string, string | number>) => string) {
  const key = `specialties.${specialty}`;
  return translate(key as any, { defaultMessage: specialty });
}

export default function CourierDirectory() {
  const t = useTranslations('courier.directory');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const { location } = useLocationContext();
  const country = location.countryCode ? getCountryByCode(location.countryCode) : null;

  const [minRating, setMinRating] = useState(4);
  const [couriers, setCouriers] = useState<DirectoryCourier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCouriers() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('minRating', String(RATING_MIN));
        params.set('limit', '30');

        if (location.city) {
          params.set('city', location.city);
        } else if (country?.name) {
          params.set('country', country.name);
        }

        const response = await fetch(`/api/couriers?${params.toString()}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || 'Failed to fetch couriers');
        }

        const payload = await response.json();
        if (!cancelled) {
          setCouriers(Array.isArray(payload.couriers) ? payload.couriers : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Courier directory fetch error:', err);
          setError('load');
          setCouriers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCouriers();
    return () => {
      cancelled = true;
    };
  }, [location.city, location.countryCode, country?.name]);

  const filteredCouriers = useMemo(() => {
    return couriers.filter((courier) => courier.rating >= minRating);
  }, [couriers, minRating]);

  return (
    <section className="mt-14">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('title')}</h2>
            <p className="mt-2 text-sm md:text-base text-gray-600">{t('subtitle')}</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-sm font-medium text-gray-700" htmlFor="courier-rating-filter">
              {t('ratingLabel')}
            </label>
            <div className="flex items-center gap-3">
              <input
                id="courier-rating-filter"
                type="range"
                min={RATING_MIN}
                max={5}
                step={0.1}
                value={minRating}
                onChange={(event) => setMinRating(Number(event.target.value))}
                className="w-40 accent-current"
                style={{ color: theme?.primary }}
              />
              <span className="text-sm font-semibold text-gray-700">
                {t('ratingValue', { rating: minRating.toFixed(1) })}
              </span>
              {minRating > RATING_MIN && (
                <button
                  type="button"
                  onClick={() => setMinRating(RATING_MIN)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {t('clearFilter')}
                </button>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-44 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-dashed border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
            {t('error')}
          </div>
        )}

        {!loading && !error && couriers.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
            {t('empty')}
          </div>
        )}

        {!loading && !error && couriers.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCouriers.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3">
                <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                  {t('noResults')}
                </div>
              </div>
            ) : (
              filteredCouriers.map((courier, index) => {
                const specialties = courier.specialties ?? [];
                const accentColor = theme?.primary || '#3B82F6';
                const languages = courier.languages?.length ? courier.languages.join(', ') : t('languagesFallback');

                return (
                  <motion.div
                    key={courier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                  >
                    {courier.isTopPerformer && (
                      <div
                        className="absolute -top-3 left-6 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        <BadgeCheck className="h-3 w-3" />
                        {t('card.badgeTop')}
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{courier.name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {courier.city}
                            {courier.country ? `, ${courier.country}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end text-right">
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{courier.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {t('card.reviews', { count: courier.totalReviews })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span>{t('card.deliveries', { count: courier.completedDeliveries })}</span>
                      <span aria-hidden="true">•</span>
                      <span>{courier.vehicle}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        >
                          {formatSpecialtyLabel(specialty, t)}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{t('card.languages', { languages })}</span>
                    </div>

                    <button
                      type="button"
                      className="mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors"
                      style={{ backgroundColor: accentColor }}
                    >
                      {t('card.cta')}
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
