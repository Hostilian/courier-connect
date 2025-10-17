'use client';

import FeedbackForm from '@/components/FeedbackForm';
import LiveTrackingMap from '@/components/LiveTrackingMap';
import TrackingTimeline from '@/components/TrackingTimeline';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { Loader2, Search, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

// This is what a delivery looks like from the outside.
// No secrets here. Just the facts, ma'am.
interface PublicDeliveryInfo {
  id: string;
  trackingId: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  senderAddress: string;
  receiverAddress: string;
  packageType: string;
  packageSize?: string;
  urgency: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  courierName?: string;
  courierId?: string;
  courierRating?: number;
  estimatedDelivery?: string;
  senderEmail?: string;
  senderLocation?: { lat: number; lng: number };
  receiverLocation?: { lat: number; lng: number };
  routePolyline?: string;
}

// A little helper to show a loading spinner while the page is thinking.
// It's better than a blank screen. Marginally.
function SearchParamHandler({ setTrackingId, handleTrack }: { setTrackingId: (id: string) => void; handleTrack: (id: string) => void; }) {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useState(() => {
        if (id) {
            setTrackingId(id);
            handleTrack(id);
        }
    });

    return null;
}

export default function TrackPage() {
  const t = useTranslations('track');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const [trackingId, setTrackingId] = useState('');
  const [delivery, setDelivery] = useState<PublicDeliveryInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // This function is the main event. It goes and gets the delivery info.
  const handleTrack = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setDelivery(null);

    try {
      const response = await fetch(`/api/track/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setDelivery(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('notFound.message'));
      }
    } catch (err) {
      console.error('Track error:', err);
      setError(t('notFound.message'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(trackingId);
  };

  // Memoization. Because re-calculating things is for suckers.
  const statusInfo = useMemo(() => {
    if (!delivery) return null;
    const details = {
      pending: { label: t('status.pending'), desc: t('status.pendingDesc') },
      accepted: { label: t('status.accepted'), desc: t('status.acceptedDesc') },
      picked_up: { label: t('status.pickedUp'), desc: t('status.pickedUpDesc') },
      in_transit: { label: t('status.inTransit'), desc: t('status.inTransitDesc') },
      delivered: { label: t('status.delivered'), desc: t('status.deliveredDesc') },
      cancelled: { label: t('status.cancelled'), desc: t('status.cancelledDesc') },
    };
    return details[delivery.status] || details.pending;
  }, [delivery, t]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <SearchParamHandler setTrackingId={setTrackingId} handleTrack={handleTrack} />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{t('title')}</h1>
            <p className="text-lg text-gray-600">{t('subtitle')}</p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mb-12"
          >
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder={t('placeholder')}
                  className="w-full px-5 py-4 pl-12 border-2 rounded-lg focus:ring-2 transition-all text-lg font-mono"
                  required
                  style={{ borderColor: theme?.primary, outlineColor: theme?.primary }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
                style={{ backgroundColor: theme?.primary }}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('track')}
              </button>
            </div>
          </motion.form>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-8"
              role="alert"
            >
              <strong className="font-bold">{t('notFound.title')}!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </motion.div>
          )}

          {/* Live Map */}
          {delivery && delivery.status !== 'pending' && delivery.status !== 'delivered' && delivery.status !== 'cancelled' && delivery.senderLocation && delivery.receiverLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <LiveTrackingMap 
                trackingId={delivery.trackingId}
                origin={delivery.senderLocation}
                destination={delivery.receiverLocation}
                routePolyline={delivery.routePolyline}
              />
            </motion.div>
          )}

          {/* Delivery Info */}
          {delivery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Main Status Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-gray-500">{t('trackingId')}</p>
                        <p className="text-2xl font-bold font-mono text-gray-800">{delivery.trackingId}</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-500">{t('status.title') || 'Status'}</p>
                        <p className="text-2xl font-bold" style={{color: theme?.primary}}>{statusInfo?.label}</p>
                    </div>
                </div>
                <p className="mt-2 text-gray-600">{statusInfo?.desc}</p>
              </div>

              {/* Timeline and Details Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <TrackingTimeline 
                        currentStatus={delivery.status}
                        createdAt={delivery.createdAt}
                        updatedAt={delivery.updatedAt}
                        deliveredAt={delivery.deliveredAt}
                    />
                </div>
                
                <div className="space-y-6">
                    {/* Courier Info */}
                    {delivery.courierName && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="font-semibold text-lg mb-2">{t('courier')}</h3>
                            <p className="text-gray-700">{delivery.courierName}</p>
                            {delivery.courierRating && (
                                <div className="flex items-center mt-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 ml-1">{delivery.courierRating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Package Info */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-semibold text-lg mb-2">{t('package')}</h3>
                        <p className="text-sm text-gray-600"><span className="font-medium">{t('type')}:</span> {delivery.packageType}</p>
                        {delivery.packageSize && <p className="text-sm text-gray-600"><span className="font-medium">{t('size')}:</span> {delivery.packageSize}</p>}
                        <p className="text-sm text-gray-600"><span className="font-medium">{t('urgency')}:</span> {delivery.urgency}</p>
                    </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          {!delivery && !error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-500 mt-8"
            >
              <p>{t('help')}</p>
              <p className="text-sm font-mono mt-1">{t('format')}</p>
            </motion.div>
          )}

          {/* Rating Form for Completed Deliveries */}
          {delivery && delivery.status === 'delivered' && delivery.courierName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">{t('rateDelivery')}</h2>
              <FeedbackForm 
                deliveryId={delivery.id} 
                trackingId={delivery.trackingId}
                courierId={delivery.courierId}
                customerEmail={delivery.senderEmail}
              />
            </motion.div>
          )}
        </div>
      </div>
    </Suspense>
  );
}