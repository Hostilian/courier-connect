'use client';

import { useAuth } from '@/components/AuthProvider';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface CourierLocationTrackerProps {
  trackingId: string;
  isDeliveryActive: boolean; // To control when to track
}

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

export default function CourierLocationTracker({ trackingId, isDeliveryActive }: CourierLocationTrackerProps) {
  const { user, isLoading } = useAuth(); // Use isLoading from useAuth
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'tracking' | 'error' | 'paused'>('idle');
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading || !user || !trackingId || !isDeliveryActive) {
      if (status === 'tracking') {
        setStatus('paused');
      }
      return;
    }

    if (status === 'tracking' || status === 'connecting') {
      return;
    }

    setStatus('connecting');

    const socket = io(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join_tracking_room', trackingId);
      setStatus('tracking');
      startGeolocationWatcher(socket);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setStatus('paused');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Cannot connect to tracking service.');
      setStatus('error');
    });

    return () => {
      stopGeolocationWatcher();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setStatus('idle');
    };
  }, [trackingId, user, isDeliveryActive, isLoading, status]); // Added isLoading and status to dependency array

  const startGeolocationWatcher = (socket: Socket) => {
    if (watchIdRef.current !== null) return; // Already watching

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          
          socket.emit('courier_location_update', {
            trackingId,
            location,
          });
          setError(null);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError(`Geolocation error: ${err.message}`);
          setStatus('error');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setStatus('error');
    }
  };

  const stopGeolocationWatcher = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'connecting':
        return <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Connecting...</>;
      case 'tracking':
        return <><Wifi className="w-3 h-3 mr-1 text-green-500" /> Tracking Live</>;
      case 'paused':
        return <><WifiOff className="w-3 h-3 mr-1 text-gray-400" /> Tracking Paused</>;
      case 'error':
        return <><WifiOff className="w-3 h-3 mr-1 text-red-500" /> Error</>;
      default:
        return <>Inactive</>;
    }
  };

  return (
    <div className="text-xs text-gray-600 p-2 bg-gray-100 rounded-md flex items-center">
      {getStatusIndicator()}
      {error && <span className="ml-2 text-red-500 truncate" title={error}>{error}</span>}
    </div>
  );
}
