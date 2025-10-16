'use client';

import { loadGoogleMaps } from '@/lib/maps';
import { Loader2, MapPin, Phone, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface DeliveryTracking {
  trackingId: string;
  status: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderLocation?: { lat: number; lng: number };
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverLocation?: { lat: number; lng: number };
  courierName?: string;
  courierPhone?: string;
  courierLocation?: { lat: number; lng: number };
  estimatedDelivery?: string;
  distance?: string;
  duration?: string;
}

interface LiveTrackingMapProps {
  delivery: DeliveryTracking;
  showCourierLocation?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  height?: string;
}

export default function LiveTrackingMap({
  delivery,
  showCourierLocation = true,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  height = '600px',
}: LiveTrackingMapProps) {
  const t = useTranslations();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const courierMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const google = await loadGoogleMaps();
        
        if (!isMounted) return;

        // Calculate center between origin and destination
        const origin = delivery.senderLocation;
        const destination = delivery.receiverLocation;
        
        let center = { lat: 50.0755, lng: 14.4378 }; // Default: Prague
        
        if (origin && destination) {
          center = {
            lat: (origin.lat + destination.lat) / 2,
            lng: (origin.lng + destination.lng) / 2,
          };
        } else if (origin) {
          center = origin;
        } else if (destination) {
          center = destination;
        }

        const mapInstance = new google.maps.Map(mapRef.current!, {
          center,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'simplified' }],
            },
          ],
        });

        setMap(mapInstance);
        setLoading(false);
      } catch (error) {
        console.error('Map initialization error:', error);
        setLoading(false);
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [delivery]);

  // Update markers and route
  useEffect(() => {
    if (!map) return;

    const updateMapContent = async () => {
      const google = await loadGoogleMaps();

      // Origin marker (Pickup)
      if (delivery.senderLocation) {
        if (originMarkerRef.current) {
          originMarkerRef.current.setPosition(delivery.senderLocation);
        } else {
          originMarkerRef.current = new google.maps.Marker({
            position: delivery.senderLocation,
            map,
            title: `Pickup: ${delivery.senderAddress}`,
            label: 'A',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            },
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold mb-1">📦 Pickup Location</h3>
                <p class="text-sm">${delivery.senderName}</p>
                <p class="text-sm text-gray-600">${delivery.senderAddress}</p>
              </div>
            `,
          });

          originMarkerRef.current.addListener('click', () => {
            infoWindow.open(map, originMarkerRef.current!);
          });
        }
      }

      // Destination marker (Delivery)
      if (delivery.receiverLocation) {
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.setPosition(delivery.receiverLocation);
        } else {
          destinationMarkerRef.current = new google.maps.Marker({
            position: delivery.receiverLocation,
            map,
            title: `Delivery: ${delivery.receiverAddress}`,
            label: 'B',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold mb-1">🏁 Delivery Location</h3>
                <p class="text-sm">${delivery.receiverName}</p>
                <p class="text-sm text-gray-600">${delivery.receiverAddress}</p>
              </div>
            `,
          });

          destinationMarkerRef.current.addListener('click', () => {
            infoWindow.open(map, destinationMarkerRef.current!);
          });
        }
      }

      // Courier marker (Live location)
      if (showCourierLocation && delivery.courierLocation) {
        if (courierMarkerRef.current) {
          courierMarkerRef.current.setPosition(delivery.courierLocation);
        } else {
          // Custom courier icon (animated)
          courierMarkerRef.current = new google.maps.Marker({
            position: delivery.courierLocation,
            map,
            title: `Courier: ${delivery.courierName || 'On the way'}`,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            },
            animation: google.maps.Animation.BOUNCE,
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold mb-1">🚗 Courier Location</h3>
                <p class="text-sm">${delivery.courierName || 'Your courier'}</p>
                ${delivery.courierPhone ? `<p class="text-sm text-gray-600">📞 ${delivery.courierPhone}</p>` : ''}
                <p class="text-xs text-blue-600 mt-1">Live tracking</p>
              </div>
            `,
          });

          courierMarkerRef.current.addListener('click', () => {
            infoWindow.open(map, courierMarkerRef.current!);
          });

          // Stop bouncing after 3 seconds
          setTimeout(() => {
            if (courierMarkerRef.current) {
              courierMarkerRef.current.setAnimation(null);
            }
          }, 3000);
        }
      }

      // Draw route
      if (delivery.senderLocation && delivery.receiverLocation) {
        if (!directionsRendererRef.current) {
          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#3B82F6',
              strokeWeight: 4,
              strokeOpacity: 0.7,
            },
          });
        }

        const directionsService = new google.maps.DirectionsService();
        
        directionsService.route(
          {
            origin: delivery.senderLocation,
            destination: delivery.receiverLocation,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              directionsRendererRef.current?.setDirections(result);
            }
          }
        );

        // Fit bounds to show all markers
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(delivery.senderLocation);
        bounds.extend(delivery.receiverLocation);
        if (delivery.courierLocation) {
          bounds.extend(delivery.courierLocation);
        }
        map.fitBounds(bounds);
      }
    };

    updateMapContent();
  }, [map, delivery, showCourierLocation]);

  // Auto-refresh courier location
  useEffect(() => {
    if (!autoRefresh || delivery.status === 'delivered' || delivery.status === 'cancelled') {
      return;
    }

    const interval = setInterval(() => {
      // In a real app, fetch updated courier location from API
      // fetchCourierLocation(delivery.trackingId);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, delivery.status, delivery.trackingId]);

  // Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="relative">
      {/* Map */}
      <div
        ref={mapRef}
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden border-2 border-gray-300"
      />

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Delivery Info Card */}
      <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">📦 {delivery.trackingId}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
            {delivery.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Pickup Info */}
        <div className="mb-3 pb-3 border-b">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Pickup</div>
              <div className="text-sm font-medium flex items-center gap-1">
                <User className="w-3 h-3" />
                {delivery.senderName}
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {delivery.senderAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mb-3 pb-3 border-b">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              B
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Delivery</div>
              <div className="text-sm font-medium flex items-center gap-1">
                <User className="w-3 h-3" />
                {delivery.receiverName}
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {delivery.receiverAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Courier Info */}
        {delivery.courierName && (
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="text-xs text-blue-700 font-medium mb-1">Your Courier</div>
            <div className="text-sm font-bold text-blue-900">{delivery.courierName}</div>
            {delivery.courierPhone && (
              <a
                href={`tel:${delivery.courierPhone}`}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
              >
                <Phone className="w-3 h-3" />
                {delivery.courierPhone}
              </a>
            )}
          </div>
        )}

        {/* ETA */}
        {delivery.estimatedDelivery && (
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500">Estimated Delivery</div>
            <div className="text-lg font-bold text-green-600">
              {new Date(delivery.estimatedDelivery).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        )}

        {/* Distance & Duration */}
        {(delivery.distance || delivery.duration) && (
          <div className="mt-3 flex gap-4 text-center">
            {delivery.distance && (
              <div className="flex-1">
                <div className="text-xs text-gray-500">Distance</div>
                <div className="text-sm font-bold">{delivery.distance}</div>
              </div>
            )}
            {delivery.duration && (
              <div className="flex-1">
                <div className="text-xs text-gray-500">Duration</div>
                <div className="text-sm font-bold">{delivery.duration}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Indicator */}
      {showCourierLocation && delivery.courierLocation && delivery.status === 'in_transit' && (
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live Tracking</span>
        </div>
      )}
    </div>
  );
}
