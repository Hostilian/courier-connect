'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getLanguageByCode } from '@/lib/languages';

export default function CourierLoginPage() {
  const t = useTranslations('courier.login');
  const locale = useLocale();
  const router = useRouter();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token
        localStorage.setItem('cc_token', data.token);
        // Redirect to dashboard
        router.push(`/${locale}/courier/dashboard`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('error') || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('networkError') || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
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
          <h1 className="text-4xl font-bold mb-2">{t('title') || 'Courier Login'}</h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle') || 'Welcome back! Login to start earning.'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
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
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">{t('remember') || 'Remember me'}</span>
              </label>
              <Link href={`/${locale}/courier/forgot-password`} className="underline" style={{ color: theme?.primary || '#3B82F6' }}>
                {t('forgot') || 'Forgot password?'}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 px-6 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: theme?.primary || '#3B82F6' }}
          >
            {loading ? (t('loggingIn') || 'Logging in...') : (t('submit') || 'Login')}
            {!loading && <LogIn className="w-5 h-5" />}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('noAccount') || "Don't have an account?"}{' '}
            <Link href={`/${locale}/courier/register`} className="font-medium underline" style={{ color: theme?.primary || '#3B82F6' }}>
              {t('register') || 'Sign up'}
            </Link>
          </p>
        </motion.form>

        {/* Customer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-muted-foreground">
            {t('customer') || 'Need a delivery?'}{' '}
            <Link href={`/${locale}/request`} className="underline" style={{ color: theme?.primary || '#3B82F6' }}>
              {t('requestHere') || 'Request here'}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
