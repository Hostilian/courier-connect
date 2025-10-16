'use client';

import { loadGoogleMaps } from '@/lib/maps';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DeliveryMapProps {
  origin: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  showRoute?: boolean;
  height?: string;
  className?: string;
}

export default function DeliveryMap({
  origin,
  destination,
  showRoute = true,
  height = '400px',
  className = '',
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let isMounted = true;

    const initializeMap = async () => {
      try {
        const google = await loadGoogleMaps();
        
        if (!isMounted) return;

        // Calculate center point between origin and destination
        const centerLat = (origin.lat + destination.lat) / 2;
        const centerLng = (origin.lng + destination.lng) / 2;

        // Initialize map
        const mapInstance = new google.maps.Map(mapRef.current!, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        setMap(mapInstance);

        // Add origin marker (green)
        new google.maps.Marker({
          position: origin,
          map: mapInstance,
          title: 'Pickup Location',
          label: 'A',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          },
        });

        // Add destination marker (red)
        new google.maps.Marker({
          position: destination,
          map: mapInstance,
          title: 'Delivery Location',
          label: 'B',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });

        // Show route if requested
        if (showRoute) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: true, // We already have custom markers
            polylineOptions: {
              strokeColor: '#3B82F6',
              strokeWeight: 4,
            },
          });

          const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService.route(
              {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === 'OK' && result) {
                  resolve(result);
                } else {
                  reject(new Error(`Directions failed: ${status}`));
                }
              }
            );
          });

          directionsRenderer.setDirections(result);

          // Extract distance and duration
          const route = result.routes[0];
          const leg = route.legs[0];
          setDistance(leg.distance?.text || null);
          setDuration(leg.duration?.text || null);

          // Fit bounds to show entire route
          if (route.bounds) {
            mapInstance.fitBounds(route.bounds);
          }
        } else {
          // Just fit bounds to show both markers
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(origin);
          bounds.extend(destination);
          mapInstance.fitBounds(bounds);
        }

        setLoading(false);
      } catch (err) {
        console.error('Map initialization error:', err);
        if (isMounted) {
          setError('Failed to load map. Please check your internet connection.');
          setLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
    };
  }, [origin, destination, showRoute]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden border border-gray-300"
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && showRoute && (distance || duration) && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="flex items-center gap-3">
            {distance && (
              <div>
                <p className="text-xs text-gray-500">Distance</p>
                <p className="text-sm font-semibold text-gray-900">{distance}</p>
              </div>
            )}
            {duration && (
              <div className="border-l pl-3 border-gray-200">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{duration}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Pickup</p>
              <p className="text-sm text-gray-900 truncate">{origin.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Delivery</p>
              <p className="text-sm text-gray-900 truncate">{destination.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
