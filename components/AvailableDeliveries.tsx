'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Loader2, MapPin, Package } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface Delivery {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: number;
  price: number;
  urgency: string;
  createdAt: string;
}

// I'm not a fan of repeating myself. It's like telling the same joke twice.
// So, this function handles the API call. Dry. The way code should be.
const callApi = async (url: string, method: string, token: string, body?: any) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  // Some successful responses might not have a body, like a 204 No Content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return {};
};


export default function AvailableDeliveries() {
  const t = useTranslations('courier.dashboard.availableJobs');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('cc_token');
      if (!token) throw new Error('Not authenticated');
      const data = await callApi('/api/courier/available-deliveries', 'GET', token);
      setDeliveries(data);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to load deliveries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const handleAccept = async (deliveryId: string) => {
    setAcceptingId(deliveryId);
    try {
      const token = localStorage.getItem('cc_token');
      if (!token) throw new Error('Not authenticated');
      
      await callApi(`/api/courier/deliveries/${deliveryId}/accept`, 'POST', token);

      toast.success('Delivery accepted!');
      // Refresh the list to show it's gone
      setDeliveries(prev => prev.filter(d => d._id !== deliveryId));
    } catch (error) {
      console.error('Failed to accept delivery:', error);
      toast.error(error instanceof Error ? error.message : 'Could not accept delivery.');
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      {deliveries.length === 0 ? (
        <p className="text-gray-500 text-center py-4">{t('noDeliveries')}</p>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery, index) => (
            <motion.div
              key={delivery._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{delivery.pickupAddress} ➔ {delivery.deliveryAddress}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>{delivery.distance.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="capitalize">{delivery.urgency}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">${delivery.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                  <button 
                    onClick={() => handleAccept(delivery._id)}
                    disabled={!!acceptingId}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors w-28 flex items-center justify-center"
                    style={{ 
                      backgroundColor: acceptingId ? '#D1D5DB' : (theme?.primary || '#3B82F6'),
                      cursor: acceptingId ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {acceptingId === delivery._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      t('accept')
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
