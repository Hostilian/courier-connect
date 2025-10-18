'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, MapPin, Package, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import CourierRating from './CourierRating';

interface CourierProfileProps {
  courierId: string;
  name: string;
  rating?: number;
  joinedDate: string;
  city?: string;
  country?: string;
  profileImage?: string;
  completedDeliveries?: number;
  transportType?: string;
}

export default function CourierProfile({
  courierId,
  name,
  rating = 0,
  joinedDate,
  city,
  country,
  profileImage,
  completedDeliveries = 0,
  transportType,
}: CourierProfileProps) {
  const t = useTranslations('courier');
  const [showRatings, setShowRatings] = useState(false);

  const formattedJoinDate = new Date(joinedDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with background and profile image */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Profile Image */}
          <div className="w-24 h-24 rounded-full bg-white flex-shrink-0 overflow-hidden border-4 border-white shadow-lg relative">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{name}</h2>
            
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
              {transportType && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-sm">
                  <Package className="w-3 h-3" />
                  {transportType}
                </span>
              )}
              
              {(city || country) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-sm">
                  <MapPin className="w-3 h-3" />
                  {city && country ? `${city}, ${country}` : city || country}
                </span>
              )}
              
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-sm">
                <Clock className="w-3 h-3" />
                {t('member')} {formattedJoinDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b">
        {/* Rating */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-gray-900">
                {rating > 0 ? rating.toFixed(1) : '—'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">{t('rating')}</p>
        </div>
        
        {/* Deliveries */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {completedDeliveries}
          </div>
          <p className="text-sm text-gray-600">{t('completedDeliveries')}</p>
        </div>
        
        {/* Experience */}
        <div className="text-center col-span-2">
          <div className="text-lg font-medium text-gray-900">
            {completedDeliveries > 100
              ? t('experienceExpert')
              : completedDeliveries > 50
              ? t('experienceAdvanced')
              : completedDeliveries > 20
              ? t('experienceIntermediate')
              : t('experienceBeginner')}
          </div>
          <p className="text-sm text-gray-600">{t('experienceLevel')}</p>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="p-6">
        <button
          onClick={() => setShowRatings(!showRatings)}
          className="w-full flex items-center justify-between py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
        >
          <span className="font-medium">{t('ratingsAndReviews')}</span>
          {showRatings ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {showRatings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <CourierRating courierId={courierId} />
          </motion.div>
        )}
      </div>
    </div>
  );
}