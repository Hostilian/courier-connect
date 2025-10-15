'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Package, MapPin, Clock, CheckCircle, Truck, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLanguageByCode } from '@/lib/languages';

interface DeliveryStatus {
  trackingId: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  senderName: string;
  receiverName: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  urgency: string;
  createdAt: string;
  updatedAt: string;
  courierName?: string;
  courierPhone?: string;
  estimatedDelivery?: string;
}

export default function TrackPage() {
  const t = useTranslations('track');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const [trackingId, setTrackingId] = useState('');
  const [delivery, setDelivery] = useState<DeliveryStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDelivery(null);

    try {
      const response = await fetch(`/api/track/${trackingId}`);
      
      if (response.ok) {
        const data = await response.json();
        setDelivery(data);
      } else {
        setError(t('notFound') || 'Tracking ID not found. Please check and try again.');
      }
    } catch (err) {
      console.error('Track error:', err);
      setError(t('error') || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: {
        label: t('status.pending') || 'Pending',
        description: t('status.pendingDesc') || 'Waiting for a courier to accept',
        icon: Clock,
        color: '#FFA500',
      },
      accepted: {
        label: t('status.accepted') || 'Accepted',
        description: t('status.acceptedDesc') || 'Courier is on the way to pickup',
        icon: CheckCircle,
        color: '#3B82F6',
      },
      picked_up: {
        label: t('status.pickedUp') || 'Picked Up',
        description: t('status.pickedUpDesc') || 'Package collected from sender',
        icon: Package,
        color: '#8B5CF6',
      },
      in_transit: {
        label: t('status.inTransit') || 'In Transit',
        description: t('status.inTransitDesc') || 'On the way to delivery address',
        icon: Truck,
        color: '#3B82F6',
      },
      delivered: {
        label: t('status.delivered') || 'Delivered',
        description: t('status.deliveredDesc') || 'Successfully delivered!',
        icon: CheckCircle,
        color: '#10B981',
      },
      cancelled: {
        label: t('status.cancelled') || 'Cancelled',
        description: t('status.cancelledDesc') || 'Delivery request was cancelled',
        icon: Clock,
        color: '#EF4444',
      },
    };

    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const StatusIcon = delivery ? getStatusInfo(delivery.status).icon : Clock;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">{t('title') || 'Track Your Delivery'}</h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle') || 'Enter your tracking ID to see real-time status updates'}
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleTrack}
          className="mb-12"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder={t('placeholder') || 'Enter tracking ID (e.g., CC-123456)'}
                className="w-full px-4 py-4 pl-12 border-2 rounded-xl focus:ring-2 transition-all text-lg font-mono"
                required
                style={{ borderColor: theme?.primary || '#3B82F6' }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all disabled:opacity-50"
              style={{ backgroundColor: theme?.primary || '#3B82F6' }}
            >
              {loading ? (t('searching') || 'Searching...') : (t('track') || 'Track')}
            </button>
          </div>
        </motion.form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 text-center"
          >
            <p className="text-red-600 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Delivery Info */}
        {delivery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div
                className="p-8 text-white"
                style={{ backgroundColor: getStatusInfo(delivery.status).color }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <StatusIcon className="w-8 h-8" />
                      <h2 className="text-3xl font-bold">{getStatusInfo(delivery.status).label}</h2>
                    </div>
                    <p className="text-white/90">{getStatusInfo(delivery.status).description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80 mb-1">{t('trackingId') || 'Tracking ID'}</p>
                    <p className="text-2xl font-mono font-bold">{delivery.trackingId}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-8 py-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  {['pending', 'accepted', 'picked_up', 'in_transit', 'delivered'].map((s, idx) => {
                    const statuses = ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered'];
                    const currentIndex = statuses.indexOf(delivery.status);
                    const isActive = idx <= currentIndex;
                    
                    return (
                      <div key={s} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                            isActive ? 'text-white' : 'bg-gray-200 text-gray-400'
                          }`}
                          style={isActive ? { backgroundColor: theme?.primary || '#3B82F6' } : {}}
                        >
                          {idx + 1}
                        </div>
                        {idx < 4 && (
                          <div
                            className={`w-20 h-1 mx-2 ${isActive ? '' : 'bg-gray-200'}`}
                            style={isActive ? { backgroundColor: theme?.primary || '#3B82F6' } : {}}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pickup Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                  {t('pickup') || 'Pickup'}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">{t('from') || 'From'}:</span> {delivery.senderName}</p>
                  <p className="text-muted-foreground">{delivery.pickupAddress}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" style={{ color: theme?.secondary || '#FF6B6B' }} />
                  {t('delivery') || 'Delivery'}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">{t('to') || 'To'}:</span> {delivery.receiverName}</p>
                  <p className="text-muted-foreground">{delivery.deliveryAddress}</p>
                </div>
              </div>

              {/* Package Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                  {t('package') || 'Package'}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">{t('type') || 'Type'}:</span> {delivery.packageType}</p>
                  <p><span className="font-medium">{t('urgency') || 'Speed'}:</span> {delivery.urgency}</p>
                </div>
              </div>

              {/* Courier Info */}
              {delivery.courierName && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                    {t('courier') || 'Your Courier'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{t('name') || 'Name'}:</span> {delivery.courierName}</p>
                    {delivery.courierPhone && (
                      <p><span className="font-medium">{t('phone') || 'Phone'}:</span> {delivery.courierPhone}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                {t('timeline') || 'Timeline'}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme?.primary || '#3B82F6' }} />
                  <div>
                    <p className="font-medium">{t('created') || 'Request Created'}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(delivery.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme?.primary || '#3B82F6' }} />
                  <div>
                    <p className="font-medium">{t('lastUpdate') || 'Last Update'}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(delivery.updatedAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>
                {delivery.estimatedDelivery && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 bg-gray-300" />
                    <div>
                      <p className="font-medium">{t('estimated') || 'Estimated Delivery'}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(delivery.estimatedDelivery).toLocaleString(locale)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Text */}
        {!delivery && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-muted-foreground"
          >
            <p className="mb-4">{t('help') || 'Need help? Your tracking ID was sent when you created the request.'}</p>
            <p className="text-sm">{t('format') || 'Format: CC-XXXXXX (e.g., CC-123456)'}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
