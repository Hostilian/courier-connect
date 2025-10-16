'use client';

let mapsPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(apiKey?: string): Promise<typeof google> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Maps can only load in browser'));
  if ((window as any).google && (window as any).google.maps) {
    return Promise.resolve((window as any).google);
  }
  if (!apiKey) apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  if (!apiKey) return Promise.reject(new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'));

  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve((window as any).google);
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }
  return mapsPromise;
}

export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  polyline: string; // encoded polyline
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

/**
 * Calculate route between two points using Google Maps Directions API
 */
export async function calculateRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<RouteInfo> {
  const google = await loadGoogleMaps();
  const directionsService = new google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          const route = result.routes[0];
          const leg = route.legs[0];

          // Distance in kilometers
          const distance = leg.distance?.value ? leg.distance.value / 1000 : 0;
          
          // Duration in minutes
          const duration = leg.duration?.value ? leg.duration.value / 60 : 0;
          
          // Encoded polyline
          const polyline = route.overview_polyline || '';

          resolve({
            distance: Number(distance.toFixed(2)),
            duration: Math.ceil(duration),
            polyline,
            bounds: {
              northeast: {
                lat: route.bounds?.getNorthEast().lat() || 0,
                lng: route.bounds?.getNorthEast().lng() || 0,
              },
              southwest: {
                lat: route.bounds?.getSouthWest().lat() || 0,
                lng: route.bounds?.getSouthWest().lng() || 0,
              },
            },
          });
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      }
    );
  });
}

/**
 * Calculate straight-line distance between two points (Haversine formula)
 * Used as fallback when Maps API is not available
 */
export function calculateStraightLineDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLon = toRadians(point2.lng - point1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
    Math.cos(toRadians(point2.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Number(distance.toFixed(2));
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

