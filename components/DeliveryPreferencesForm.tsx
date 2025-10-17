'use client';

import { AlertCircle, Box, Clock, DollarSign, Package, Shield, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface DeliveryPreferences {
  packageValue?: number;
  insurance: boolean;
  fragile: boolean;
  specialInstructions?: string;
  preferredCourierRating?: number;
  contactPreference: 'call' | 'text' | 'both';
  deliveryProofRequired: boolean;
  signatureRequired: boolean;
  leaveAtDoor: boolean;
  notifyBeforeArrival: boolean;
  notifyMinutes?: number;
}

interface DeliveryPreferencesFormProps {
  onPreferencesChange: (preferences: DeliveryPreferences) => void;
  initialPreferences?: Partial<DeliveryPreferences>;
}

export default function DeliveryPreferencesForm({
  onPreferencesChange,
  initialPreferences = {},
}: DeliveryPreferencesFormProps) {
  const t = useTranslations('preferences');
  
  const [preferences, setPreferences] = useState<DeliveryPreferences>({
    insurance: initialPreferences.insurance || false,
    fragile: initialPreferences.fragile || false,
    contactPreference: initialPreferences.contactPreference || 'both',
    deliveryProofRequired: initialPreferences.deliveryProofRequired || true,
    signatureRequired: initialPreferences.signatureRequired || false,
    leaveAtDoor: initialPreferences.leaveAtDoor || false,
    notifyBeforeArrival: initialPreferences.notifyBeforeArrival || true,
    notifyMinutes: initialPreferences.notifyMinutes || 10,
    preferredCourierRating: initialPreferences.preferredCourierRating,
    packageValue: initialPreferences.packageValue,
    specialInstructions: initialPreferences.specialInstructions,
  });

  const updatePreference = <K extends keyof DeliveryPreferences>(
    key: K,
    value: DeliveryPreferences[K]
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    onPreferencesChange(updated);
  };

  const getInsuranceCost = (value: number) => {
    // 1% of package value, minimum $1, maximum $50
    return Math.min(Math.max(value * 0.01, 1), 50);
  };

  return (
    <div className="space-y-6">
      {/* Package Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          {t('packageDetails') || 'Package Details'}
        </h3>

        <div className="space-y-4">
          {/* Package Value */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('packageValue') || 'Package Value (Optional)'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={preferences.packageValue || ''}
                onChange={(e) => updatePreference('packageValue', Number(e.target.value))}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {preferences.packageValue && preferences.packageValue > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                💡 Recommended to add insurance for valuable items
              </p>
            )}
          </div>

          {/* Insurance */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="insurance"
              checked={preferences.insurance}
              onChange={(e) => updatePreference('insurance', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="insurance" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium">{t('insurance') || 'Add Insurance'}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {t('insuranceDesc') || 'Protect your package against loss or damage'}
                {preferences.packageValue && preferences.packageValue > 0 && (
                  <span className="text-blue-600 font-medium ml-1">
                    (+${getInsuranceCost(preferences.packageValue).toFixed(2)})
                  </span>
                )}
              </p>
            </label>
          </div>

          {/* Fragile */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="fragile"
              checked={preferences.fragile}
              onChange={(e) => updatePreference('fragile', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="fragile" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="font-medium">{t('fragile') || 'Fragile Item'}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {t('fragileDesc') || 'Handle with extra care'}
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* Delivery Preferences */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-600" />
          {t('deliveryPreferences') || 'Delivery Preferences'}
        </h3>

        <div className="space-y-4">
          {/* Signature Required */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="signature"
              checked={preferences.signatureRequired}
              onChange={(e) => updatePreference('signatureRequired', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="signature" className="flex-1 cursor-pointer">
              <span className="font-medium">{t('signatureRequired') || 'Signature Required'}</span>
              <p className="text-sm text-gray-600 mt-1">
                {t('signatureDesc') || 'Recipient must sign upon delivery'}
              </p>
            </label>
          </div>

          {/* Leave at Door */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="leaveAtDoor"
              checked={preferences.leaveAtDoor}
              onChange={(e) => {
                updatePreference('leaveAtDoor', e.target.checked);
                if (e.target.checked) {
                  updatePreference('signatureRequired', false);
                }
              }}
              disabled={preferences.signatureRequired}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <label htmlFor="leaveAtDoor" className="flex-1 cursor-pointer">
              <span className="font-medium">{t('leaveAtDoor') || 'Leave at Door'}</span>
              <p className="text-sm text-gray-600 mt-1">
                {t('leaveAtDoorDesc') || 'Courier can leave package at the door'}
              </p>
            </label>
          </div>

          {/* Photo Proof */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="photoProof"
              checked={preferences.deliveryProofRequired}
              onChange={(e) => updatePreference('deliveryProofRequired', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="photoProof" className="flex-1 cursor-pointer">
              <span className="font-medium">{t('photoProof') || 'Photo Proof of Delivery'}</span>
              <p className="text-sm text-gray-600 mt-1">
                {t('photoProofDesc') || 'Courier takes a photo when delivered'}
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          {t('communication') || 'Communication Preferences'}
        </h3>

        <div className="space-y-4">
          {/* Notify Before Arrival */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="notify"
              checked={preferences.notifyBeforeArrival}
              onChange={(e) => updatePreference('notifyBeforeArrival', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="notify" className="flex-1 cursor-pointer">
              <span className="font-medium">{t('notifyBeforeArrival') || 'Notify Before Arrival'}</span>
              <p className="text-sm text-gray-600 mt-1">
                {t('notifyDesc') || 'Get notified when courier is nearby'}
              </p>
            </label>
          </div>

          {/* Notification Time */}
          {preferences.notifyBeforeArrival && (
            <div className="ml-7">
              <label className="block text-sm font-medium mb-2">
                {t('notifyMinutes') || 'Notify me... minutes before arrival'}
              </label>
              <select
                value={preferences.notifyMinutes}
                onChange={(e) => updatePreference('notifyMinutes', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          )}

          {/* Contact Preference */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('contactMethod') || 'Preferred Contact Method'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['call', 'text', 'both'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => updatePreference('contactPreference', method)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    preferences.contactPreference === method
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {method === 'call' && '📞 Call'}
                  {method === 'text' && '💬 Text'}
                  {method === 'both' && '📞💬 Both'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courier Preferences */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-blue-600" />
          {t('courierPreferences') || 'Courier Preferences'}
        </h3>

        <div className="space-y-4">
          {/* Minimum Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('minimumRating') || 'Minimum Courier Rating (Optional)'}
            </label>
            <div className="flex gap-2">
              {[3, 3.5, 4, 4.5, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updatePreference('preferredCourierRating', rating)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    preferences.preferredCourierRating === rating
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ⭐ {rating}+
                </button>
              ))}
              <button
                onClick={() => updatePreference('preferredCourierRating', undefined)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  !preferences.preferredCourierRating
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Any
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('ratingNote') || 'Higher ratings may result in longer wait times'}
            </p>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('specialInstructions') || 'Special Instructions (Optional)'}
            </label>
            <textarea
              value={preferences.specialInstructions || ''}
              onChange={(e) => updatePreference('specialInstructions', e.target.value)}
              placeholder={t('instructionsPlaceholder') || 'e.g., Ring doorbell twice, use side entrance...'}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {preferences.specialInstructions?.length || 0}/200
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">📋 {t('summary') || 'Summary'}</h4>
        <div className="text-sm text-blue-700 space-y-1">
          {preferences.insurance && <div>✓ Insurance included</div>}
          {preferences.fragile && <div>✓ Marked as fragile</div>}
          {preferences.signatureRequired && <div>✓ Signature required</div>}
          {preferences.leaveAtDoor && <div>✓ Can leave at door</div>}
          {preferences.deliveryProofRequired && <div>✓ Photo proof required</div>}
          {preferences.notifyBeforeArrival && (
            <div>✓ Notify {preferences.notifyMinutes} min before arrival</div>
          )}
          {preferences.preferredCourierRating && (
            <div>✓ Courier rating: {preferences.preferredCourierRating}+ stars</div>
          )}
        </div>
      </div>
    </div>
  );
}
