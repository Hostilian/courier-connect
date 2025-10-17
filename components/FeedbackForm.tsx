'use client';

import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

interface FeedbackFormProps {
  deliveryId: string;
  trackingId: string;
  courierId: string;
  customerName?: string;
  customerEmail?: string;
  onSubmitSuccess?: () => void;
}

export default function FeedbackForm({
  deliveryId,
  trackingId,
  courierId,
  customerName = '',
  customerEmail = '',
  onSubmitSuccess,
}: FeedbackFormProps) {
  const t = useTranslations('feedback');
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    name: customerName,
    email: customerEmail,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error(t('ratingRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryId,
          trackingId,
          courierId,
          rating: formData.rating,
          feedback: formData.comment,
          customerName: formData.name,
          customerEmail: formData.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit rating');
      }

      toast.success(t('thankYou'));
      setSubmitted(true);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Rating submission error:', error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <h3 className="text-xl font-semibold text-green-800 mb-2">{t('thankYouTitle')}</h3>
        <p className="text-green-700">{t('feedbackReceived')}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-xl font-semibold mb-4">{t('title')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">{t('ratingLabel')}</label>
          <StarRating 
            initialRating={formData.rating}
            onRatingChange={handleRatingChange}
            size="lg"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block mb-2 text-sm font-medium">{t('commentLabel')}</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={3}
            placeholder={t('commentPlaceholder')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">{t('nameLabel')}</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('namePlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">{t('emailLabel')}</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || formData.rating === 0}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('submitting')}
            </span>
          ) : (
            <span className="inline-flex items-center">
              {t('submitFeedback')}
              <Send className="ml-2 w-4 h-4" />
            </span>
          )}
        </button>
      </form>
    </motion.div>
  );
}