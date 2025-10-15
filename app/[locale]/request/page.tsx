'use client';

import { getLanguageByCode } from '@/lib/languages';
import { loadGoogleMaps } from '@/lib/maps';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Package, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function RequestPage() {
  const t = useTranslations('request');
  const locale = useLocale();
  const router = useRouter();
  const theme = getLanguageByCode(locale)?.culturalTheme;

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
    notes: '',
  });
  const [routeUrl, setRouteUrl] = useState<string>('');
  const pickupRef = useRef<HTMLTextAreaElement | null>(null);
  const dropoffRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // Setup Google Places Autocomplete on address fields
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
        });
        cleanup = () => g.maps.event.clearInstanceListeners(ac1);
      }
      if (dropoffRef.current) {
        const ac2 = new g.maps.places.Autocomplete(dropoffRef.current as any, options);
        ac2.addListener('place_changed', () => {
          const p = ac2.getPlace();
          if (p.formatted_address) handleChange('receiverAddress', p.formatted_address);
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

  useEffect(() => {
    // Build a lightweight route preview using Google Maps Directions URL
    if (!formData.senderAddress || !formData.receiverAddress) {
      setRouteUrl('');
      return;
    }
    const origin = encodeURIComponent(formData.senderAddress);
    const destination = encodeURIComponent(formData.receiverAddress);
    setRouteUrl(`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${origin}&destination=${destination}`);
  }, [formData.senderAddress, formData.receiverAddress]);

  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!trackingId) return;
    setPaymentLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
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
    setLoading(true);

    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (response.ok) {
        const data = await response.json();
        setTrackingId(data.trackingId);
        setStep(4);
      } else {
        alert(t('error') || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Request error:', error);
      alert(t('error') || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 4 && trackingId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${theme?.gradient || 'from-green-400 to-blue-500'} flex items-center justify-center`}>
            <Package className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{t('success.title') || 'Request Submitted!'}</h2>
          <p className="text-muted-foreground mb-6">
            {t('success.description') || 'Your delivery request has been created. A courier will pick it up soon!'}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-2">{t('trackingId') || 'Tracking ID'}</p>
            <p className="text-3xl font-mono font-bold" style={{ color: theme?.primary || '#3B82F6' }}>
              {trackingId}
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {t('success.save') || 'Save this tracking ID to check your delivery status anytime.'}
          </p>

          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#10B981', color: 'white' }}
            >
              {paymentLoading ? 'Loading...' : '💳 Pay Now'}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/${locale}/track`)}
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: theme?.primary || '#3B82F6', color: 'white' }}
            >
              {t('trackButton') || 'Track Delivery'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              {t('newRequest') || 'New Request'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{t('title') || 'Request a Delivery'}</h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle') || 'No account needed. Just fill in the details and a courier will help you!'}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? `text-white`
                    : 'bg-gray-200 text-gray-400'
                }`}
                style={step >= s ? { backgroundColor: theme?.primary || '#3B82F6' } : {}}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 rounded ${step > s ? '' : 'bg-gray-200'}`}
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
                {t('step1.title') || 'Pickup Details'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('senderName') || 'Your Name'}</label>
                  <input
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) => handleChange('senderName', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder={t('senderNamePlaceholder') || 'John Doe'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('senderPhone') || 'Your Phone'}</label>
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
                  <label className="block text-sm font-medium mb-2">{t('pickupAddress') || 'Pickup Address'}</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.senderAddress}
                    onChange={(e) => handleChange('senderAddress', e.target.value)}
                    ref={pickupRef}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder={t('addressPlaceholder') || 'Street, City, Postal Code'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('pickupTime') || 'When to pickup?'}</label>
                  <select
                    value={formData.pickupTime}
                    onChange={(e) => handleChange('pickupTime', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                  >
                    <option value="asap">{t('asap') || 'As soon as possible'}</option>
                    <option value="today">{t('today') || 'Later today'}</option>
                    <option value="tomorrow">{t('tomorrow') || 'Tomorrow'}</option>
                    <option value="scheduled">{t('scheduled') || 'Schedule for later'}</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-8 px-6 py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                style={{ backgroundColor: theme?.primary || '#3B82F6' }}
              >
                {t('next') || 'Next Step'}
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
                {t('step2.title') || 'Delivery Details'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('receiverName') || 'Recipient Name'}</label>
                  <input
                    type="text"
                    required
                    value={formData.receiverName}
                    onChange={(e) => handleChange('receiverName', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder={t('receiverNamePlaceholder') || 'Jane Smith'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('receiverPhone') || 'Recipient Phone'}</label>
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
                  <label className="block text-sm font-medium mb-2">{t('deliveryAddress') || 'Delivery Address'}</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.receiverAddress}
                    onChange={(e) => handleChange('receiverAddress', e.target.value)}
                    ref={dropoffRef}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder={t('addressPlaceholder') || 'Street, City, Postal Code'}
                  />
                </div>
              </div>

              {routeUrl && (
                <div className="mt-6">
                  <div className="rounded-xl overflow-hidden border">
                    <iframe
                      title="Route preview"
                      width="100%"
                      height="300"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={routeUrl}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-4 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 transition-all"
                >
                  {t('back') || 'Back'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={{ backgroundColor: theme?.primary || '#3B82F6' }}
                >
                  {t('next') || 'Next Step'}
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
                {t('step3.title') || 'Package Details'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('packageType') || 'What are you sending?'}</label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => handleChange('packageType', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                  >
                    <option value="envelope">{t('envelope') || '📧 Envelope / Documents'}</option>
                    <option value="gift">{t('gift') || '🎁 Gift / Present'}</option>
                    <option value="marketplace">{t('marketplace') || '📦 Marketplace Item'}</option>
                    <option value="food">{t('food') || '🍱 Food / Groceries'}</option>
                    <option value="other">{t('other') || '📦 Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('packageSize') || 'Size'}</label>
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
                        style={formData.packageSize === size ? { backgroundColor: theme?.primary || '#3B82F6' } : {}}
                      >
                        {t(size) || size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('packageDescription') || 'Description'}</label>
                  <textarea
                    rows={3}
                    value={formData.packageDescription}
                    onChange={(e) => handleChange('packageDescription', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder={t('descriptionPlaceholder') || 'Any special instructions or details...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('urgency') || 'Delivery Speed'}</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleChange('urgency', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                  >
                    <option value="standard">{t('standard') || '🚶 Standard (2-4 hours) - $5'}</option>
                    <option value="express">{t('express') || '🚴 Express (1-2 hours) - $10'}</option>
                    <option value="urgent">{t('urgent') || '🏃 Urgent (< 1 hour) - $20'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('notes') || 'Additional Notes'}</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder={t('notesPlaceholder') || 'Anything else the courier should know...'}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-4 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 transition-all"
                >
                  {t('back') || 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                  style={{ backgroundColor: theme?.primary || '#3B82F6' }}
                >
                  {loading ? (t('submitting') || 'Submitting...') : (t('submit') || 'Submit Request')}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
