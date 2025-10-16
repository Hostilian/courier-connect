'use client';

import DeliveryMap from '@/components/DeliveryMap';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, MessageSquare, Package, Search, Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface DeliveryStatus {
  trackingId: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  senderName: string;
  senderAddress: string;
  senderPhone?: string;
  senderLocation?: { lat: number; lng: number };
  receiverName: string;
  receiverAddress: string;
  receiverPhone?: string;
  receiverLocation?: { lat: number; lng: number };
  packageType: string;
  packageSize?: string;
  packageDescription?: string;
  urgency: string;
  pickupTime?: string;
  createdAt: string;
  updatedAt: string;
  courierName?: string;
  courierPhone?: string;
  estimatedDelivery?: string;
  notes?: string;
  serviceCity?: string;
  serviceCountry?: string;
  distance?: number;
  distanceText?: string;
  distanceEstimated?: boolean;
  duration?: number;
  durationText?: string;
  routePolyline?: string;
  price?: number;
  courierEarnings?: number;
  platformFee?: number;
  basePrice?: number;
  distancePrice?: number;
  packageSizePrice?: number;
  urgencyPrice?: number;
  scheduledPrice?: number;
  minimumAdjustment?: number;
  minimumPriceApplied?: boolean;
  scheduledPickupDate?: string;
  scheduledDeliveryDate?: string;
}

export default function TrackPage() {
  const t = useTranslations('track');
  const pricingT = useTranslations('pricing');
  const mapsT = useTranslations('maps');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const [trackingId, setTrackingId] = useState('');
  const [delivery, setDelivery] = useState<DeliveryStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || 'en', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }),
    [locale]
  );

  const formatCurrency = (value?: number | null) =>
    currencyFormatter.format(typeof value === 'number' ? value : 0);

  const translatePackageSize = (size?: string | null) => {
    if (!size) return null;
    try {
      return pricingT(`packageSizes.${size}`);
    } catch (error) {
      return size;
    }
  };

  const translateUrgency = (value: string) => {
    try {
      return pricingT(`urgencyLevels.${value}`);
    } catch (error) {
      return value;
    }
  };

  const formatDistanceLabel = (distance?: number) => {
    const value = typeof distance === 'number' ? distance.toFixed(1) : '0';
    try {
      return pricingT('distancePrice', { distance: value });
    } catch (error) {
      return `Distance (${value} km)`;
    }
  };

  const packageSizeFee = delivery?.packageSizePrice ?? 0;
  const scheduledFee = delivery?.scheduledPrice ?? 0;

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

            {/* Map Preview */}
            {delivery.senderLocation?.lat != null &&
              delivery.senderLocation?.lng != null &&
              delivery.receiverLocation?.lat != null &&
              delivery.receiverLocation?.lng != null && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                        {mapsT('title') || 'Route Map'}
                      </h3>
                      {(delivery.distanceText || delivery.durationText) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {[delivery.distanceText, delivery.durationText]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      )}
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {mapsT('route') || 'Route'}
                    </span>
                  </div>
                  <DeliveryMap
                    origin={{
                      lat: delivery.senderLocation.lat,
                      lng: delivery.senderLocation.lng,
                      address: delivery.senderAddress,
                    }}
                    destination={{
                      lat: delivery.receiverLocation.lat,
                      lng: delivery.receiverLocation.lng,
                      address: delivery.receiverAddress,
                    }}
                    showRoute
                    height="360px"
                    className="h-full"
                  />
                  {delivery.distanceEstimated && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-muted-foreground">
                        {mapsT('estimatedNotice') || 'Distance shown is approximate based on current traffic.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Pickup Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                  {t('pickup') || 'Pickup'}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">{t('from') || 'From'}:</span> {delivery.senderName}</p>
                  <p className="text-muted-foreground">{delivery.senderAddress}</p>
                  {delivery.senderPhone && (
                    <p className="text-muted-foreground">{delivery.senderPhone}</p>
                  )}
                  {delivery.serviceCity && (
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {delivery.serviceCity}
                      {delivery.serviceCountry ? `, ${delivery.serviceCountry}` : ''}
                    </p>
                  )}
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
                  <p className="text-muted-foreground">{delivery.receiverAddress}</p>
                  {delivery.receiverPhone && (
                    <p className="text-muted-foreground">{delivery.receiverPhone}</p>
                  )}
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
                  {delivery.packageSize && (
                    <p>
                      <span className="font-medium">{t('size') || 'Size'}:</span> {translatePackageSize(delivery.packageSize)}
                    </p>
                  )}
                  {delivery.packageDescription && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">{t('description') || 'Description'}:</span> {delivery.packageDescription}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">{t('urgency') || 'Speed'}:</span> {translateUrgency(delivery.urgency)}
                  </p>
                  {delivery.pickupTime && (
                    <p className="text-muted-foreground">
                      {t('pickupTime') || 'Pickup Time'}: {delivery.pickupTime}
                    </p>
                  )}
                  {delivery.scheduledPickupDate && (
                    <p className="text-muted-foreground">
                      {t('scheduledPickup') || 'Scheduled Pickup'}: {new Date(delivery.scheduledPickupDate).toLocaleString(locale)}
                    </p>
                  )}
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
                    <p><span className="font-medium">{pricingT('courierEarnings') || 'Courier Earnings'}:</span> {formatCurrency(delivery.courierEarnings)}</p>
                  </div>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">
                  {pricingT('breakdown') || 'Price Breakdown'}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">{pricingT('total') || 'Total'}:</span> {formatCurrency(delivery.price)}</p>
                  <p><span className="font-medium">{pricingT('courierEarnings') || 'Courier Earnings'}:</span> {formatCurrency(delivery.courierEarnings)}</p>
                  <p><span className="font-medium">{pricingT('platformFee') || 'Platform Fee'}:</span> {formatCurrency(delivery.platformFee)}</p>
                  <hr className="my-3" />
                  <p><span className="font-medium">{pricingT('basePrice') || 'Base Price'}:</span> {formatCurrency(delivery.basePrice)}</p>
                  <p>
                    <span className="font-medium">{formatDistanceLabel(delivery.distance)}:</span> {formatCurrency(delivery.distancePrice)}
                  </p>
                  <p><span className="font-medium">{pricingT('urgencyPrice') || 'Urgency Fee'}:</span> {formatCurrency(delivery.urgencyPrice)}</p>
                  {packageSizeFee > 0 && (
                    <p><span className="font-medium">{pricingT('packageSizePrice') || 'Package Size Fee'}:</span> {formatCurrency(delivery.packageSizePrice)}</p>
                  )}
                  {scheduledFee > 0 && (
                    <p><span className="font-medium">{pricingT('scheduledDiscount') || 'Scheduling'}:</span> {formatCurrency(delivery.scheduledPrice)}</p>
                  )}
                  {delivery.minimumPriceApplied && (
                    <p className="text-xs text-amber-600">
                      {pricingT('fairPricing') || 'Fair pricing: 70% goes to your courier'}
                    </p>
                  )}
                </div>
              </div>

              {/* Route Summary */}
              {(delivery.distanceText || delivery.durationText) && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                    {mapsT('route') || 'Route'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {delivery.distanceText && (
                      <p><span className="font-medium">{mapsT('distance') || 'Distance'}:</span> {delivery.distanceText}</p>
                    )}
                    {delivery.durationText && (
                      <p><span className="font-medium">{mapsT('duration') || 'Estimated Time'}:</span> {delivery.durationText}</p>
                    )}
                    {delivery.distanceEstimated && (
                      <p className="text-xs text-muted-foreground">
                        {mapsT('estimatedNotice') || 'Distance shown is approximate based on current traffic.'}
                      </p>
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

            {/* Notes */}
            {delivery.notes && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                  {t('notes') || 'Notes'}
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{delivery.notes}</p>
              </div>
            )}
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
