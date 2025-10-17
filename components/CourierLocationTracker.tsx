// Courier Location Tracker Component
// For couriers who need to share their GPS location with anxious customers watching a map

'use client';

import { useCourierLocation } from '@/lib/hooks/useCourierLocation';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle,
    MapPin,
    Navigation,
    Pause,
    Play,
    Wifi,
    WifiOff
} from 'lucide-react';
import { useEffect } from 'react';

interface CourierLocationTrackerProps {
  courierId: string; // Who you are
  deliveryId: string; // What delivery you're on
  deliveryStatus: string; // Current status
  autoStart?: boolean; // Auto-start tracking when component mounts
  onTrackingStart?: () => void; // Callback when tracking starts
  onTrackingStop?: () => void; // Callback when tracking stops
}

/**
 * Courier Location Tracker Component
 * 
 * Displays location tracking controls and status for couriers.
 * Automatically broadcasts GPS coordinates via WebSocket.
 * 
 * Usage in courier dashboard:
 * ```tsx
 * <CourierLocationTracker
 *   courierId={user.id}
 *   deliveryId={activeDelivery.id}
 *   deliveryStatus={activeDelivery.status}
 *   autoStart={activeDelivery.status === 'accepted'}
 * />
 * ```
 */
export default function CourierLocationTracker({
  courierId,
  deliveryId,
  deliveryStatus,
  autoStart = false,
  onTrackingStart,
  onTrackingStop,
}: CourierLocationTrackerProps) {
  const {
    isTracking,
    currentLocation,
    error,
    accuracy,
    startTracking,
    stopTracking,
    isSocketConnected,
  } = useCourierLocation({
    courierId,
    deliveryId,
    updateInterval: 5000, // Update every 5 seconds
    highAccuracy: true, // Use GPS for best accuracy
  });

  // Auto-start if requested and status is active
  useEffect(() => {
    const shouldTrack = 
      autoStart && 
      (deliveryStatus === 'accepted' || 
       deliveryStatus === 'picked_up' || 
       deliveryStatus === 'in_transit');

    if (shouldTrack && !isTracking) {
      startTracking();
      onTrackingStart?.();
    } else if (!shouldTrack && isTracking) {
      stopTracking();
      onTrackingStop?.();
    }
  }, [autoStart, deliveryStatus, isTracking]);

  // Manual toggle
  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
      onTrackingStop?.();
    } else {
      startTracking();
      onTrackingStart?.();
    }
  };

  // Get status color
  const getStatusColor = () => {
    if (error) return 'red';
    if (!isSocketConnected) return 'yellow';
    if (isTracking) return 'green';
    return 'gray';
  };

  const statusColor = getStatusColor();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2" style={{
      borderColor: statusColor === 'green' ? '#10B981' :
                   statusColor === 'yellow' ? '#F59E0B' :
                   statusColor === 'red' ? '#EF4444' : '#E5E7EB'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">Location Tracking</h3>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isSocketConnected ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-yellow-600 animate-pulse" />
          )}
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Location Error</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              {error.includes('permission') && (
                <p className="text-xs text-red-600 mt-2">
                  Please enable location permissions in your browser settings.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {!isSocketConnected && !error && (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-2"
          >
            <WifiOff className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Connecting...</p>
              <p className="text-xs text-yellow-700 mt-1">
                Establishing real-time connection
              </p>
            </div>
          </motion.div>
        )}

        {isTracking && isSocketConnected && !error && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg flex items-start gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                Live Tracking Active
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              </p>
              <p className="text-xs text-green-700 mt-1">
                Customer can see your location in real-time
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Location Info */}
      {currentLocation && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Current Position</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Latitude:</span>
              <span className="ml-2 font-mono text-gray-900">
                {currentLocation.lat.toFixed(6)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Longitude:</span>
              <span className="ml-2 font-mono text-gray-900">
                {currentLocation.lng.toFixed(6)}
              </span>
            </div>
          </div>
          {accuracy !== null && (
            <p className="text-xs text-gray-600 mt-2">
              Accuracy: ±{accuracy.toFixed(0)} meters
              {accuracy < 50 && <span className="text-green-600 ml-1">✓ Excellent</span>}
              {accuracy >= 50 && accuracy < 100 && <span className="text-yellow-600 ml-1">⚠ Fair</span>}
              {accuracy >= 100 && <span className="text-red-600 ml-1">⚠ Poor</span>}
            </p>
          )}
        </div>
      )}

      {/* Control Button */}
      <button
        onClick={handleToggleTracking}
        disabled={!isSocketConnected && !isTracking}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold text-white
          flex items-center justify-center gap-2
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isTracking 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-green-600 hover:bg-green-700'
          }
        `}
      >
        {isTracking ? (
          <>
            <Pause className="w-5 h-5" />
            Stop Tracking
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start Tracking
          </>
        )}
      </button>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center mt-3">
        {isTracking 
          ? 'Your location is being shared with the customer'
          : 'Start tracking to share your location in real-time'
        }
      </p>
    </div>
  );
}
