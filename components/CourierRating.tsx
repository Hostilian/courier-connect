'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import StarRating from './StarRating';

interface Rating {
  _id: string;
  rating: number;
  comment?: string;
  customerName?: string;
  createdAt: string;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
}

interface CourierRatingProps {
  courierId: string;
  initialRatings?: Rating[];
  initialStats?: RatingStats;
}

export default function CourierRating({ 
  courierId, 
  initialRatings = [], 
  initialStats = { averageRating: 0, totalRatings: 0 } 
}: CourierRatingProps) {
  const t = useTranslations('ratings');
  
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [stats, setStats] = useState<RatingStats>(initialStats);
  const [isLoading, setIsLoading] = useState(initialRatings.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRatings.length === 0) {
      fetchRatings();
    }
  }, [courierId, initialRatings.length, fetchRatings]);

  async function fetchRatings() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch ratings
      const ratingResponse = await fetch(`/api/ratings/${courierId}`);
      if (!ratingResponse.ok) {
        throw new Error('Failed to fetch ratings');
      }
      const ratingData = await ratingResponse.json();
      setRatings(ratingData.ratings || []);
      
      // Fetch stats
      const statsResponse = await fetch(`/api/ratings/stats/${courierId}`);
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch rating statistics');
      }
      const statsData = await statsResponse.json();
      setStats(statsData);
      
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError(t('fetchError'));
    } finally {
      setIsLoading(false);
    }
  }

  // Format the rating number to include decimal place if needed
  const formatRating = (rating: number): string => {
    return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
  };

  // Calculate the percentage for different star ratings (5-star, 4-star, etc.)
  const calculateRatingPercentage = (targetRating: number): number => {
    if (stats.totalRatings === 0) return 0;
    
    const ratingsOfTarget = ratings.filter((r: Rating) => Math.floor(r.rating) === targetRating).length;
    return (ratingsOfTarget / stats.totalRatings) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        {error}
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">{t('noRatings')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Overall Rating */}
          <div className="text-center md:border-r md:border-gray-200 md:pr-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {formatRating(stats.averageRating)}
            </div>
            <StarRating initialRating={stats.averageRating} readOnly size="md" />
            <div className="text-sm text-gray-600 mt-2">
              {t('basedOn', { count: stats.totalRatings })}
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="col-span-2">
            <h4 className="font-medium mb-3">{t('ratingDistribution')}</h4>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-2">
                <div className="flex items-center w-20">
                  <span className="text-sm mr-1">{star}</span>
                  <StarRating initialRating={1} maxRating={1} readOnly size="sm" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2 mr-4">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: `${calculateRatingPercentage(star)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 w-10">
                  {Math.round(calculateRatingPercentage(star))}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <h3 className="text-xl font-semibold mb-4">{t('recentReviews')}</h3>
        <div className="space-y-4">
          {ratings.slice(0, 5).map((rating: Rating, index: number) => (
            <motion.div 
              key={rating._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative"
            >
              <div className="absolute top-4 right-4 text-gray-200">
                <Quote className="w-6 h-6" />
              </div>
              
              <div className="flex items-center mb-3">
                <StarRating initialRating={rating.rating} readOnly size="sm" />
                <span className="ml-2 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              {rating.comment && (
                <p className="text-gray-700 mb-3">{rating.comment}</p>
              )}
              
              {rating.customerName && (
                <div className="text-sm font-medium">
                  {rating.customerName}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}