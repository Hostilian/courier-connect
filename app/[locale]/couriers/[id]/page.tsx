'use client';

import CourierProfile from '@/components/CourierProfile';
import CourierRating from '@/components/CourierRating';
import SimpleFooter from '@/components/SimpleFooter';
import SimpleHeader from '@/components/SimpleHeader';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2, MapPin, Package } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CourierProfileData {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  transportType?: string;
  completedDeliveries?: number;
  activeDeliveries?: number;
  rating?: number;
  createdAt: string;
}

export default function CourierProfilePage() {
  const t = useTranslations('courier');
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  
  const [courier, setCourier] = useState<CourierProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const courierId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  useEffect(() => {
    if (!courierId) return;
    
    async function fetchCourierData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/couriers/${courierId}`);
        
        if (response.ok) {
          const data = await response.json();
          setCourier(data);
        } else {
          setError(t('profileNotFound'));
          console.error('Failed to fetch courier data');
        }
      } catch (err) {
        setError(t('fetchError'));
        console.error('Error fetching courier:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCourierData();
  }, [courierId, t]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SimpleHeader />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t('backToResults')}
          </button>
        </div>
        
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-red-800 text-xl font-semibold mb-2">{t('profileError')}</h2>
            <p className="text-red-700">{error}</p>
            <Link
              href="/"
              className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('returnHome')}
            </Link>
          </div>
        )}
        
        {courier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Courier Profile Component */}
            <CourierProfile 
              courierId={courier._id}
              name={courier.name}
              rating={courier.rating}
              joinedDate={courier.createdAt}
              city={courier.city}
              country={courier.country}
              profileImage={courier.profileImage}
              completedDeliveries={courier.completedDeliveries}
              transportType={courier.transportType}
            />
            
            {/* Service Area */}
            {courier.city && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2 text-blue-600" />
                  {t('serviceArea')}
                </h2>
                <p className="text-gray-700">
                  {courier.city && courier.country ? `${courier.city}, ${courier.country}` : courier.city || courier.country}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('serviceRadius', { radius: 10 })}
                </p>
              </div>
            )}
            
            {/* Transport Type */}
            {courier.transportType && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Package className="mr-2 text-blue-600" />
                  {t('transportDetails')}
                </h2>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-2">{t('vehicle')}:</span>
                  <span>{courier.transportType}</span>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">{t('acceptedPackages')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm">{t('packageTypes.small')}</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm">{t('packageTypes.medium')}</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm">{t('packageTypes.documents')}</span>
                    </div>
                    {courier.transportType !== 'Bike' && (
                      <div className="flex items-center p-2 bg-gray-50 rounded border border-gray-200">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm">{t('packageTypes.large')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Detailed Ratings Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t('detailedRatings')}</h2>
              <CourierRating courierId={courier._id} />
            </div>
          </motion.div>
        )}
      </main>
      
      <SimpleFooter />
    </div>
  );
}