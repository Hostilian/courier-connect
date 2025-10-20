'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronRight, Loader, MapPin, Package } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    // @ts-ignore
    error.info = res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }
  return res.json();
});

interface Delivery {
  _id: string;
  trackingId: string;
  pickupAddress: { street: string; city: string; };
  deliveryAddress: { street: string; city: string; };
  urgency: 'standard' | 'express' | 'urgent';
  price: number;
}

export default function AvailableDeliveries() {
  const t = useTranslations('courier.dashboard.availableJobs');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const { data: deliveries, error, isLoading } = useSWR<Delivery[]>('/api/courier/available-deliveries', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleAcceptJob = async (deliveryId: string) => {
    setIsSubmitting(deliveryId);
    try {
      const res = await fetch('/api/deliveries/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t('acceptError.generic'));
      }
      
      toast.success(t('acceptSuccess'));
      // Here you would typically re-validate the SWR data for this and other components
      // For now, we'll just rely on the next interval refresh
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(null);
    }
  };

  const urgencyStyles: { [key: string]: string } = {
    standard: 'bg-blue-100 text-blue-800 border-blue-200',
    express: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };
  
  const formatAddress = (address: { street: string; city: string; }) => {
    if (!address) return 'N/A';
    return `${address.street}, ${address.city}`;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10 flex flex-col items-center">
          <Loader className="h-12 w-12 text-gray-400 animate-spin" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">{t('loading')}</h3>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 flex flex-col items-center bg-red-50 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-red-900">{t('error.title')}</h3>
          <p className="mt-1 text-sm text-red-700">{t('error.description')}</p>
        </div>
      );
    }

    if (!deliveries || deliveries.length === 0) {
      return (
        <div className="text-center py-10">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noDeliveries.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('noDeliveries.description')}</p>
        </div>
      );
    }

    return deliveries.map((delivery, index) => (
      <motion.div
        key={delivery._id}
        className="group bg-white hover:bg-gray-50 transition-colors duration-200 rounded-xl p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg text-gray-800">{delivery.trackingId}</p>
              <span className={`hidden sm:inline-block px-3 py-1 text-xs font-semibold rounded-full border ${urgencyStyles[delivery.urgency]}`}>
                {t(`urgency.${delivery.urgency}`)}
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span><span className="font-medium text-gray-700">{t('from')}:</span> {formatAddress(delivery.pickupAddress)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span><span className="font-medium text-gray-700">{t('to')}:</span> {formatAddress(delivery.deliveryAddress)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
               <span className={`sm:hidden px-3 py-1 text-xs font-semibold rounded-full border ${urgencyStyles[delivery.urgency]}`}>
                {t(`urgency.${delivery.urgency}`)}
              </span>
            </div>
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 flex items-center justify-between">
            <p className="text-2xl font-bold" style={{color: theme?.primary || '#2563EB'}}>
              ${delivery.price.toFixed(2)}
            </p>
            <button 
              onClick={() => handleAcceptJob(delivery._id)}
              disabled={isSubmitting === delivery._id}
              className="group-hover:bg-blue-600 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme?.primary || '#2563EB' }}
            >
              {isSubmitting === delivery._id ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {t('acceptButton')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    ));
  };

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-2xl border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
        {!isLoading && !error && (
          <p className="text-gray-500 mt-1">{t('subtitle', { count: deliveries?.length ?? 0 })}</p>
        )}
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {renderContent()}
      </div>
    </motion.div>
  );
}
