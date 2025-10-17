// File: components/ActiveDeliveries.tsx
// You accepted the jobs, now you gotta do 'em. This component is your boss now.
// It's gonna stare at you until you mark these things as 'delivered'. No pressure.

'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Package, Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CourierLocationTracker from './CourierLocationTracker';

// Another interface. It's like a blueprint for a box's sad journey.
interface ActiveDelivery {
  _id: string;
  trackingId: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: 'accepted' | 'picked_up' | 'in_transit';
  price: number;
  urgency: string;
}

// A map to make the status look pretty. Because 'picked_up' is ugly.
const statusDetails = {
  accepted: { text: 'Accepted', icon: CheckCircle, color: 'text-blue-500' },
  picked_up: { text: 'Picked Up', icon: Package, color: 'text-yellow-500' },
  in_transit: { text: 'In Transit', icon: Truck, color: 'text-purple-500' },
};

export default function ActiveDeliveries() {
  const t = useTranslations('courier.dashboard');
  const statusT = useTranslations('track.status');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Go get the deliveries you're supposed to be working on.
  const loadActiveDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('cc_token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/courier/active-deliveries', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch active deliveries');
      
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Could not load active deliveries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveDeliveries();
  }, [loadActiveDeliveries]);

  // The button you click to pretend you're making progress.
  const handleUpdateStatus = async (deliveryId: string, newStatus: string) => {
    setUpdatingId(deliveryId);
    try {
      const token = localStorage.getItem('cc_token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/courier/deliveries/${deliveryId}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const updatedDelivery = await response.json();

      if (newStatus === 'delivered') {
        // If it's delivered, it's no longer active. Remove it from the list.
        setDeliveries(prev => prev.filter(d => d._id !== deliveryId));
      } else {
        // Otherwise, just update its status in the list.
        setDeliveries(prev =>
          prev.map(d => (d._id === deliveryId ? updatedDelivery : d))
        );
      }
      
      toast.success(`Delivery status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Could not update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const isDeliveryActive = (status: string) => {
    return status === 'accepted' || status === 'picked_up' || status === 'in_transit';
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme?.primary }} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('activeDeliveries.title')}</h3>
      {deliveries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t('activeDeliveries.noJobs') || "You have no active deliveries. Go accept one."}</p>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery, index) => {
            const currentStatus = statusDetails[delivery.status];
            const nextStatus = delivery.status === 'accepted' ? 'picked_up' : delivery.status === 'picked_up' ? 'in_transit' : 'delivered';
            
            return (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{delivery.trackingId}</span>
                        <div className={`flex items-center gap-2 text-sm font-medium ${currentStatus.color}`}>
                            <currentStatus.icon className="w-4 h-4" />
                            <span>{statusT(`${delivery.status}`)}</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">{t('activeDeliveries.pickup')}:</span> {delivery.pickupAddress}</p>
                        <p><span className="font-medium">{t('activeDeliveries.delivery')}:</span> {delivery.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 flex flex-col items-end justify-center">
                    <p className="font-bold text-lg text-green-600 mb-2">${delivery.price.toFixed(2)}</p>
                    {nextStatus !== 'delivered' && (
                      <button 
                        onClick={() => handleUpdateStatus(delivery._id, nextStatus)}
                        disabled={updatingId === delivery._id}
                        className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors w-40 flex items-center justify-center"
                        style={{ 
                          backgroundColor: updatingId ? '#D1D5DB' : (theme?.primary || '#3B82F6'),
                          cursor: updatingId ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {updatingId === delivery._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <span>{t('statusUpdate.' + nextStatus) || `Mark as ${nextStatus}`}</span>
                        )}
                      </button>
                    )}
                     {delivery.status === 'in_transit' && (
                        <button 
                            onClick={() => handleUpdateStatus(delivery._id, 'delivered')}
                            disabled={updatingId === delivery._id}
                            className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors w-40 flex items-center justify-center"
                        >
                             {updatingId === delivery._id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span>{t('activeDeliveries.complete')}</span>
                            )}
                        </button>
                     )}
                  </div>
                </div>
                <div className="mt-4">
                  <CourierLocationTracker 
                    trackingId={delivery.trackingId}
                    isDeliveryActive={isDeliveryActive(delivery.status)}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  );
}
