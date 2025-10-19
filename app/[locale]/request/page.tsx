'use client';

import DeliveryMap from '@/components/DeliveryMap';
import { useLocationContext } from '@/components/LocationProvider';
import LocationSelector from '@/components/LocationSelector';
import { getCountryByCode } from '@/lib/countries';
import { getLanguageByCode } from '@/lib/languages';
import { loadGoogleMaps } from '@/lib/maps';
import type { PricingBreakdown } from '@/lib/pricing';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, DollarSign, MapPin, Package, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type Coordinates = {
  lat: number;
  lng: number;
};

interface RouteDetails {
  distance: number;
  duration: number;
  distanceText?: string;
  durationText?: string;
  estimated?: boolean;
  polyline?: string;
}

export default function RequestPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const { location } = useLocationContext();
  const country = location.countryCode ? getCountryByCode(location.countryCode) : undefined;
  
  const bannerTitle = country?.name || t('request.banner.globalTitle');
  const bannerMessage = location.city
    ? t('request.banner.city', { city: location.city })
    : country
    ? t('request.banner.country', { country: country.name })
    : t('request.banner.global');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Sender info
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    
    // Receiver info
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    
    // Package info
    packageType: 'envelope',
    packageSize: 'small',
    packageDescription: '',
    
    // Delivery info
    urgency: 'standard',
    pickupTime: 'asap',
    scheduledPickupDate: '',
    scheduledPickupTime: '',
    scheduledDeliveryDate: '',
    scheduledDeliveryTime: '',
    notes: '',
  });
  const [routeInfo, setRouteInfo] = useState<RouteDetails | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<PricingBreakdown | null>(null);
  const [originCoords, setOriginCoords] = useState<Coordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coordinates | null>(null);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [deliveryId, setDeliveryId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const pickupRef = useRef<HTMLTextAreaElement | null>(null);
  const dropoffRef = useRef<HTMLTextAreaElement | null>(null);

  const geocodeAddress = useCallback(async (address: string): Promise<Coordinates | null> => {
    if (!address.trim()) return null;
    try {
      const google = await loadGoogleMaps();
      return await new Promise<Coordinates | null>((resolve) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]?.geometry?.location) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Geocode error:', error);
      return null;
    }
  }, []);

  // Setup Google Places Autocomplete
  useEffect(() => {
    let cleanup = () => {};
    loadGoogleMaps().then((g) => {
      const options: google.maps.places.AutocompleteOptions = {
        fields: ['formatted_address', 'geometry'],
        types: ['geocode'],
      };
      if (pickupRef.current) {
        const ac1 = new g.maps.places.Autocomplete(pickupRef.current as any, options);
        ac1.addListener('place_changed', () => {
          const p = ac1.getPlace();
          if (p.formatted_address) handleChange('senderAddress', p.formatted_address);
          if (p.geometry?.location) {
            const loc = p.geometry.location;
            setOriginCoords({ lat: loc.lat(), lng: loc.lng() });
          }
        });
        cleanup = () => g.maps.event.clearInstanceListeners(ac1);
      }
      if (dropoffRef.current) {
        const ac2 = new g.maps.places.Autocomplete(dropoffRef.current as any, options);
        ac2.addListener('place_changed', () => {
          const p = ac2.getPlace();
          if (p.formatted_address) handleChange('receiverAddress', p.formatted_address);
          if (p.geometry?.location) {
            const loc = p.geometry.location;
            setDestinationCoords({ lat: loc.lat(), lng: loc.lng() });
          }
        });
        const prev = cleanup;
        cleanup = () => {
          prev();
          g.maps.event.clearInstanceListeners(ac2);
        };
      }
    }).catch(() => {});
    return () => cleanup();
  }, []);

  // Calculate distance and price when inputs change
  useEffect(() => {
    let cancelled = false;

    const debounce = setTimeout(async () => {
      const pickupAddress = formData.senderAddress.trim();
      const deliveryAddress = formData.receiverAddress.trim();

      if (!pickupAddress || !deliveryAddress) {
        if (!cancelled) {
          setRouteInfo(null);
          setPriceBreakdown(null);
          setDistanceError(null);
          setCalculatingPrice(false);
        }
        return;
      }

      setCalculatingPrice(true);
      setDistanceError(null);

      try {
        let origin = originCoords;
        if (!origin) {
          const geocoded = await geocodeAddress(pickupAddress);
          if (!geocoded) {
            throw new Error('Failed to resolve pickup location');
          }
          origin = geocoded;
          if (!cancelled) {
            setOriginCoords(geocoded);
          }
        }

        let destination = destinationCoords;
        if (!destination) {
          const geocoded = await geocodeAddress(deliveryAddress);
          if (!geocoded) {
            throw new Error('Failed to resolve delivery location');
          }
          destination = geocoded;
          if (!cancelled) {
            setDestinationCoords(geocoded);
          }
        }

        if (!origin || !destination || cancelled) {
          return;
        }

        const distanceRes = await fetch('/api/maps/distance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin, destination }),
        });

        if (!distanceRes.ok) {
          throw new Error('Distance service returned an error');
        }

        const distanceData = await distanceRes.json();
        if (cancelled) return;

        setRouteInfo({
          distance: distanceData.distance,
          duration: distanceData.duration,
          distanceText: distanceData.distanceText,
          durationText: distanceData.durationText,
          estimated: distanceData.estimated,
          polyline: distanceData.polyline,
        });

        const scheduledPickup =
          formData.urgency === 'scheduled' && formData.scheduledPickupDate
            ? new Date(`${formData.scheduledPickupDate}T${formData.scheduledPickupTime || '12:00'}`)
            : undefined;

        const priceRes = await fetch('/api/pricing/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            distance: distanceData.distance,
            urgency: formData.urgency,
            packageSize: formData.packageSize,
            scheduledPickupDate: scheduledPickup?.toISOString(),
          }),
        });

        if (!priceRes.ok) {
          throw new Error('Pricing service returned an error');
        }

        const priceData = await priceRes.json();
        if (!priceData?.pricing) {
          throw new Error('Pricing response missing breakdown');
        }

        if (!cancelled) {
          setPriceBreakdown(priceData.pricing as PricingBreakdown);
        }
      } catch (error) {
        console.error('Error calculating distance/price:', error);
        if (!cancelled) {
          setRouteInfo(null);
          setPriceBreakdown(null);
          setDistanceError('Unable to calculate distance. Please check the addresses.');
        }
      } finally {
        if (!cancelled) {
          setCalculatingPrice(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [
    formData.senderAddress,
    formData.receiverAddress,
    formData.urgency,
    formData.packageSize,
    formData.scheduledPickupDate,
    formData.scheduledPickupTime,
    originCoords,
    destinationCoords,
    geocodeAddress,
  ]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'senderAddress') {
      setOriginCoords(null);
    } else if (field === 'receiverAddress') {
      setDestinationCoords(null);
    }
  };

  const scheduledDiscount = priceBreakdown && priceBreakdown.scheduledPrice < 0
    ? Math.abs(priceBreakdown.scheduledPrice)
    : 0;

  const rawSubtotal = priceBreakdown
    ? priceBreakdown.basePrice +
      priceBreakdown.distancePrice +
      priceBreakdown.packageSizePrice +
      priceBreakdown.urgencyPrice +
      priceBreakdown.scheduledPrice
    : 0;

  const minimumAdjustment = priceBreakdown
    ? Number((priceBreakdown.totalPrice - rawSubtotal).toFixed(2))
    : 0;

  const hasMinimumAdjustment = minimumAdjustment > 0.009;

  const distanceLabel = routeInfo
    ? routeInfo.distanceText || `${routeInfo.distance.toFixed(1)} km`
    : null;

  const durationLabel = routeInfo
    ? routeInfo.durationText || `${routeInfo.duration} min`
    : null;

  const handlePayment = async () => {
    if (!deliveryId) return;
    setPaymentLoading(true);
    try {
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        }
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment error. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originCoords || !destinationCoords) {
      alert(t('maps.errors.invalidAddress'));
      return;
    }

    if (!routeInfo) {
      alert(t('maps.errors.noRoute'));
      return;
    }

    if (!priceBreakdown) {
      alert(t('pricing.estimate'));
      return;
    }

    setLoading(true);

    try {
      const pricingMetadata = {
        ...priceBreakdown,
        rawSubtotal: Number(rawSubtotal.toFixed(2)),
        scheduledDiscount,
        minimumAdjustment: hasMinimumAdjustment ? Number(minimumAdjustment.toFixed(2)) : 0,
      };

      const payload = {
        ...formData,
        locale,
        serviceCountry: location.countryCode,
        serviceCity: location.city,
        senderLocation: originCoords,
        receiverLocation: destinationCoords,
        distance: routeInfo.distance,
        duration: routeInfo.duration,
        routeDetails: {
          distance: Number(routeInfo.distance.toFixed(2)),
          duration: Number(routeInfo.duration.toFixed(1)),
          distanceText: routeInfo.distanceText,
          durationText: routeInfo.durationText,
          estimated: Boolean(routeInfo.estimated),
          polyline: routeInfo.polyline,
        },
        routePolyline: routeInfo.polyline,
        price: priceBreakdown.totalPrice,
        courierEarnings: priceBreakdown.courierEarnings,
        platformFee: priceBreakdown.platformFee,
        basePrice: priceBreakdown.basePrice,
        distancePrice: priceBreakdown.distancePrice,
        urgencyPrice: priceBreakdown.urgencyPrice,
        scheduledPrice: priceBreakdown.scheduledPrice,
        pricingBreakdown: pricingMetadata,
      };

      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveryId(data.deliveryId || '');
        setTrackingId(data.trackingId);
        setStep(4);
      } else {
        alert(t('request.error'));
      }
    } catch (error) {
      console.error('Request error:', error);
      alert(t('request.error'));
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (step === 4 && trackingId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${theme?.gradient || 'from-green-400 to-blue-500'} flex items-center justify-center`}
          >
            <Package className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold mb-2">{t('request.success.title')}</h2>
          <p className="text-gray-600 mb-6">{t('request.success.description')}</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-500 mb-2">{t('request.trackingId')}</p>
            <p className="text-3xl font-mono font-bold" style={{ color: theme?.primary || '#3B82F6' }}>
              {trackingId}
            </p>
          </div>

          {priceBreakdown && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{t('pricing.courierWillReceive')}</span>
                <span className="text-xl font-bold text-green-600">
                  ${priceBreakdown.courierEarnings.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('pricing.youPay')}</span>
                <span className="text-2xl font-bold">${priceBreakdown.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-6">{t('request.success.save')}</p>

          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handlePayment}
              disabled={paymentLoading || !deliveryId}
              className="w-full px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 bg-green-600 text-white hover:bg-green-700"
            >
              {paymentLoading ? t('common.loading') : '💳 Pay Now'}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/${locale}/track`)}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all text-white"
              style={{ backgroundColor: theme?.primary || '#3B82F6' }}
            >
              {t('request.trackButton')}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              {t('request.newRequest')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Location Banner */}
        {(country || !location.countryCode) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country?.flag ?? '🌍'}</span>
                <div>
                  <p className="text-base font-semibold text-gray-900">{bannerTitle}</p>
                  <p>{bannerMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{t('request.banner.change')}</span>
                <LocationSelector />
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{t('request.title')}</h1>
          <p className="text-lg text-gray-600">{t('request.subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s ? `text-white` : 'bg-gray-200 text-gray-400'
                    }`}
                    style={step >= s ? { backgroundColor: theme?.primary || '#3B82F6' } : {}}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-20 h-1 mx-2 rounded ${step > s ? '' : 'bg-gray-200'}`}
                      style={step > s ? { backgroundColor: theme?.primary || '#3B82F6' } : {}}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Pickup Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6" style={{ color: theme?.primary || '#3B82F6' }} />
                    {t('request.step1.title')}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.senderName')}</label>
                      <input
                        type="text"
                        required
                        value={formData.senderName}
                        onChange={(e) => handleChange('senderName', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder={t('request.senderNamePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.senderPhone')}</label>
                      <input
                        type="tel"
                        required
                        value={formData.senderPhone}
                        onChange={(e) => handleChange('senderPhone', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder="+420 123 456 789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.pickupAddress')}</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.senderAddress}
                        onChange={(e) => handleChange('senderAddress', e.target.value)}
                        ref={pickupRef}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder={t('request.addressPlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.pickupTime')}</label>
                      <select
                        value={formData.pickupTime}
                        onChange={(e) => handleChange('pickupTime', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                      >
                        <option value="asap">{t('request.asap')}</option>
                        <option value="today">{t('request.today')}</option>
                        <option value="tomorrow">{t('request.tomorrow')}</option>
                        <option value="scheduled">{t('request.scheduled')}</option>
                      </select>
                    </div>

                    {/* Scheduling Fields */}
                    {formData.pickupTime === 'scheduled' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 p-4 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <Calendar className="w-4 h-4" />
                          <span>{t('scheduling.advanceBooking')}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">{t('scheduling.pickupDate')}</label>
                            <input
                              type="date"
                              value={formData.scheduledPickupDate}
                              onChange={(e) => handleChange('scheduledPickupDate', e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">{t('scheduling.pickupTime')}</label>
                            <input
                              type="time"
                              value={formData.scheduledPickupTime}
                              onChange={(e) => handleChange('scheduledPickupTime', e.target.value)}
                              className="w-full px-4 py-2 border rounded-lg"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full mt-8 px-6 py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    style={{ backgroundColor: theme?.primary || '#3B82F6' }}
                  >
                    {t('request.next')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Delivery Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" style={{ color: theme?.primary || '#3B82F6' }} />
                    {t('request.step2.title')}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.receiverName')}</label>
                      <input
                        type="text"
                        required
                        value={formData.receiverName}
                        onChange={(e) => handleChange('receiverName', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder={t('request.receiverNamePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.receiverPhone')}</label>
                      <input
                        type="tel"
                        required
                        value={formData.receiverPhone}
                        onChange={(e) => handleChange('receiverPhone', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder="+420 987 654 321"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.deliveryAddress')}</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.receiverAddress}
                        onChange={(e) => handleChange('receiverAddress', e.target.value)}
                        ref={dropoffRef}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder={t('request.addressPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Map - Route Preview */}
                  {originCoords && destinationCoords && (
                    <div className="mt-6 space-y-4">
                      <DeliveryMap
                        origin={{ ...originCoords, address: formData.senderAddress }}
                        destination={{ ...destinationCoords, address: formData.receiverAddress }}
                        height="300px"
                      />

                      {routeInfo && (
                        <div className="p-4 bg-gray-50 rounded-lg text-sm flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span className="font-medium">{t('maps.distance')}</span>
                            </div>
                            <span className="font-bold">{distanceLabel}</span>
                          </div>
                          {durationLabel && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="font-medium">{t('maps.duration')}</span>
                              </div>
                              <span className="font-bold">{durationLabel}</span>
                            </div>
                          )}
                          {routeInfo.estimated && (
                            <p className="text-xs text-gray-500">{t('maps.estimatedNotice')}</p>
                          )}
                        </div>
                      )}

                      {distanceError && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                          {distanceError}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-4 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 transition-all"
                    >
                      {t('request.back')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 px-6 py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                      style={{ backgroundColor: theme?.primary || '#3B82F6' }}
                    >
                      {t('request.next')}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Package Details */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="w-6 h-6" style={{ color: theme?.primary || '#3B82F6' }} />
                    {t('request.step3.title')}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.packageType')}</label>
                      <select
                        value={formData.packageType}
                        onChange={(e) => handleChange('packageType', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                      >
                        <option value="envelope">{t('request.envelope')}</option>
                        <option value="gift">{t('request.gift')}</option>
                        <option value="marketplace">{t('request.marketplace')}</option>
                        <option value="food">{t('request.food')}</option>
                        <option value="other">{t('request.other')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.packageSize')}</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleChange('packageSize', size)}
                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                              formData.packageSize === size
                                ? 'border-current text-white'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={
                              formData.packageSize === size ? { backgroundColor: theme?.primary || '#3B82F6' } : {}
                            }
                          >
                            {t(`request.${size}`)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.packageDescription')}</label>
                      <textarea
                        rows={3}
                        value={formData.packageDescription}
                        onChange={(e) => handleChange('packageDescription', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder={t('request.descriptionPlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.urgency')}</label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => handleChange('urgency', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                      >
                        <option value="standard">{t('request.standard')}</option>
                        <option value="express">{t('request.express')}</option>
                        <option value="urgent">{t('request.urgent')}</option>
                        <option value="scheduled">{t('request.scheduledOption')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('request.notes')}</label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                        placeholder={t('request.notesPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 px-6 py-4 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 transition-all"
                    >
                      {t('request.back')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || calculatingPrice || !priceBreakdown}
                      className="flex-1 px-6 py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                      style={{ backgroundColor: theme?.primary || '#3B82F6' }}
                    >
                      {loading ? t('request.submitting') : t('request.submit')}
                      {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" style={{ color: theme?.primary || '#3B82F6' }} />
                  {t('pricing.title')}
                </h3>

                {calculatingPrice ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-3 text-gray-600">{t('pricing.calculating')}</span>
                  </div>
                ) : priceBreakdown ? (
                  <div className="space-y-4">
                    {/* Distance & Time */}
                    {routeInfo && (
                      <div className="pb-3 border-b">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{distanceLabel}</span>
                          </div>
                          {durationLabel && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{durationLabel}</span>
                            </div>
                          )}
                        </div>
                        {routeInfo.estimated && (
                          <p className="mt-2 text-xs text-gray-500">{t('maps.estimatedNotice')}</p>
                        )}
                      </div>
                    )}

                    {distanceError && (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                        {distanceError}
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('pricing.basePrice')}</span>
                        <span className="font-medium">${priceBreakdown.basePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t('pricing.distancePrice', { distance: distanceLabel ?? '0 km' })}
                        </span>
                        <span className="font-medium">${priceBreakdown.distancePrice.toFixed(2)}</span>
                      </div>
                      {priceBreakdown.packageSizePrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('pricing.packageSizePrice')}</span>
                          <span className="font-medium">${priceBreakdown.packageSizePrice.toFixed(2)}</span>
                        </div>
                      )}
                      {priceBreakdown.urgencyPrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('pricing.urgencyPrice')}</span>
                          <span className="font-medium">${priceBreakdown.urgencyPrice.toFixed(2)}</span>
                        </div>
                      )}
                      {scheduledDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>{t('pricing.scheduledDiscount')}</span>
                          <span className="font-medium">-${scheduledDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {hasMinimumAdjustment && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('pricing.minimumAdjustment')}</span>
                          <span className="font-medium">+${minimumAdjustment.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{t('pricing.platformFee')}</span>
                        <span>${priceBreakdown.platformFee.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>{t('pricing.total')}</span>
                        <span style={{ color: theme?.primary || '#3B82F6' }}>
                          ${priceBreakdown.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Courier Earnings Highlight */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">{t('pricing.courierEarnings')}</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${priceBreakdown.courierEarnings.toFixed(2)}
                      </div>
                      <p className="text-xs text-green-700 mt-1">{t('pricing.fairPricing')}</p>
                    </div>

                    {/* Savings Notice */}
                    {formData.urgency === 'scheduled' && scheduledDiscount > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                        {t('pricing.savingsNotice')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{t('pricing.estimate')}</p>
                    <p className="text-xs mt-2">Enter pickup and delivery addresses to see pricing</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
