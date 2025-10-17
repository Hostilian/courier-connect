'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Loader2, Package, TrendingUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

interface Delivery {
  id: string;
  date: string;
  amount: number;
  status: 'delivered' | 'cancelled';
}

interface EarningsData {
  totalEarnings: number;
  totalDeliveries: number;
  averageEarningPerDelivery: number;
  earningsTrend: { name: string; earnings: number }[];
  recentDeliveries: Delivery[];
}

// This is a mock function. In a real app, you'd fetch this from your API.
const fetchEarningsData = async (period: string): Promise<EarningsData> => {
  console.log(`Fetching data for period: ${period}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate some fake data based on the period
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const totalDeliveries = Math.floor(Math.random() * 20 * (days / 7)) + 5;
  const totalEarnings = totalDeliveries * (Math.random() * 15 + 20);
  const averageEarningPerDelivery = totalEarnings / totalDeliveries;

  const recentDeliveries: Delivery[] = Array.from({ length: Math.min(totalDeliveries, 5) }, (_, i) => ({
    id: `CC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: Math.random() * 30 + 15,
    status: 'delivered',
  }));

  const earningsTrend = Array.from({ length: days }, (_, i) => ({
    name: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { weekday: 'short' }),
    earnings: Math.random() * (totalEarnings / days) * 2,
  }));

  return {
    totalEarnings,
    totalDeliveries,
    averageEarningPerDelivery,
    earningsTrend,
    recentDeliveries,
  };
};

export default function CourierEarnings() {
  const t = useTranslations('courier.earnings');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || 'en', {
        style: 'currency',
        currency: 'USD', // This should probably be dynamic based on courier's country
        minimumFractionDigits: 2,
      }),
    [locale]
  );

  const formatCurrency = (value: number) => currencyFormatter.format(value);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const earningsData = await fetchEarningsData(period);
      setData(earningsData);
      setLoading(false);
    };
    loadData();
  }, [period]);

  const StatCard = ({ icon: Icon, title, value, change }: { icon: React.ElementType, title: string, value: string, change?: string }) => (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md"
      whileHover={{ translateY: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      style={{ borderTop: `4px solid ${theme?.primary || '#3B82F6'}` }}
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full" style={{ backgroundColor: `${theme?.primary || '#3B82F6'}20`}}>
          <Icon className="w-6 h-6" style={{ color: theme?.primary || '#3B82F6' }} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {change && <p className="text-sm text-green-500 mt-2">{change}</p>}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: theme?.primary || '#3B82F6' }} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-6 bg-gray-50/50 rounded-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">{t('title')}</h2>
        <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-sm">
          {['7d', '30d', '90d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                period === p ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: period === p ? theme?.primary || '#3B82F6' : 'transparent'
              }}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={DollarSign} title={t('totalEarnings')} value={formatCurrency(data.totalEarnings)} />
        <StatCard icon={Package} title={t('totalDeliveries')} value={String(data.totalDeliveries)} />
        <StatCard icon={TrendingUp} title={t('avgPerDelivery')} value={formatCurrency(data.averageEarningPerDelivery)} />
      </div>
      
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('recentDeliveries')}</h3>
        <div className="space-y-4">
          {data.recentDeliveries.length > 0 ? (
            data.recentDeliveries.map((delivery: Delivery) => (
              <div key={delivery.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{delivery.id}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(delivery.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-lg text-green-600">+{formatCurrency(delivery.amount)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">{t('noRecentDeliveries')}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
