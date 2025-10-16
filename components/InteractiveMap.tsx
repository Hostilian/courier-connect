'use client';

import { loadGoogleMaps } from '@/lib/maps';
import { Loader2, MapPin, Navigation, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface InteractiveMapProps {
  onOriginSelect?: (location: Location) => void;
  onDestinationSelect?: (location: Location) => void;
  initialOrigin?: Location;
  initialDestination?: Location;
  mode?: 'select-origin' | 'select-destination' | 'view-route';
  showMyLocation?: boolean;
  height?: string;
  className?: string;
}

export default function InteractiveMap({
  onOriginSelect,
  onDestinationSelect,
  initialOrigin,
  initialDestination,
  mode = 'view-route',
  showMyLocation = true,
  height = '500px',
  className = '',
}: InteractiveMapProps) {
  const t = useTranslations('maps');
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(mode);
  const [origin, setOrigin] = useState<Location | undefined>(initialOrigin);
  const [destination, setDestination] = useState<Location | undefined>(initialDestination);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const myLocationMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Get user's current location
  const getMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMyLocation(loc);
          if (map) {
            map.panTo(loc);
            map.setZoom(14);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, [map]);

  // Reverse geocode to get address from coordinates
  const getAddressFromCoords = async (
    google: any,
    lat: number,
    lng: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            resolve(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        }
      );
    });
  };

  // Search for places
  const searchPlaces = async (query: string) => {
    if (!query || !map) return;
    
    try {
      const google = await loadGoogleMaps();
      const service = new google.maps.places.PlacesService(map);
      
      service.textSearch(
        {
          query,
          location: map.getCenter(),
          radius: 50000,
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setSearchResults(results.slice(0, 5));
          }
        }
      );
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle map click
  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const google = await loadGoogleMaps();
      const address = await getAddressFromCoords(google, lat, lng);

      const location: Location = { lat, lng, address };

      if (selecting === 'select-origin') {
        setOrigin(location);
        if (onOriginSelect) onOriginSelect(location);
        setSelecting('select-destination');
      } else if (selecting === 'select-destination') {
        setDestination(location);
        if (onDestinationSelect) onDestinationSelect(location);
        setSelecting('view-route');
      }
    },
    [selecting, onOriginSelect, onDestinationSelect]
  );

  // Calculate and display route
  const calculateRoute = useCallback(async () => {
    if (!origin || !destination || !map) return;

    try {
      const google = await loadGoogleMaps();
      
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#3B82F6',
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        });
      }

      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRendererRef.current?.setDirections(result);
            
            const route = result.routes[0];
            const leg = route.legs[0];
            setRouteInfo({
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || '',
            });
          }
        }
      );
    } catch (error) {
      console.error('Route calculation error:', error);
    }
  }, [origin, destination, map]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const google = await loadGoogleMaps();
        
        if (!isMounted) return;

        const mapInstance = new google.maps.Map(mapRef.current!, {
          center: initialOrigin || initialDestination || { lat: 50.0755, lng: 14.4378 }, // Prague default
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
          ],
        });

        setMap(mapInstance);

        // Add click listener for selecting locations
        mapInstance.addListener('click', handleMapClick);

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
  }, [handleMapClick, initialOrigin, initialDestination]);

    // Update markers and route when origin/destination changes
  useEffect(() => {
    if (!map) return;

    const updateMapElements = async () => {
      const google = await loadGoogleMaps();

            // Clear existing route
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(null);
      }
      setRouteInfo(null);

      // Origin marker
      if (origin) {
        if (originMarkerRef.current) {
          originMarkerRef.current.setPosition(origin);
        } else {
          originMarkerRef.current = new google.maps.Marker({
            position: origin,
            map,
            title: 'Origin',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            },
          });
        }
      } else {
        originMarkerRef.current?.setMap(null);
        originMarkerRef.current = null;
      }

      // Destination marker
      if (destination) {
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.setPosition(destination);
        } else {
          destinationMarkerRef.current = new google.maps.Marker({
            position: destination,
            map,
            title: 'Destination',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          });
        }
      } else {
        destinationMarkerRef.current?.setMap(null);
        destinationMarkerRef.current = null;
      }

      // Calculate route if both are set
      if (origin && destination) {
        calculateRoute();
        
        // Fit map to bounds
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(origin.lat, origin.lng));
        bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));
        map.fitBounds(bounds);
      } else if (origin) {
        map.panTo(origin);
      } else if (destination) {
        map.panTo(destination);
      }
    };

    updateMapElements();
  }, [origin, destination, map, calculateRoute]);

  // Update my location marker
  useEffect(() => {
    if (!map || !myLocation) return;

    const updateMyLocationMarker = async () => {
      const google = await loadGoogleMaps();

      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setPosition(myLocation);
      } else {
        myLocationMarkerRef.current = new google.maps.Marker({
          position: myLocation,
          map,
          title: t('useCurrentLocation'),
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
      }
    };

    updateMyLocationMarker();
  }, [map, myLocation, t]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchPlaces(query);
    } else {
      setSearchResults([]);
    }
  };

  // Select search result
  const selectSearchResult = async (place: any) => {
    const location: Location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address || place.name,
    };

    if (selecting === 'select-origin') {
      setOrigin(location);
      if (onOriginSelect) onOriginSelect(location);
      setSelecting('select-destination');
    } else if (selecting === 'select-destination') {
      setDestination(location);
      if (onDestinationSelect) onDestinationSelect(location);
      setSelecting('view-route');
    }

    setSearchQuery('');
    setSearchResults([]);
    
    if (map) {
      map.panTo(location);
      map.setZoom(15);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
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

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex gap-2">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={
                selecting === 'select-origin'
                  ? t('searchOrigin') || 'Search pickup location...'
                  : selecting === 'select-destination'
                  ? t('searchDestination') || 'Search delivery location...'
                  : t('searchAddress') || 'Search for a location...'
              }
              className="flex-1 outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 border-t pt-2 space-y-1">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  <div className="font-medium">{result.name}</div>
                  <div className="text-xs text-gray-500">{result.formatted_address}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Location Button */}
      {showMyLocation && (
        <button
          onClick={getMyLocation}
          className="absolute bottom-24 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          title={t('useCurrentLocation')}
        >
          <Navigation className="w-5 h-5 text-blue-600" />
        </button>
      )}

      {/* Route Info */}
      {routeInfo && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">{t('distance')}</div>
              <div className="text-lg font-bold text-blue-600">{routeInfo.distance}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{t('duration')}</div>
              <div className="text-lg font-bold text-green-600">{routeInfo.duration}</div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Mode Indicator */}
      {selecting !== 'view-route' && (
        <div className="absolute top-20 left-4 right-4 bg-blue-600 text-white rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">
            {selecting === 'select-origin'
              ? `📍 ${t('selectOrigin') || 'Click on the map to select pickup location'}`
              : `📍 ${t('selectDestination') || 'Click on the map to select delivery location'}`}
          </p>
        </div>
      )}

      {/* Selected Locations */}
      {(origin || destination) && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-lg shadow-lg p-3 mt-16">
          {origin && (
            <div className="mb-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500">{t('origin')}</div>
                  <div className="text-sm font-medium">{origin.address}</div>
                </div>
              </div>
            </div>
          )}
          {destination && (
            <div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  B
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500">{t('destination')}</div>
                  <div className="text-sm font-medium">{destination.address}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
