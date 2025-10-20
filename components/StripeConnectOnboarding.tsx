'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, CreditCard, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface OnboardingStatus {
  onboarded: boolean;
  accountId: string | null;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

export default function StripeConnectOnboarding() {
  const t = useTranslations('courier.stripe');
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  async function checkOnboardingStatus() {
    try {
      const res = await fetch('/api/stripe/connect/onboard');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartOnboarding() {
    setOnboarding(true);
    try {
      const res = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        const data = await res.json();
        toast.error(data.error || t('onboardingError'));
      }
    } catch (error) {
      toast.error(t('networkError'));
    } finally {
      setOnboarding(false);
    }
  }

  async function handleOpenDashboard() {
    setDashboardLoading(true);
    try {
      const res = await fetch('/api/stripe/connect/dashboard', {
        method: 'POST',
      });

      if (res.ok) {
        const { url } = await res.json();
        window.open(url, '_blank');
      } else {
        const data = await res.json();
        toast.error(data.error || t('dashboardError'));
      }
    } catch (error) {
      toast.error(t('networkError'));
    } finally {
      setDashboardLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  // If fully onboarded
  if (status.onboarded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {t('onboarded.title')}
            </h3>
            <p className="text-green-700 mb-4">
              {t('onboarded.description')}
            </p>
            <button
              onClick={handleOpenDashboard}
              disabled={dashboardLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {dashboardLoading ? t('loading') : t('openDashboard')}
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // If partially onboarded (details submitted but not all checks passed)
  if (status.accountId && status.detailsSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              {t('pending.title')}
            </h3>
            <p className="text-yellow-700 mb-4">
              {t('pending.description')}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                {status.detailsSubmitted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                <span className={status.detailsSubmitted ? 'text-green-700' : 'text-gray-600'}>
                  {t('pending.detailsSubmitted')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {status.chargesEnabled ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                <span className={status.chargesEnabled ? 'text-green-700' : 'text-gray-600'}>
                  {t('pending.chargesEnabled')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {status.payoutsEnabled ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                <span className={status.payoutsEnabled ? 'text-green-700' : 'text-gray-600'}>
                  {t('pending.payoutsEnabled')}
                </span>
              </div>
            </div>
            <button
              onClick={handleStartOnboarding}
              disabled={onboarding}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {onboarding ? t('loading') : t('pending.continueOnboarding')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Not onboarded at all
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {t('notOnboarded.title')}
          </h3>
          <p className="text-blue-700 mb-4">
            {t('notOnboarded.description')}
          </p>
          <ul className="list-disc list-inside text-sm text-blue-700 mb-4 space-y-1">
            <li>{t('notOnboarded.benefit1')}</li>
            <li>{t('notOnboarded.benefit2')}</li>
            <li>{t('notOnboarded.benefit3')}</li>
          </ul>
          <button
            onClick={handleStartOnboarding}
            disabled={onboarding}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
          >
            <CreditCard className="w-5 h-5" />
            {onboarding ? t('loading') : t('notOnboarded.startOnboarding')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
