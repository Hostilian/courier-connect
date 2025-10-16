'use client';

import { Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface SchedulePickerProps {
  onScheduleChange: (schedule: {
    pickupDate: string;
    pickupTime: string;
    deliveryDate?: string;
    deliveryTime?: string;
  }) => void;
  showDeliverySchedule?: boolean;
}

export default function SchedulePicker({
  onScheduleChange,
  showDeliverySchedule = false,
}: SchedulePickerProps) {
  const t = useTranslations('scheduling');
  
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum time based on selected date
  const getMinTime = (selectedDate: string) => {
    const today = new Date();
    const selected = new Date(selectedDate);
    
    // If selected date is today, minimum time is 1 hour from now
    if (selected.toDateString() === today.toDateString()) {
      const minTime = new Date(today.getTime() + 60 * 60 * 1000); // 1 hour from now
      const hours = minTime.getHours().toString().padStart(2, '0');
      const minutes = minTime.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return '00:00';
  };

  // Update parent when schedule changes
  useEffect(() => {
    if (pickupDate && pickupTime) {
      onScheduleChange({
        pickupDate,
        pickupTime,
        deliveryDate: showDeliverySchedule ? deliveryDate : undefined,
        deliveryTime: showDeliverySchedule ? deliveryTime : undefined,
      });
    }
  }, [pickupDate, pickupTime, deliveryDate, deliveryTime, showDeliverySchedule, onScheduleChange]);

  // Auto-set delivery date if not set and pickup is selected
  useEffect(() => {
    if (showDeliverySchedule && pickupDate && !deliveryDate) {
      setDeliveryDate(pickupDate);
    }
  }, [pickupDate, deliveryDate, showDeliverySchedule]);

  return (
    <div className="space-y-4">
      {/* Pickup Schedule */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-900">
          <Calendar className="w-5 h-5" />
          {t('pickupSchedule')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-900">
              {t('pickupDate')} *
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={getMinDate()}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-900">
              {t('pickupTime')} *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                min={pickupDate === getMinDate() ? getMinTime(pickupDate) : undefined}
                className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>
        {pickupDate && pickupTime && (
          <p className="mt-2 text-xs text-blue-700">
            {t('scheduledFor')}: {new Date(`${pickupDate}T${pickupTime}`).toLocaleString()}
          </p>
        )}
      </div>

      {/* Delivery Schedule (Optional) */}
      {showDeliverySchedule && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-900">
            <Calendar className="w-5 h-5" />
            {t('deliverySchedule')} ({t('optional')})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-green-900">
                {t('deliveryDate')}
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={pickupDate || getMinDate()}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-900">
                {t('deliveryTime')}
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          {deliveryDate && deliveryTime && (
            <p className="mt-2 text-xs text-green-700">
              {t('deliverBy')}: {new Date(`${deliveryDate}T${deliveryTime}`).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Discount Notice */}
      {pickupDate && (() => {
        const hoursInAdvance = (new Date(`${pickupDate}T${pickupTime || '00:00'}`).getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursInAdvance >= 24;
      })() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            🎉 {t('advanceBookingDiscount')} 10% {t('discount')}!
          </p>
        </div>
      )}
    </div>
  );
}
