'use client';

import ActiveDeliveries from '@/components/ActiveDeliveries';
import AvailableDeliveries from '@/components/AvailableDeliveries';
import CourierEarnings from '@/components/CourierEarnings';
import withAuth from '@/components/withAuth';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

function CourierDashboard() {
  const t = useTranslations('courier.dashboard');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  // Placeholder for user data
  const courier = {
    name: 'John Doe',
    avatarUrl: '/images/avatars/courier.png',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="mt-1 text-lg text-gray-600">{t('welcome', { name: courier.name })}</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <div className="relative">
              <img 
                src={courier.avatarUrl} 
                alt="Courier Avatar" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{courier.name}</p>
              <p className="text-xs text-gray-500">{t('verifiedCourier')}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            <ActiveDeliveries />
            <AvailableDeliveries />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            <CourierEarnings />
            {/* Future components like Profile Summary can go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CourierDashboard);