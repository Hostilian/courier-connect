'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ChevronRight, Loader, MapPin, Package, Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // @ts-ignore
    error.info = res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }
  return res.json();
});

type DeliveryStatus = 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

interface Delivery {
  _id: string;
  trackingId: string;
  pickupAddress: { street: string; city: string; };
  deliveryAddress: { street: string; city: string; };
  status: DeliveryStatus;
  price: number;
}

const statusDetails: { [key in DeliveryStatus]?: { icon: React.ElementType, color: string, nextAction?: string, nextStatus?: DeliveryStatus } } = {
  accepted: { icon: CheckCircle, color: 'text-blue-600 bg-blue-100 border-blue-200', nextAction: 'markPickedUp', nextStatus: 'picked_up' },
  picked_up: { icon: Package, color: 'text-yellow-600 bg-yellow-100 border-yellow-200', nextAction: 'markInTransit', nextStatus: 'in_transit' },
  in_transit: { icon: Truck, color: 'text-purple-600 bg-purple-100 border-purple-200', nextAction: 'markDelivered', nextStatus: 'delivered' },
};

export default function ActiveDeliveries() {
  const t = useTranslations('courier.dashboard.activeDeliveries');
  const statusT = useTranslations('track.status');
  const updateT = useTranslations('courier.dashboard.statusUpdate');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const { data: deliveries, error, isLoading } = useSWR<Delivery[]>('/api/courier/active-deliveries', fetcher, {
    refreshInterval: 15000, // Refresh every 15 seconds
  });

  const handleUpdateStatus = async (deliveryId: string, newStatus: DeliveryStatus) => {
    setIsUpdating(deliveryId);
    try {
      const res = await fetch('/api/deliveries/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId, status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }
      
      toast.success(updateT('success'));
      // Re-validate both active and available deliveries
      mutate('/api/courier/active-deliveries');
      mutate('/api/courier/available-deliveries');

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUpdating(null);
    }
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
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noJobs.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('noJobs.description')}</p>
        </div>
      );
    }

    return deliveries.map((delivery, index) => {
      const currentStatusDetails = statusDetails[delivery.status];
      if (!currentStatusDetails) return null;

      return (
        <motion.div
          key={delivery._id}
          className="group bg-white hover:bg-gray-50 transition-colors duration-200 rounded-xl p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg text-gray-800">{delivery.trackingId}</p>
                <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${currentStatusDetails.color}`}>
                  <currentStatusDetails.icon className="w-4 h-4" />
                  <span>{statusT(delivery.status)}</span>
                </div>
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
            </div>
            <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
              <p className="text-2xl font-bold sm:mb-2" style={{color: theme?.primary || '#2563EB'}}>
                ${delivery.price.toFixed(2)}
              </p>
              {currentStatusDetails.nextAction && currentStatusDetails.nextStatus && (
                <button 
                  onClick={() => handleUpdateStatus(delivery._id, currentStatusDetails.nextStatus!)}
                  disabled={isUpdating === delivery._id}
                  className="group-hover:bg-blue-600 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: theme?.primary || '#2563EB' }}
                >
                  {isUpdating === delivery._id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {updateT(currentStatusDetails.nextAction)}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )
    });
  };

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-2xl border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
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
