'use client';

import DeliveryMap from '@/components/DeliveryMap';
import { useLocationContext } from '@/components/LocationProvider';
import SchedulePicker from '@/components/SchedulePicker';
import { loadGoogleMaps } from '@/lib/maps';
import type { PricingBreakdown } from '@/lib/pricing';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    DollarSign,
    Info,
    Loader2,
    MapPin,
    Package,
    User
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

interface DeliveryRequestFormProps {
  onSuccess?: (payload: { trackingId: string; pricing?: PricingBreakdown | null }) => void;
}

export default function DeliveryRequestForm({ onSuccess }: DeliveryRequestFormProps) {
  const t = useTranslations();
  const requestT = useTranslations('request');
  const pricingT = useTranslations('pricing');
  const mapsT = useTranslations('maps');
  const schedulingT = useTranslations('scheduling');
  const locale = useLocale();
  const { location } = useLocationContext();

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
    notes: '',
    pickupDateTime: null as Date | null,
    deliveryDateTime: null as Date | null,
  });

  const [routeInfo, setRouteInfo] = useState<RouteDetails | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<PricingBreakdown | null>(null);
  const [originCoords, setOriginCoords] = useState<Coordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coordinates | null>(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const pickupRef = useRef<HTMLTextAreaElement | null>(null);
  const dropoffRef = useRef<HTMLTextAreaElement | null>(null);

  const currencyFormatter = useMemo(() => new Intl.NumberFormat(locale || 'en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }), [locale]);

  const formatCurrency = (value?: number) => currencyFormatter.format(value ?? 0);

  // Geocode address to coordinates
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

  // Calculate route and price when addresses change
  useEffect(() => {
    const calculateRouteAndPrice = async () => {
      if (!formData.senderAddress || !formData.receiverAddress) {
        setRouteInfo(null);
        setPriceBreakdown(null);
        return;
      }

      setCalculatingPrice(true);
      setError(null);

      try {
        // Geocode addresses
        const origin = await geocodeAddress(formData.senderAddress);
        const destination = await geocodeAddress(formData.receiverAddress);

        if (!origin || !destination) {
          setError(requestT('error'));
          setCalculatingPrice(false);
          return;
        }

        setOriginCoords(origin);
        setDestinationCoords(destination);

        // Calculate route and price via API
        const response = await fetch('/api/deliveries/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin,
            destination,
            urgency: formData.urgency,
            packageSize: formData.packageSize,
            pickupDateTime: formData.pickupDateTime,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setRouteInfo(data.route);
          setPriceBreakdown(data.pricing);
        } else {
          setError(requestT('error'));
        }
      } catch (err) {
  setError(requestT('error'));
      } finally {
        setCalculatingPrice(false);
      }
    };

    const debounceTimer = setTimeout(calculateRouteAndPrice, 800);
    return () => clearTimeout(debounceTimer);
  }, [
    formData.senderAddress,
    formData.receiverAddress,
    formData.urgency,
    formData.packageSize,
    formData.pickupDateTime,
    geocodeAddress,
    requestT,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchedulePickup = (date: Date | null) => {
    setFormData(prev => ({ ...prev, pickupDateTime: date }));
  };

  const handleScheduleDelivery = (date: Date | null) => {
    setFormData(prev => ({ ...prev, deliveryDateTime: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        senderLocation: originCoords,
        receiverLocation: destinationCoords,
        distance: routeInfo?.distance,
        duration: routeInfo?.duration,
        routePolyline: routeInfo?.polyline,
        distanceText: routeInfo?.distanceText,
        durationText: routeInfo?.durationText,
        distanceEstimated: routeInfo?.estimated,
        price: priceBreakdown?.totalPrice,
        courierEarnings: priceBreakdown?.courierEarnings,
        platformFee: priceBreakdown?.platformFee,
        basePrice: priceBreakdown?.basePrice,
        distancePrice: priceBreakdown?.distancePrice,
        urgencyPrice: priceBreakdown?.urgencyPrice,
        scheduledDiscount: priceBreakdown?.scheduledDiscount,
        packageSizePrice: priceBreakdown?.packageSizePrice,
        locale,
        serviceCountry: location.countryCode,
        serviceCity: location.city,
      };

      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (onSuccess) {
          onSuccess(data.trackingId);
        }
      } else {
  const errorData = await response.json();
  setError(errorData.error || requestT('error'));
      }
    } catch (err) {
  setError(requestT('error'));
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = formData.senderName && formData.senderPhone && formData.senderAddress;
  const canProceedToStep3 = canProceedToStep2 && formData.receiverName && formData.receiverPhone && formData.receiverAddress;
  const canSubmit = canProceedToStep3 && formData.packageType && formData.packageSize && priceBreakdown;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">{requestT('step1.title')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {requestT('senderName')} *
                </label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {requestT('senderPhone')} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    placeholder={requestT('sender.phonePlaceholder')}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {requestT('pickupAddress')} *
                </label>
                <textarea
                  ref={pickupRef}
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={requestT('addressPlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {requestT('next')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">{requestT('step2.title')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {requestT('receiverName')} *
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {requestT('receiverPhone')} *
                </label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {requestT('deliveryAddress')} *
                </label>
                <textarea
                  ref={dropoffRef}
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={requestT('addressPlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                {requestT('back')}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canProceedToStep3}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {requestT('next')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{requestT('step3.title')}</h2>
              </div>

              <div className="space-y-4">
                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {requestT('packageType')}
                  </label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="envelope">{requestT('envelope')}</option>
                    <option value="gift">{requestT('gift')}</option>
                    <option value="marketplace">{requestT('marketplace')}</option>
                    <option value="food">{requestT('food')}</option>
                    <option value="other">{requestT('other')}</option>
                  </select>
                </div>

                {/* Package Size */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {requestT('packageSize')}
                  </label>
                  <select
                    name="packageSize"
                    value={formData.packageSize}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="small">{pricingT('packageSizes.small')}</option>
                    <option value="medium">{pricingT('packageSizes.medium')}</option>
                    <option value="large">{pricingT('packageSizes.large')}</option>
                    <option value="extra-large">{`${pricingT('packageSizes.large')} +`}</option>
                  </select>
                </div>

                {/* Package Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {requestT('packageDescription')}
                  </label>
                  <textarea
                    name="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleChange}
                    rows={2}
                    maxLength={500}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={requestT('descriptionPlaceholder')}
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {requestT('urgency')}
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="standard">{pricingT('urgencyLevels.standard')}</option>
                    <option value="express">{pricingT('urgencyLevels.express')}</option>
                    <option value="urgent">{pricingT('urgencyLevels.urgent')}</option>
                    <option value="scheduled">{pricingT('urgencyLevels.scheduled')}</option>
                  </select>
                </div>
                <SchedulePicker
                  label={schedulingT('pickupSchedule')}
                  onDateTimeChange={(date) => {
                    setFormData((prev) => ({ ...prev, pickupDateTime: date }));
                  }}
                />
              </div>
            </div>

            {/* Live Map Preview */}
            {originCoords && destinationCoords && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {mapsT('title')}
                </h3>
                <DeliveryMap
                  origin={{ ...originCoords, address: formData.senderAddress }}
                  destination={{ ...destinationCoords, address: formData.receiverAddress }}
                  showRoute={true}
                  height="300px"
                />
              </div>
            )}

            {/* Live Price Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold">{t('request.pricing.title')}</h3>
              </div>

              {calculatingPrice ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">{t('request.pricing.calculating')}</span>
                </div>
              ) : priceBreakdown ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{t('request.pricing.base')}</span>
                    <span>{formatCurrency(priceBreakdown.basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('request.pricing.distance')} ({routeInfo?.distanceText})</span>
                    <span>{formatCurrency(priceBreakdown.distancePrice)}</span>
                  </div>
                  {priceBreakdown.packageSizePrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{t('request.pricing.packageSize')}</span>
                      <span>{formatCurrency(priceBreakdown.packageSizePrice)}</span>
                    </div>
                  )}
                  {priceBreakdown.urgencyPrice !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{t('request.pricing.urgency')}</span>
                      <span>{formatCurrency(priceBreakdown.urgencyPrice)}</span>
                    </div>
                  )}
                  {priceBreakdown.scheduledDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{pricingT('scheduledDiscount')}</span>
                      <span>-{formatCurrency(priceBreakdown.scheduledDiscount)}</span>
                    </div>
                  )}
                  {priceBreakdown.scheduledFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{pricingT('scheduledFee')}</span>
                      <span>{formatCurrency(priceBreakdown.scheduledFee)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>{t('request.pricing.total')}</span>
                    <span className="text-blue-600">{formatCurrency(priceBreakdown.totalPrice)}</span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900">
                        {t('request.pricing.courierInfo', {
                          amount: formatCurrency(priceBreakdown.courierEarnings),
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">{error}</div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {t('request.pricing.enterAddresses')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('request.back')}
              </button>
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('request.submitting')}
                  </>
                ) : (
                  <>
                    {t('request.submit')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 transition-all ${
                  step > s ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {/* Global Error Display */}
      {error && step !== 3 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}
    </form>
  );
}
