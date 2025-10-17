'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface EarningsData {
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  completedDeliveries: number;
  todayDeliveries: number;
  averageEarningsPerDelivery: number;
  platformFeesTotal: number;
}

interface CourierEarningsProps {
  data: EarningsData;
}

export default function CourierEarnings({ data }: CourierEarningsProps) {
  const t = useTranslations('courier.earnings');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || 'en', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }),
    [locale]
  );

  const formatCurrency = (value: number) => currencyFormatter.format(value);

  const stats = [
    {
      label: t('total'),
      value: formatCurrency(data.totalEarnings),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: t('today'),
      value: formatCurrency(data.todayEarnings),
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t('week'),
      value: formatCurrency(data.weekEarnings),
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: t('month'),
      value: formatCurrency(data.monthEarnings),
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Earnings Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} rounded-xl p-6 border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Additional Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">{t('performance')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('completedDeliveries')}</p>
            <p className="text-2xl font-bold" style={{ color: theme?.primary || '#3B82F6' }}>
              {data.completedDeliveries}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('todayDeliveries')}</p>
            <p className="text-2xl font-bold" style={{ color: theme?.primary || '#3B82F6' }}>
              {data.todayDeliveries}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('averagePerDelivery')}</p>
            <p className="text-2xl font-bold" style={{ color: theme?.primary || '#3B82F6' }}>
              {formatCurrency(data.averageEarningsPerDelivery)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Earnings Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">{t('breakdown')}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-700">{t('yourEarnings')}</span>
            <span className="text-lg font-bold text-green-700">
              {formatCurrency(data.totalEarnings)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">{t('platformFees')}</span>
            <span className="text-lg font-bold text-gray-700">
              {formatCurrency(data.platformFeesTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
            <span className="text-sm font-medium text-blue-700">{t('totalRevenue')}</span>
            <span className="text-lg font-bold text-blue-700">
              {formatCurrency(data.totalEarnings + data.platformFeesTotal)}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          {t('split')} (70% {t('courier')} / 30% {t('platform')})
        </p>
      </motion.div>
    </div>
  );
}
