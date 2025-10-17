// File: components/TrackingTimeline.tsx
// A timeline. It shows you what happened and when.
// It's like a history book, but for a box. And less boring.

'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Flag, Package, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';

// The different stages of a package's life. A tragic play in five acts.
const statusSteps = [
  { status: 'pending', icon: Clock },
  { status: 'accepted', icon: CheckCircle },
  { status: 'picked_up', icon: Package },
  { status: 'in_transit', icon: Truck },
  { status: 'delivered', icon: Flag },
];

interface TrackingTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export default function TrackingTimeline({
  currentStatus,
  createdAt,
  updatedAt,
  deliveredAt,
}: TrackingTimelineProps) {
  const t = useTranslations('track.status');
  const timelineT = useTranslations('track.timeline');

  const getStatusDate = (status: string) => {
    if (status === 'pending') return createdAt;
    if (status === 'delivered' && deliveredAt) return deliveredAt;
    if (status === currentStatus) return updatedAt;
    return null; // For future statuses
  };

  const currentStatusIndex = statusSteps.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{timelineT('title') || 'Delivery Timeline'}</h3>
      <div className="relative">
        {/* The line that connects everything. The thread of fate, if you will. */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200" />
        
        {statusSteps.map((step, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const statusDate = getStatusDate(step.status);

          return (
            <motion.div
              key={step.status}
              className="relative flex items-start mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className={`font-semibold ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                  {t(step.status)}
                </p>
                {isActive && statusDate && (
                  <p className="text-sm text-gray-500">
                    {new Date(statusDate).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                {isCurrent && <p className="text-sm text-blue-600 font-medium mt-1">{timelineT('lastUpdate')}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
