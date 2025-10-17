'use client';

import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Mail, MapPin, Phone, Truck, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CourierRegisterPage() {
  const t = useTranslations('courier.register');
  const locale = useLocale();
  const router = useRouter();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    vehicleType: 'bike',
    idNumber: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch') || 'Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError(t('passwordTooShort') || 'Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeTerms) {
      setError(t('agreeRequired') || 'You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
          role: 'courier',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token
        localStorage.setItem('cc_token', data.token);
        // Redirect to dashboard
        router.push(`/${locale}/courier/dashboard`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('error') || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('networkError') || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme?.primary || '#3B82F6' }}
          >
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{t('title') || 'Become a Courier'}</h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle') || 'Earn money delivering packages. Flexible hours, competitive pay.'}
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: '💰', title: t('benefit1') || 'Good Pay', desc: t('benefit1Desc') || '$5-20 per delivery' },
            { icon: '⏰', title: t('benefit2') || 'Flexible', desc: t('benefit2Desc') || 'Work when you want' },
            { icon: '🤝', title: t('benefit3') || 'Local Work', desc: t('benefit3Desc') || 'Deliver in your area' },
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <h3 className="font-bold mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">{t('formTitle') || 'Sign Up'}</h2>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('fullName') || 'Full Name'}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                  placeholder={t('namePlaceholder') || 'Full Name'}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('email') || 'Email'}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('phone') || 'Phone'}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder="+420 123 456 789"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('city') || 'City'}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder="Prague"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('vehicle') || 'Vehicle'}</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleChange('vehicleType', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                >
                  <option value="bike">{t('bike') || '🚴 Bike'}</option>
                  <option value="scooter">{t('scooter') || '🛴 Scooter'}</option>
                  <option value="motorcycle">{t('motorcycle') || '🏍️ Motorcycle'}</option>
                  <option value="car">{t('car') || '🚗 Car'}</option>
                  <option value="van">{t('van') || '🚐 Van'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('idNumber') || 'ID Number'}</label>
              <input
                type="text"
                required
                value={formData.idNumber}
                onChange={(e) => handleChange('idNumber', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all"
                placeholder={t('idPlaceholder') || 'For verification purposes'}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('password') || 'Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder="••••••••"
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('confirmPassword') || 'Confirm Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all"
                    placeholder="••••••••"
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                className="mt-1 w-4 h-4"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                {t('agreeText') || 'I agree to the'}{' '}
                <Link href={`/${locale}/terms`} className="underline" style={{ color: theme?.primary || '#3B82F6' }}>
                  {t('terms') || 'Terms and Conditions'}
                </Link>
                {' '}{t('and') || 'and'}{' '}
                <Link href={`/${locale}/privacy`} className="underline" style={{ color: theme?.primary || '#3B82F6' }}>
                  {t('privacy') || 'Privacy Policy'}
                </Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 px-6 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: theme?.primary || '#3B82F6' }}
          >
            {loading ? (t('registering') || 'Creating Account...') : (t('submit') || 'Create Account')}
            {!loading && <CheckCircle className="w-5 h-5" />}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('haveAccount') || 'Already have an account?'}{' '}
            <Link href={`/${locale}/courier/login`} className="font-medium underline" style={{ color: theme?.primary || '#3B82F6' }}>
              {t('login') || 'Login'}
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
