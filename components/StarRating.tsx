'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  initialRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
}

export default function StarRating({
  initialRating = 0,
  size = 'md',
  readOnly = false,
  onRatingChange,
  maxRating = 5,
}: StarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const containerClass = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  const handleClick = (value: number) => {
    if (readOnly) return;
    
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={`flex items-center ${containerClass[size]}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hover !== null ? hover : rating) >= starValue;

        return (
          <motion.button
            key={index}
            type="button"
            whileHover={{ scale: readOnly ? 1 : 1.2 }}
            whileTap={{ scale: readOnly ? 1 : 0.9 }}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(null)}
            className={`flex items-center justify-center ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            disabled={readOnly}
          >
            <Star
              className={`${starSizes[size]} ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              } transition-colors duration-150`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}