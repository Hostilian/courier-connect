'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, MessageCircle, Package, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type CourierSpecialty =
  | 'express'
  | 'fragile'
  | 'longDistance'
  | 'food'
  | 'documents';

interface DirectoryCourier {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  totalReviews: number;
  completedDeliveries: number;
  vehicle: string;
  languages: string[];
  specialties: CourierSpecialty[];
  isTopPerformer?: boolean;
}

const courierDirectory: DirectoryCourier[] = [
  {
    id: 'c1',
    name: 'Amelia Nguyen',
    city: 'San Francisco',
    country: 'USA',
    rating: 4.9,
    totalReviews: 184,
    completedDeliveries: 1260,
    vehicle: 'Electric Cargo Bike',
    languages: ['English', 'Vietnamese'],
    specialties: ['express', 'documents'],
    isTopPerformer: true,
  },
  {
    id: 'c2',
    name: 'Mateo García',
    city: 'Madrid',
    country: 'Spain',
    rating: 4.7,
    totalReviews: 142,
    completedDeliveries: 980,
    vehicle: 'Hybrid Sedan',
    languages: ['Spanish', 'English'],
    specialties: ['longDistance', 'fragile'],
  },
  {
    id: 'c3',
    name: 'Lucia Bianchi',
    city: 'Milan',
    country: 'Italy',
    rating: 4.6,
    totalReviews: 201,
    completedDeliveries: 1543,
    vehicle: 'Compact Van',
    languages: ['Italian', 'English'],
    specialties: ['fragile', 'food'],
    isTopPerformer: true,
  },
  {
    id: 'c4',
    name: 'Omar Hassan',
    city: 'Dubai',
    country: 'UAE',
    rating: 4.5,
    totalReviews: 118,
    completedDeliveries: 764,
    vehicle: 'Motorbike',
    languages: ['Arabic', 'English'],
    specialties: ['express', 'food'],
  },
  {
    id: 'c5',
    name: 'Isabelle Moreau',
    city: 'Paris',
    country: 'France',
    rating: 4.8,
    totalReviews: 207,
    completedDeliveries: 1369,
    vehicle: 'Electric Van',
    languages: ['French', 'English'],
    specialties: ['fragile', 'documents'],
    isTopPerformer: true,
  },
  {
    id: 'c6',
    name: 'Thabo Nkosi',
    city: 'Cape Town',
    country: 'South Africa',
    rating: 4.4,
    totalReviews: 96,
    completedDeliveries: 612,
    vehicle: 'Pickup Truck',
    languages: ['English', 'Afrikaans'],
    specialties: ['longDistance', 'express'],
  },
];

type TranslateFn = (key: string, values?: Record<string, string | number | Date>) => string;

function getSpecialtyLabel(specialty: CourierSpecialty, translate: TranslateFn): string {
  switch (specialty) {
    case 'express':
      return translate('specialties.express');
    case 'fragile':
      return translate('specialties.fragile');
    case 'longDistance':
      return translate('specialties.longDistance');
    case 'food':
      return translate('specialties.food');
    case 'documents':
      return translate('specialties.documents');
    default:
      return specialty;
  }
}

export default function CourierDirectory() {
  const t = useTranslations('courier.directory');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const [minRating, setMinRating] = useState(4.0);

  const filteredCouriers = useMemo(() => {
    return courierDirectory.filter((courier) => courier.rating >= minRating);
  }, [minRating]);

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
                min={3}
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
              {minRating > 3 && (
                <button
                  type="button"
                  onClick={() => setMinRating(3)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {t('clearFilter')}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCouriers.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3">
              <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                {t('noResults')}
              </div>
            </div>
          ) : (
            filteredCouriers.map((courier, index) => {
              const specialties = courier.specialties.map((item) => getSpecialtyLabel(item, t));
              const accentColor = theme?.primary || '#3B82F6';

              return (
                <motion.div
                  key={courier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
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
                          {courier.city}, {courier.country}
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
                    {specialties.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>{t('card.languages', { languages: courier.languages.join(', ') })}</span>
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
      </div>
    </section>
  );
}
