import { NextRequest, NextResponse } from 'next/server';

interface CalculateDistanceRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

type Bounds = {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
};

/**
 * Calculate distance and route between two points
 * POST /api/maps/distance
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculateDistanceRequest = await request.json();
    const { origin, destination } = body;

    // Validate input
    if (
      !origin ||
      !destination ||
      typeof origin.lat !== 'number' ||
      typeof origin.lng !== 'number' ||
      typeof destination.lat !== 'number' ||
      typeof destination.lng !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Origin and destination coordinates are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      // Fallback to straight-line distance calculation
      const distance = calculateStraightLineDistance(origin, destination);
      const durationMinutes = Math.max(1, Math.ceil((distance / 30) * 60));
      return NextResponse.json({
        distance,
        duration: durationMinutes,
        estimated: true,
        distanceText: `${distance.toFixed(1)} km`,
        durationText: `${durationMinutes} min`,
        message: 'Using estimated straight-line distance',
      });
    }

    // Use Google Maps Distance Matrix API for precise values
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.append('origins', `${origin.lat},${origin.lng}`);
    url.searchParams.append('destinations', `${destination.lat},${destination.lng}`);
    url.searchParams.append('mode', 'driving');
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      return fallbackResponse(origin, destination);
    }

    const element = data.rows[0]?.elements[0];

    if (!element || element.status !== 'OK' || !element.distance || !element.duration) {
      return fallbackResponse(origin, destination);
    }

    // Distance in kilometers
    const distance = element.distance.value / 1000;
    // Duration in minutes
    const duration = Math.ceil(element.duration.value / 60);

    let polyline: string | undefined;
    let bounds: Bounds | undefined;

    try {
      const directionsUrl = new URL('https://maps.googleapis.com/maps/api/directions/json');
      directionsUrl.searchParams.append('origin', `${origin.lat},${origin.lng}`);
      directionsUrl.searchParams.append('destination', `${destination.lat},${destination.lng}`);
      directionsUrl.searchParams.append('mode', 'driving');
      directionsUrl.searchParams.append('key', apiKey);

      const directionsRes = await fetch(directionsUrl.toString());
      const directionsData = await directionsRes.json();

      if (directionsData.status === 'OK' && directionsData.routes?.length > 0) {
        const route = directionsData.routes[0];
        polyline = route.overview_polyline?.points;
        if (route.bounds) {
          bounds = {
            northeast: route.bounds.northeast,
            southwest: route.bounds.southwest,
          };
        }
      }
    } catch (directionsError) {
      console.error('Directions fetch error:', directionsError);
    }

    return NextResponse.json({
      distance: Number(distance.toFixed(2)),
      duration,
      estimated: false,
      distanceText: element.distance.text,
      durationText: element.duration.text,
      polyline,
      bounds,
    });

  } catch (error) {
    console.error('Distance calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 }
    );
  }
}

function fallbackResponse(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
  const distance = calculateStraightLineDistance(origin, destination);
  const durationMinutes = Math.max(1, Math.ceil((distance / 30) * 60));

  return NextResponse.json({
    distance,
    duration: durationMinutes,
    estimated: true,
    distanceText: `${distance.toFixed(1)} km`,
    durationText: `${durationMinutes} min`,
    message: 'Using estimated distance',
  });
}

/**
 * Calculate straight-line distance using Haversine formula
 */
function calculateStraightLineDistance(
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
