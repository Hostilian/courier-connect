"use client";

import { getLanguageByCode } from '@/lib/languages';
import {
    BadgeCheck,
    Calendar,
    Camera,
    CheckCircle,
    Clock,
    DollarSign,
    Mail,
    MapPin,
    Package,
    Phone,
    Shield,
    Star,
    User,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface CourierReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  deliveryType: string;
  city: string;
  verified: boolean;
}

interface RatingDistribution {
  rating: number;
  count: number;
}

interface PerformanceMetrics {
  reliability: number;
  communication: number;
  timeliness: number;
  care: number;
}

interface RatingSummary {
  average: number;
  totalReviews: number;
  completionRate: number;
  onTimePercentage: number;
  repeatCustomers: number;
  averageResponseTime: string;
  metrics: PerformanceMetrics;
  distribution: RatingDistribution[];
}

interface CourierProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicle: string;
  licensePlate: string;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  joinDate: string;
  insuranceExpiry: string;
  verified: boolean;
  ratingSummary: RatingSummary;
  badges: string[];
  serviceAreas: string[];
  specialties: string[];
  safetyIncidents: number;
  reviews: CourierReview[];
}

const TIMEFRAME_WINDOWS = {
  '30': 30,
  '90': 90,
  all: null,
} as const;

type TimeframeKey = keyof typeof TIMEFRAME_WINDOWS;

export default function CourierProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('courier.profile');
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const gradientClass = theme?.gradient
    ? `bg-gradient-to-r ${theme.gradient}`
    : 'bg-gradient-to-r from-blue-600 to-purple-600';
  const accentColor = theme?.primary || '#3B82F6';

  const [profile, setProfile] = useState<CourierProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeKey>('90');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('courierToken');
        if (!token) {
          router.push('/courier/login');
          return;
        }

        setProfile({
          name: 'John Courier',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, San Francisco, CA 94102',
          vehicle: 'Honda Civic 2020',
          licensePlate: 'ABC-1234',
          rating: 4.8,
          totalDeliveries: 342,
          totalEarnings: 2840.5,
          joinDate: '2024-01-15',
          insuranceExpiry: '2025-06-30',
          verified: true,
          ratingSummary: {
            average: 4.8,
            totalReviews: 184,
            completionRate: 98,
            onTimePercentage: 96,
            repeatCustomers: 42,
            averageResponseTime: '7 min',
            metrics: {
              reliability: 4.9,
              communication: 4.7,
              timeliness: 4.8,
              care: 4.9,
            },
            distribution: [
              { rating: 5, count: 132 },
              { rating: 4, count: 38 },
              { rating: 3, count: 10 },
              { rating: 2, count: 3 },
              { rating: 1, count: 1 },
            ],
          },
          badges: ['Top Courier Q3 2025', 'Customer Favorite', 'Zero Incident Streak'],
          serviceAreas: ['San Francisco, CA', 'Oakland, CA', 'San Jose, CA'],
          specialties: ['Express deliveries', 'Fragile packages', 'Airport pickups'],
          safetyIncidents: 0,
          reviews: [
            {
              id: 'r1',
              customerName: 'Nina Patel',
              rating: 5,
              comment:
                'John kept me updated the entire time and handled fragile samples with great care. Highly recommend.',
              createdAt: '2025-10-01T10:34:00.000Z',
              deliveryType: 'express',
              city: 'San Francisco',
              verified: true,
            },
            {
              id: 'r2',
              customerName: 'Liam O’Connor',
              rating: 5,
              comment: 'Arrived early, super friendly, and the package arrived exactly as packed.',
              createdAt: '2025-09-20T14:10:00.000Z',
              deliveryType: 'fragile',
              city: 'Oakland',
              verified: true,
            },
            {
              id: 'r3',
              customerName: 'Sofia Martinez',
              rating: 4,
              comment: 'Great service overall. Traffic caused a small delay but communication was clear.',
              createdAt: '2025-08-28T09:18:00.000Z',
              deliveryType: 'scheduled',
              city: 'San Jose',
              verified: true,
            },
            {
              id: 'r4',
              customerName: 'Emma Chen',
              rating: 5,
              comment: 'Handled an urgent medical delivery flawlessly. Will book again.',
              createdAt: '2025-06-12T08:22:00.000Z',
              deliveryType: 'urgent',
              city: 'San Francisco',
              verified: true,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    try {
      setIsEditing(false);
      alert(t('notifications.updated'));
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(t('notifications.error'));
    }
  };

  const filteredReviews = useMemo(() => {
    if (!profile) {
      return [];
    }

    const days = TIMEFRAME_WINDOWS[selectedTimeframe];
    if (!days) {
      return profile.reviews;
    }

    const now = Date.now();
    const windowMs = days * 24 * 60 * 60 * 1000;
    return profile.reviews.filter((review) => {
      const createdAt = new Date(review.createdAt).getTime();
      return now - createdAt <= windowMs;
    });
  }, [profile, selectedTimeframe]);

  const ratingDistribution = useMemo(() => {
    if (!profile) return [];
    const total = profile.ratingSummary.totalReviews || 1;
    return profile.ratingSummary.distribution.map((bucket) => ({
      ...bucket,
      percentage: Math.round((bucket.count / total) * 100),
    }));
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: accentColor }}></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('loadError')}</p>
          <button
            onClick={() => router.push('/courier/dashboard')}
            className="text-blue-600 hover:underline"
          >
            {t('returnToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  const insuranceIsExpiringSoon =
    new Date(profile.insuranceExpiry).getTime() < Date.now() + 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${gradientClass} rounded-2xl shadow-lg p-8 text-white mb-8`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold" style={{ color: accentColor }}>
                  {profile.name.charAt(0)}
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-2 -right-2 rounded-full p-2 bg-green-500">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
                <button
                  type="button"
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1"
                  style={{ backgroundColor: 'rgba(255,255,255,0.16)' }}
                >
                  <Camera className="w-3 h-3" />
                  {t('editPhoto')}
                </button>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{profile.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-blue-100">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    {profile.rating.toFixed(1)}
                  </span>
                  <span aria-hidden="true">•</span>
                  <span>{t('header.deliveries', { count: profile.totalDeliveries })}</span>
                  <span aria-hidden="true">•</span>
                  <span>{t('header.earnings', { amount: profile.totalEarnings.toFixed(2) })}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-wide text-blue-100">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {t('header.completionRate', { value: profile.ratingSummary.completionRate })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {t('header.responseTime', { value: profile.ratingSummary.averageResponseTime })}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="self-start rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
            >
              {isEditing ? t('actions.cancelEdit') : t('actions.editProfile')}
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('quickStats.title')}</h2>
              <div className="mt-5 space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>{t('quickStats.totalEarnings')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">${profile.totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-indigo-600" />
                    <span>{t('quickStats.completedDeliveries')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profile.totalDeliveries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{t('quickStats.rating')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profile.rating.toFixed(1)} / 5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{t('quickStats.memberSince')}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(profile.joinDate))}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('verification.title')}</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                {['email', 'phone', 'id', 'background', 'insurance'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs">
                      ✓
                    </div>
                    <span>{t(`verification.items.${item}`)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('serviceAreas.title')}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-gray-900">{t('serviceAreas.specialtiesTitle')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('highlights.title')}</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                {profile.badges.map((badge) => (
                  <li key={badge} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    {badge}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-4 w-4" />
                {t('highlights.safetyRecord', { incidents: profile.safetyIncidents })}
              </p>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('personalInfo.title')}</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="mr-1 inline h-4 w-4" />
                    {t('personalInfo.name')}
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setProfile((prev) => (prev ? { ...prev, name: event.target.value } : prev))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="mr-1 inline h-4 w-4" />
                    {t('personalInfo.email')}
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setProfile((prev) => (prev ? { ...prev, email: event.target.value } : prev))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="mr-1 inline h-4 w-4" />
                    {t('personalInfo.phone')}
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setProfile((prev) => (prev ? { ...prev, phone: event.target.value } : prev))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    {t('personalInfo.address')}
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setProfile((prev) => (prev ? { ...prev, address: event.target.value } : prev))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('vehicleInfo.title')}</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="mr-1 inline h-4 w-4" />
                    {t('vehicleInfo.vehicle')}
                  </label>
                  <input
                    type="text"
                    value={profile.vehicle}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setProfile((prev) => (prev ? { ...prev, vehicle: event.target.value } : prev))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder={t('vehicleInfo.placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vehicleInfo.licensePlate')}
                  </label>
                  <input
                    type="text"
                    value={profile.licensePlate}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setProfile((prev) => (prev ? { ...prev, licensePlate: event.target.value } : prev))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="mr-1 inline h-4 w-4" />
                    {t('vehicleInfo.insuranceExpiry')}
                  </label>
                  <input
                    type="date"
                    value={profile.insuranceExpiry}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setProfile((prev) => (prev ? { ...prev, insuranceExpiry: event.target.value } : prev))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                  {insuranceIsExpiringSoon && (
                    <p className="mt-2 text-sm text-orange-600">{t('vehicleInfo.insuranceWarning')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('performance.title')}</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {Object.entries(profile.ratingSummary.metrics).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{t(`performance.metrics.${key}`)}</span>
                      <span className="text-lg font-bold" style={{ color: accentColor }}>
                        {value.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${(value / 5) * 100}%`, backgroundColor: accentColor }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900">{t('performance.distribution')}</h3>
                <div className="mt-4 space-y-3 text-xs text-gray-600">
                  {ratingDistribution.map((bucket) => (
                    <div key={bucket.rating} className="flex items-center gap-3">
                      <span className="w-8 font-semibold">{bucket.rating}★</span>
                      <div className="h-2 flex-1 rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${bucket.percentage}%`, backgroundColor: accentColor }}
                        ></div>
                      </div>
                      <span className="w-10 text-right">{bucket.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{t('reviews.title')}</h2>
                  <p className="text-sm text-gray-500">{t('reviews.subtitle', { count: filteredReviews.length })}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <label className="text-gray-600" htmlFor="review-timeframe">
                    {t('reviews.filterLabel')}
                  </label>
                  <select
                    id="review-timeframe"
                    value={selectedTimeframe}
                    onChange={(event) => setSelectedTimeframe(event.target.value as TimeframeKey)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">{t('reviews.timeframe.30')}</option>
                    <option value="90">{t('reviews.timeframe.90')}</option>
                    <option value="all">{t('reviews.timeframe.all')}</option>
                  </select>
                </div>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                  {t('reviews.empty')}
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="font-semibold text-gray-900">{review.customerName}</div>
                        <span aria-hidden="true" className="hidden sm:inline">
                          •
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {review.city}
                        </div>
                        {review.verified && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            <Shield className="h-3 w-3" />
                            {t('reviews.verified')}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={`${review.id}-star-${index}`}
                            className={`h-4 w-4 ${index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                        <span className="ml-2 text-xs uppercase tracking-wide text-gray-400">
                          {t('reviews.deliveryType', { type: review.deliveryType })}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-700">“{review.comment}”</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(review.createdAt))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">{t('documents.title')}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[t('documents.license'), t('documents.insurance'), t('documents.registration')].map((label) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
                  >
                    <Camera className="h-8 w-8 text-gray-400" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  {t('actions.cancelEdit')}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition"
                  style={{ backgroundColor: accentColor }}
                >
                  {t('actions.saveChanges')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
