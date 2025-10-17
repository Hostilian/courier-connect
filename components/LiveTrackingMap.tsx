'use client';

import { getLanguageByCode } from '@/lib/languages';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
  minHeight: '400px',
};

interface LiveTrackingMapProps {
  deliveryId: string;
  initialCourierLocation?: { lat: number; lng: number };
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  routePolyline?: string;
}

export default function LiveTrackingMap({
  deliveryId,
  initialCourierLocation,
  origin,
  destination,
  routePolyline,
}: LiveTrackingMapProps) {
  const t = useTranslations('tracking');
  const locale = useLocale();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['geometry'], // Needed for decoding polyline
  });

  const [courierLocation, setCourierLocation] = useState(initialCourierLocation);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Make sure we don't create a million socket connections
    if (socketRef.current) return;

    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socketio',
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('customer:join', { deliveryId });
    });

    socket.on('courier:location', (locationData: { location: { lat: number; lng: number } }) => {
      console.log('Received courier location update:', locationData.location);
      setCourierLocation(locationData.location);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection.');
        socketRef.current.emit('leave_delivery_room', deliveryId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [deliveryId]);

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (isLoaded) {
      const bounds = new google.maps.LatLngBounds();
      if (origin) bounds.extend(new google.maps.LatLng(origin.lat, origin.lng));
      if (destination) bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));
      if (courierLocation) {
        bounds.extend(new google.maps.LatLng(courierLocation.lat, courierLocation.lng));
      }
      map.fitBounds(bounds);
    }
  };
  
  const decodedPath = useMemo(() => {
    if (!isLoaded || !routePolyline) return [];
    return google.maps.geometry.encoding.decodePath(routePolyline);
  }, [isLoaded, routePolyline]);

  if (loadError) {
    return <div className="text-red-500 font-semibold p-4">{t('mapLoadError')}</div>;
  }

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-96">{t('loadingMap')}...</div>;
  }

  return (
    <div className="relative h-full w-full" style={{ minHeight: '400px' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [ // Adding a subtle map style
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ "color": "#7c93a3" }, { "lightness": "-10" }]
            },
            {
              featureType: 'poi',
              elementType: 'labels.icon',
              stylers: [{ "visibility": "off" }]
            },
          ]
        }}
      >
        {origin && <Marker position={origin} icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: theme?.secondary || '#FF6B6B',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: 'white',
        }} />}
        
        {destination && <Marker position={destination} icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: theme?.accent || '#3B82F6',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: 'white',
        }} />}
        
        {courierLocation && (
           <Marker
             position={courierLocation}
             icon={{
               path: 'M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0,0,1.42l9,9a1,1,0,0,0,1.42,0l9-9A1,1,0,0,0,21.71,11.29Z',
               fillColor: theme?.primary || '#FBBF24',
               fillOpacity: 1,
               strokeColor: 'white',
               strokeWeight: 1.5,
               rotation: 0, // This could be updated with courier's heading
               scale: 1.5,
               anchor: new google.maps.Point(12, 12),
             }}
           />
        )}

        {decodedPath.length > 0 && (
          <Polyline
            path={decodedPath}
            options={{
              strokeColor: theme?.primary || '#3B82F6',
              strokeOpacity: 0.7,
              strokeWeight: 5,
            }}
          />
        )}
      </GoogleMap>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg flex items-center gap-3"
      >
        <Truck className="w-6 h-6" style={{ color: theme?.primary || '#3B82F6' }} />
        <div>
          <p className="font-semibold text-gray-800">{t('courierEnRoute')}</p>
          <p className="text-sm text-gray-600">{t('locationUpdatingLive')}</p>
        </div>
      </motion.div>
    </div>
  );
}
