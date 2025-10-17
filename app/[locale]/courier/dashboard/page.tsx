'use client';

import ActiveDeliveries from '@/components/ActiveDeliveries';
import AvailableDeliveries from '@/components/AvailableDeliveries';
import CourierEarnings from '@/components/CourierEarnings';
import withAuth from '@/components/withAuth';
import { useTranslations } from 'next-intl';

function CourierDashboard() {
  const t = useTranslations('courier.dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {t('title')}
      </h1>
      
      <div className="space-y-8">
        <CourierEarnings />
        <ActiveDeliveries />
        <AvailableDeliveries />
      </div>
    </div>
  );
}

export default withAuth(CourierDashboard);