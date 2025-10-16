'use client';

import { Battery, Bell, MapPin, Package, Settings, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface CourierPreferences {
  acceptAutomatic: boolean;
  preferredRadius: number; // km
  minimumPrice: number;
  maximumDistance: number; // km
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  vehicleType: string;
  maxPackageSize: 'small' | 'medium' | 'large' | 'extra-large';
  notifications: {
    newDeliveries: boolean;
    nearDeadline: boolean;
    earnings: boolean;
    messages: boolean;
  };
  batteryOptimization: boolean;
}

interface CourierFeaturesProps {
  onPreferencesChange: (preferences: CourierPreferences) => void;
  initialPreferences?: Partial<CourierPreferences>;
}

export default function CourierFeatures({
  onPreferencesChange,
  initialPreferences = {},
}: CourierFeaturesProps) {
  const t = useTranslations('courier.features');
  
  const [preferences, setPreferences] = useState<CourierPreferences>({
    acceptAutomatic: initialPreferences.acceptAutomatic || false,
    preferredRadius: initialPreferences.preferredRadius || 10,
    minimumPrice: initialPreferences.minimumPrice || 5,
    maximumDistance: initialPreferences.maximumDistance || 20,
    workingHours: initialPreferences.workingHours || {
      start: '08:00',
      end: '20:00',
    },
    workingDays: initialPreferences.workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    vehicleType: initialPreferences.vehicleType || 'car',
    maxPackageSize: initialPreferences.maxPackageSize || 'medium',
    notifications: initialPreferences.notifications || {
      newDeliveries: true,
      nearDeadline: true,
      earnings: true,
      messages: true,
    },
    batteryOptimization: initialPreferences.batteryOptimization || false,
  });

  const updatePreference = <K extends keyof CourierPreferences>(
    key: K,
    value: CourierPreferences[K]
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    onPreferencesChange(updated);
  };

  const toggleWorkingDay = (day: string) => {
    const days = preferences.workingDays.includes(day)
      ? preferences.workingDays.filter((d) => d !== day)
      : [...preferences.workingDays, day];
    updatePreference('workingDays', days);
  };

  const weekDays = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ];

  return (
    <div className="space-y-6">
      {/* Auto-Accept Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          {t('autoAccept') || 'Auto-Accept Settings'}
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="autoAccept"
              checked={preferences.acceptAutomatic}
              onChange={(e) => updatePreference('acceptAutomatic', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoAccept" className="flex-1 cursor-pointer">
              <span className="font-medium">{t('enableAutoAccept') || 'Enable Auto-Accept'}</span>
              <p className="text-sm text-gray-600 mt-1">
                {t('autoAcceptDesc') || 'Automatically accept deliveries matching your preferences'}
              </p>
            </label>
          </div>

          {preferences.acceptAutomatic && (
            <div className="ml-7 space-y-3 bg-blue-50 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('minimumPrice') || 'Minimum Price'} (${preferences.minimumPrice})
                </label>
                <input
                  type="range"
                  min="3"
                  max="50"
                  step="1"
                  value={preferences.minimumPrice}
                  onChange={(e) => updatePreference('minimumPrice', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('maximumDistance') || 'Maximum Distance'} ({preferences.maximumDistance} km)
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={preferences.maximumDistance}
                  onChange={(e) => updatePreference('maximumDistance', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Area */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          {t('serviceArea') || 'Service Area'}
        </h3>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('preferredRadius') || 'Preferred Radius'} ({preferences.preferredRadius} km)
          </label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={preferences.preferredRadius}
            onChange={(e) => updatePreference('preferredRadius', Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-2">
            {t('radiusDesc') || 'You will be prioritized for deliveries within this radius'}
          </p>
        </div>
      </div>

      {/* Vehicle & Capacity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          {t('vehicleCapacity') || 'Vehicle & Capacity'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('vehicleType') || 'Vehicle Type'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['bike', 'motorcycle', 'car', 'van'].map((type) => (
                <button
                  key={type}
                  onClick={() => updatePreference('vehicleType', type)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    preferences.vehicleType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type === 'bike' && '🚲'}
                  {type === 'motorcycle' && '🏍️'}
                  {type === 'car' && '🚗'}
                  {type === 'van' && '🚐'}
                  <div className="text-xs mt-1 capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('maxPackageSize') || 'Maximum Package Size'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updatePreference('maxPackageSize', size)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    preferences.maxPackageSize === size
                      ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm capitalize">{size.replace('-', ' ')}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Working Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {t('workingSchedule') || 'Working Schedule'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('workingDays') || 'Working Days'}
            </label>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.key}
                  onClick={() => toggleWorkingDay(day.key)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                    preferences.workingDays.includes(day.key)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('startTime') || 'Start Time'}
              </label>
              <input
                type="time"
                value={preferences.workingHours.start}
                onChange={(e) =>
                  updatePreference('workingHours', {
                    ...preferences.workingHours,
                    start: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('endTime') || 'End Time'}
              </label>
              <input
                type="time"
                value={preferences.workingHours.end}
                onChange={(e) =>
                  updatePreference('workingHours', {
                    ...preferences.workingHours,
                    end: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          {t('notifications') || 'Notifications'}
        </h3>

        <div className="space-y-3">
          {(Object.keys(preferences.notifications) as Array<keyof typeof preferences.notifications>).map((key) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={key}
                checked={preferences.notifications[key]}
                onChange={(e) =>
                  updatePreference('notifications', {
                    ...preferences.notifications,
                    [key]: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor={key} className="flex-1 cursor-pointer capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Battery Optimization */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Battery className="w-5 h-5 text-blue-600" />
          {t('batteryOptimization') || 'Battery Optimization'}
        </h3>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="battery"
            checked={preferences.batteryOptimization}
            onChange={(e) => updatePreference('batteryOptimization', e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="battery" className="flex-1 cursor-pointer">
            <span className="font-medium">{t('enableBatteryOptimization') || 'Enable Battery Saver'}</span>
            <p className="text-sm text-gray-600 mt-1">
              {t('batteryDesc') || 'Reduce GPS updates when not on active delivery to save battery'}
            </p>
          </label>
        </div>
      </div>
    </div>
  );
}
