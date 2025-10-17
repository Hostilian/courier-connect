'use client';

import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

interface LiveTrackingMapProps {
  trackingId: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  routePolyline?: string;
}

export default function LiveTrackingMap({ trackingId, origin, destination, routePolyline }: LiveTrackingMapProps) {
  const t = useTranslations('tracking');
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['geometry'],
  });

  const [courierLocation, setCourierLocation] = useState<{ lat: number; lng: number } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!trackingId || typeof window === 'undefined') return;

    const socket = io(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected for tracking:', socket.id);
      socket.emit('join_tracking_room', trackingId);
    });

    socket.on('location_update', (location: { lat: number; lng: number }) => {
      console.log('Received location update:', location);
      setCourierLocation(location);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [trackingId]);

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (typeof window !== 'undefined') {
      const bounds = new window.google.maps.LatLngBounds();
      if (origin) bounds.extend(origin);
      if (destination) bounds.extend(destination);
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (mapRef.current && courierLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      if (origin) bounds.extend(origin);
      if (destination) bounds.extend(destination);
      bounds.extend(courierLocation);
      mapRef.current.fitBounds(bounds);
    }
  }, [courierLocation, origin, destination]);

  const decodedPath = useMemo(() => {
    if (!isLoaded || !routePolyline || typeof window === 'undefined' || !window.google?.maps?.geometry) return [];
    try {
      return window.google.maps.geometry.encoding.decodePath(routePolyline);
    } catch (e) {
      console.error("Error decoding polyline:", e);
      return [];
    }
  }, [isLoaded, routePolyline]);

  if (loadError) {
    return <div className="text-red-500 font-semibold p-4">{t('mapLoadError')}</div>;
  }

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-96">{t('loadingMap')}...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      onLoad={onMapLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {origin && <Marker position={origin} label="P" title="Pickup" />}
      {destination && <Marker position={destination} label="D" title="Delivery" />}
      
      {courierLocation && (
        <Marker
          position={courierLocation}
          icon={{
            path: 'M20.92,12.62A1,1,0,0,0,20,12H18.33V10.5a1,1,0,0,0-2,0V12H7.67V10.5a1,1,0,0,0-2,0V12H4a1,1,0,0,0-1,1.38,3,3,0,0,0,2,2.62V18a1,1,0,0,0,1,1H8a1,1,0,0,0,1-1V17h6v1a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V16a3,3,0,0,0,2-2.62A1,1,0,0,0,20.92,12.62ZM7.5,15A1.5,1.5,0,1,1,9,13.5,1.5,1.5,0,0,1,7.5,15Zm9,0A1.5,1.5,0,1,1,18,13.5,1.5,1.5,0,0,1,16.5,15Z',
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 1.5,
            anchor: (typeof window !== 'undefined') ? new window.google.maps.Point(12, 12) : undefined,
          }}
          title="Courier"
        />
      )}

      {decodedPath.length > 0 && (
        <Polyline
          path={decodedPath}
          options={{
            strokeColor: '#4285F4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  );
}
