'use client';

import { Lock, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

export default function CourierLoginForm() {
  const t = useTranslations('courier.login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courier/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t('success'));
        if (data.token) {
          localStorage.setItem('cc_token', data.token);
        }
        router.push('/courier/dashboard');
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
    <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t('title')}</h2>
      <p className="text-center text-gray-600 mb-6">{t('subtitle')}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              {t('remember')}
            </label>
          </div>

          <div className="text-sm">
            <Link href="/courier/forgot-password">
              <span className="font-medium text-yellow-600 hover:text-yellow-500">{t('forgotPassword')}</span>
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          {loading ? t('loading') : t('loginButton')}
        </button>

        <p className="text-center text-sm text-gray-600">
          {t.rich('noAccount', {
            link: (chunks) => (
              <Link href="/courier/register" className="font-medium text-yellow-600 hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </form>
    </div>
  );
}
