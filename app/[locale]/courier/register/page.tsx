'use client';

import CourierRegistrationForm from '@/components/CourierRegistrationForm';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export default function CourierRegisterPage() {
  const t = useTranslations('courier.register');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-2xl"
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme?.primary || '#FBBF24' }}
          >
            <Truck className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl md:text-4xl font-extrabold text-gray-900">
          {t('pageTitle')}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('pageSubtitle')}
        </p>
      </motion.div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CourierRegistrationForm />
        </motion.div>
      </div>
    </div>
  );
}
