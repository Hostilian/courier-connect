'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

interface Delivery {
  id: string;
  date: string;
  amount: number;
}

interface EarningsData {
  totalEarnings: number;
  totalDeliveries: number;
  averageEarningPerDelivery: number;
  recentDeliveries: Delivery[];
}

type Period = '7d' | '30d' | '90d';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
});

export default function CourierEarnings() {
  const t = useTranslations('courier.earnings');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const [period, setPeriod] = useState<Period>('30d');

  const { data, error, isLoading } = useSWR<EarningsData>(`/api/courier/earnings?period=${period}`, fetcher);

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }), // Assuming USD for now
    [locale]
  );

  const StatCard = ({ icon: Icon, title, value, loading }: { icon: React.ElementType, title: string, value: string | number, loading?: boolean }) => (
    <motion.div 
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      whileHover={{ translateY: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)' }}
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: `${theme?.primary}20` }}>
          <Icon className="w-6 h-6" style={{ color: theme?.primary }} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="bg-gray-50/80 p-4 sm:p-6 rounded-2xl border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">{t('title')}</h2>
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-gray-200 shadow-sm">
          {(['7d', '30d', '90d'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                period === p ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: period === p ? theme?.primary : 'transparent' }}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-center">
          <AlertCircle className="w-6 h-6 mr-3" />
          <div>
            <p className="font-bold">{t('error.title')}</p>
            <p>{t('error.message')}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <StatCard icon={DollarSign} title={t('totalEarnings')} value={currencyFormatter.format(data?.totalEarnings ?? 0)} loading={isLoading} />
        <StatCard icon={Package} title={t('totalDeliveries')} value={data?.totalDeliveries ?? 0} loading={isLoading} />
        <StatCard icon={TrendingUp} title={t('avgPerDelivery')} value={currencyFormatter.format(data?.averageEarningPerDelivery ?? 0)} loading={isLoading} />
      </div>
      
      <motion.div 
        className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('recentDeliveries')}</h3>
        <div className="space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-gray-100 rounded-full h-10 w-10 animate-pulse"></div>
                  <div className="w-full">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/5 animate-pulse"></div>
              </div>
            ))
          ) : data?.recentDeliveries && data.recentDeliveries.length > 0 ? (
            data.recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{delivery.id}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(delivery.date).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-lg text-green-600">+{currencyFormatter.format(delivery.amount)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">{t('noRecentDeliveries')}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
