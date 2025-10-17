'use client';

import { useCourierRegistrationForm } from '@/lib/hooks/useCourierRegistrationForm';
import { courierRegistrationSchema } from '@/lib/validation';
import {
    Bike,
    Building,
    Car,
    Lock,
    Mail,
    Phone,
    Truck,
    User
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

const vehicleIcons = {
  bike: <Bike className="w-5 h-5" />,
  scooter: <Bike className="w-5 h-5" />, // Using Bike for scooter as well
  motorcycle: <Bike className="w-5 h-5" />,
  car: <Car className="w-5 h-5" />,
  van: <Truck className="w-5 h-5" />,
};

export default function CourierRegistrationForm() {
  const t = useTranslations('courier.register');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { fields, setField, validateAll, getData } = useCourierRegistrationForm();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationResult = courierRegistrationSchema.safeParse(getData());

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        if (messages) {
          // @ts-ignore
          setField(field, fields[field].value); // This is a bit of a hack to trigger re-render with error
        }
      });
      toast.error(t('validationError'));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/courier/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationResult.data),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('success'));
        router.push('/courier/login');
      } else {
        toast.error(data.error || t('error'));
      }
    } catch (error) {
      toast.error(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t('title')}</h2>
      <p className="text-center text-gray-600 mb-6">{t('subtitle')}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fields.name')}</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={fields.name.value as string}
                onChange={(e) => setField('name', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fields.email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={fields.email.value as string}
                onChange={(e) => setField('email', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fields.password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={fields.password.value as string}
                onChange={(e) => setField('password', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fields.confirmPassword')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={fields.confirmPassword.value as string}
                onChange={(e) => setField('confirmPassword', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Phone and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fields.phone')}</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={fields.phone.value as string}
                onChange={(e) => setField('phone', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fields.city')}</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={fields.city.value as string}
                onChange={(e) => setField('city', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('fields.vehicleType')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {Object.keys(vehicleIcons).map((vehicle) => (
              <button
                key={vehicle}
                type="button"
                onClick={() => setField('vehicleType', vehicle)}
                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                  fields.vehicleType.value === vehicle
                    ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {vehicleIcons[vehicle as keyof typeof vehicleIcons]}
                <span className="text-xs font-medium mt-2 capitalize">{t(`vehicles.${vehicle}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={fields.agreeTerms.value as boolean}
              onChange={(e) => setField('agreeTerms', e.target.checked)}
              className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeTerms" className="text-gray-700">
              {t.rich('fields.agreeTerms', {
                link: (chunks) => (
                  <Link href="/terms" className="font-medium text-yellow-600 hover:underline">
                    {chunks}
                  </Link>
                ),
              })}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          {loading ? t('submitting') : t('submit')}
        </button>

        <p className="text-center text-sm text-gray-600">
          {t.rich('alreadyHaveAccount', {
            link: (chunks) => (
              <Link href="/courier/login" className="font-medium text-yellow-600 hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </form>
    </div>
  );
}
