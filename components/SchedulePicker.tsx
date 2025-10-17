'use client';

import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface SchedulePickerProps {
  onDateTimeChange: (date: Date | null) => void;
  label: string;
}

export default function SchedulePicker({ onDateTimeChange, label }: SchedulePickerProps) {
  const t = useTranslations('scheduling');
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('12:00');

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day);
    if (day) {
      updateDateTime(day, selectedTime);
    } else {
      onDateTimeChange(null);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const time = e.target.value;
    setSelectedTime(time);
    if (selectedDay) {
      updateDateTime(selectedDay, time);
    }
  };

  const updateDateTime = (day: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(day);
    newDate.setHours(hours, minutes);
    onDateTimeChange(newDate);
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${String(hour).padStart(2, '0')}:${minute}`;
  });

  const footer = selectedDay ? (
    <p className="mt-2 text-sm">
      {t('youSelected')}{' '}
      <span className="font-semibold">{format(selectedDay, 'PPP')}</span> at{' '}
      <span className="font-semibold">{selectedTime}</span>.
    </p>
  ) : (
    <p className="mt-2 text-sm">{t('pleaseSelectDay')}.</p>
  );

  return (
    <div className="space-y-4">
       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
          {label}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={handleDaySelect}
              fromDate={new Date()}
              footer={footer}
              styles={{
                caption: { color: '#3B82F6' },
                head: { color: '#3B82F6' },
              }}
            />
          </div>
          <div className="flex-grow">
            <label htmlFor="time-select" className="block text-sm font-medium text-gray-700 mb-1">
              {t('selectTime')}
            </label>
            <select
              id="time-select"
              value={selectedTime}
              onChange={handleTimeChange}
              disabled={!selectedDay}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-200"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
