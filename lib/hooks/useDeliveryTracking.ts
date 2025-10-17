// Customer delivery tracking hook
// For anxious customers who want to watch their package move in real-time

'use client';

import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';

interface CourierLocation {
  lat: number; // Where the courier is (latitude)
  lng: number; // Where the courier is (longitude)
}

interface CourierPositionUpdate {
  courierId: string; // Who's carrying your stuff
  deliveryId: string; // Which delivery
  location: CourierLocation; // Where they are
  heading: number | null; // Direction they're moving (degrees, 0-360)
  speed: number | null; // How fast (meters per second)
  timestamp: number; // When this update happened
}

interface DeliveryStatusUpdate {
  deliveryId: string; // Which delivery
  status: string; // New status (picked_up, in_transit, delivered, etc.)
  courierId: string; // Who updated it
  timestamp: number; // When
}

interface UseDeliveryTrackingOptions {
  trackingId: string; // Customer's tracking ID (CC-XXXXXX)
  deliveryId: string; // Internal delivery ID
  onLocationUpdate?: (location: CourierPositionUpdate) => void; // Callback for location changes
  onStatusUpdate?: (status: DeliveryStatusUpdate) => void; // Callback for status changes
}

interface UseDeliveryTrackingReturn {
  courierLocation: CourierLocation | null; // Current courier position. Null if not started.
  courierHeading: number | null; // Direction courier is moving. For the arrow animation.
  courierSpeed: number | null; // How fast courier is moving. In m/s. Convert to km/h if you want.
  lastUpdate: number | null; // Timestamp of last update. For staleness detection.
  deliveryStatus: string | null; // Current delivery status
  isCourierOnline: boolean; // Is courier connected? Or did they ghost you?
  isConnected: boolean; // Is WebSocket working?
  error: string | null; // Any errors. There's always errors.
}

/**
 * Hook for customer delivery tracking
 * 
 * Real-time updates for:
 * - Courier GPS location
 * - Delivery status changes
 * - Courier online/offline status
 * 
 * Usage:
 * ```typescript
 * const {
 *   courierLocation,
 *   courierHeading,
 *   deliveryStatus,
 *   isCourierOnline,
 *   isConnected
 * } = useDeliveryTracking({
 *   trackingId: 'CC-ABC123',
 *   deliveryId: 'delivery-id-here',
 *   onLocationUpdate: (location) => {
 *     console.log('Courier moved!', location);
 *   },
 *   onStatusUpdate: (status) => {
 *     console.log('Status changed!', status);
 *   }
 * });
 * ```
 */
export function useDeliveryTracking(
  options: UseDeliveryTrackingOptions
): UseDeliveryTrackingReturn {
  const {
    trackingId,
    deliveryId,
    onLocationUpdate,
    onStatusUpdate,
  } = options;

  // Socket connection
  const { isConnected, emit, on, off } = useSocket();

  // State
  const [courierLocation, setCourierLocation] = useState<CourierLocation | null>(null);
  const [courierHeading, setCourierHeading] = useState<number | null>(null);
  const [courierSpeed, setCourierSpeed] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [isCourierOnline, setIsCourierOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join the delivery room when connected
  useEffect(() => {
    if (isConnected && trackingId && deliveryId) {
      emit('customer:join', { trackingId, deliveryId });
      console.log(`Customer joined tracking for ${trackingId}`);
    }
  }, [isConnected, trackingId, deliveryId, emit]);

  // Listen for courier location updates
  useEffect(() => {
    if (!isConnected) return;

    const handleLocationUpdate = (data: CourierPositionUpdate) => {
      // Only process updates for this delivery
      // Don't want to track random other people's deliveries
      if (data.deliveryId !== deliveryId) return;

      setCourierLocation(data.location);
      setCourierHeading(data.heading);
      setCourierSpeed(data.speed);
      setLastUpdate(data.timestamp);
      setError(null);

      // Call callback if provided
      if (onLocationUpdate) {
        onLocationUpdate(data);
      }

      console.log(`Courier location updated: ${data.location.lat}, ${data.location.lng}`);
    };

    on('courier:location', handleLocationUpdate);

    // Cleanup
    return () => {
      off('courier:location', handleLocationUpdate);
    };
  }, [isConnected, deliveryId, onLocationUpdate, on, off]);

  // Listen for delivery status updates
  useEffect(() => {
    if (!isConnected) return;

    const handleStatusUpdate = (data: DeliveryStatusUpdate) => {
      if (data.deliveryId !== deliveryId) return;

      setDeliveryStatus(data.status);

      // Call callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(data);
      }

      console.log(`Delivery status updated: ${data.status}`);
    };

    on('delivery:status', handleStatusUpdate);

    return () => {
      off('delivery:status', handleStatusUpdate);
    };
  }, [isConnected, deliveryId, onStatusUpdate, on, off]);

  // Listen for courier online/offline status
  useEffect(() => {
    if (!isConnected) return;

    const handleCourierOnline = (data: { courierId: string; deliveryId: string }) => {
      if (data.deliveryId !== deliveryId) return;
      setIsCourierOnline(true);
      console.log(`Courier ${data.courierId} is online`);
    };

    const handleCourierOffline = (data: { courierId: string; deliveryId: string }) => {
      if (data.deliveryId !== deliveryId) return;
      setIsCourierOnline(false);
      console.log(`Courier ${data.courierId} went offline`);
    };

    on('courier:online', handleCourierOnline);
    on('courier:offline', handleCourierOffline);

    return () => {
      off('courier:online', handleCourierOnline);
      off('courier:offline', handleCourierOffline);
    };
  }, [isConnected, deliveryId, on, off]);

  // Detect stale location data
  // If no update in 60 seconds, courier might be offline
  useEffect(() => {
    if (!lastUpdate) return;

    const staleCheckInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceUpdate = now - lastUpdate;

      // If more than 60 seconds since last update, assume courier is offline
      if (timeSinceUpdate > 60000 && isCourierOnline) {
        console.warn('No location update in 60s. Courier might be offline.');
        setError('Location updates stopped');
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(staleCheckInterval);
  }, [lastUpdate, isCourierOnline]);

  return {
    courierLocation,
    courierHeading,
    courierSpeed,
    lastUpdate,
    deliveryStatus,
    isCourierOnline,
    isConnected,
    error,
  };
}
