// Courier location tracking hook
// For couriers who need to broadcast their GPS coordinates to anxious customers

'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';

interface CourierLocationData {
  lat: number; // Latitude. You know, the horizontal lines on maps.
  lng: number; // Longitude. The vertical ones. Geography 101.
}

interface UseCourierLocationOptions {
  courierId: string; // Who you are
  deliveryId: string; // What delivery you're doing
  updateInterval?: number; // How often to send updates (ms). Don't spam.
  highAccuracy?: boolean; // Use GPS instead of cell towers. Battery killer.
}

interface UseCourierLocationReturn {
  isTracking: boolean; // Are we broadcasting location? Probably.
  currentLocation: CourierLocationData | null; // Where you are right now
  error: string | null; // Any GPS errors. There will be errors.
  accuracy: number | null; // How accurate (meters). Could be anywhere from 5m to "somewhere in this city"
  startTracking: () => void; // Begin the surveillance
  stopTracking: () => void; // Stop the surveillance
  isSocketConnected: boolean; // Is WebSocket working? Maybe.
}

/**
 * Hook for courier location tracking
 * 
 * Handles:
 * - Geolocation API access
 * - Real-time position broadcasting via WebSocket
 * - Automatic updates at specified intervals
 * - Error handling (permission denied, GPS unavailable, etc.)
 * 
 * Usage:
 * ```typescript
 * const { isTracking, currentLocation, startTracking, stopTracking } = useCourierLocation({
 *   courierId: 'courier-123',
 *   deliveryId: 'delivery-456',
 *   updateInterval: 5000, // Update every 5 seconds
 * });
 * 
 * // Start when delivery is accepted
 * useEffect(() => {
 *   if (deliveryAccepted) {
 *     startTracking();
 *   }
 * }, [deliveryAccepted]);
 * ```
 */
export function useCourierLocation(
  options: UseCourierLocationOptions
): UseCourierLocationReturn {
  const {
    courierId,
    deliveryId,
    updateInterval = 5000, // Default: update every 5 seconds
    highAccuracy = true, // Default: use high accuracy GPS
  } = options;

  // Socket connection
  const { isConnected, emit, on, off } = useSocket();

  // State
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<CourierLocationData | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for tracking
  const watchIdRef = useRef<number | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastLocationRef = useRef<CourierLocationData | null>(null);

  // Join the delivery room when socket connects
  useEffect(() => {
    if (isConnected && deliveryId) {
      emit('courier:join', { courierId, deliveryId });
      console.log(`Courier ${courierId} joined delivery ${deliveryId}`);
    }
  }, [isConnected, courierId, deliveryId, emit]);

  // Start tracking location
  const startTracking = () => {
    // Check if geolocation is available
    // Not all browsers support it. Looking at you, IE.
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      console.error('Geolocation API not available. What year is this?');
      return;
    }

    // Check if already tracking
    if (isTracking) {
      console.log('Already tracking location. Relax.');
      return;
    }

    setIsTracking(true);
    setError(null);

    // Geolocation options
    const geoOptions: PositionOptions = {
      enableHighAccuracy: highAccuracy, // Use GPS if true, cell towers if false
      timeout: 10000, // 10 second timeout
      maximumAge: 0, // Don't use cached position
    };

    // Success callback
    // We got the coordinates! Miracles do happen.
    const onSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy: posAccuracy, heading, speed } = position.coords;

      const locationData: CourierLocationData = {
        lat: latitude,
        lng: longitude,
      };

      // Update state
      setCurrentLocation(locationData);
      setAccuracy(posAccuracy);
      setError(null);
      lastLocationRef.current = locationData;

      // Emit location to server via WebSocket
      // Send coordinates flying through the internet
      if (isConnected) {
        emit('courier:location', {
          courierId,
          deliveryId,
          location: locationData,
          heading: heading || null, // Direction of travel (degrees)
          speed: speed || null, // Speed in m/s
        });

        console.log(`Location update sent: ${latitude}, ${longitude} (±${posAccuracy}m)`);
      } else {
        console.warn('Socket not connected. Location update not sent.');
      }
    };

    // Error callback
    // Something went wrong. As usual.
    const onError = (err: GeolocationPositionError) => {
      let errorMessage = 'Unknown location error';

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          console.error('User denied location access. Can\'t track if they don\'t let us.');
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location unavailable';
          console.error('GPS unavailable. Maybe they\'re underground?');
          break;
        case err.TIMEOUT:
          errorMessage = 'Location request timeout';
          console.error('GPS timed out. It happens.');
          break;
      }

      setError(errorMessage);
      setIsTracking(false);
    };

    // Watch position for continuous updates
    // Like a stalker, but legal and consensual
    try {
      const watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        geoOptions
      );

      watchIdRef.current = watchId;
      console.log('Started watching courier location');
    } catch (err) {
      console.error('Error starting location watch:', err);
      setError('Failed to start location tracking');
      setIsTracking(false);
    }
  };

  // Stop tracking location
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log('Stopped watching courier location');
    }

    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    setIsTracking(false);
  };

  // Cleanup on unmount
  // Always clean up your mess. Good coding manners.
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    isTracking,
    currentLocation,
    error,
    accuracy,
    startTracking,
    stopTracking,
    isSocketConnected: isConnected,
  };
}
