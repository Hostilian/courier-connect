import { loadGoogleMaps } from '@/lib/maps';
import { calculateDeliveryPrice } from '@/lib/pricing';
import { NextRequest, NextResponse } from 'next/server';

interface CalculateRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  urgency: 'standard' | 'express' | 'urgent';
  packageSize: 'small' | 'medium' | 'large' | 'extra-large';
  pickupDateTime?: string | null;
}

/**
 * POST /api/deliveries/calculate
 * Calculate delivery route and pricing
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculateRequest = await request.json();
    const { origin, destination, urgency, packageSize, pickupDateTime } = body;

    // Validate inputs
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      return NextResponse.json(
        { error: 'Missing origin or destination coordinates' },
        { status: 400 }
      );
    }

    const google = await loadGoogleMaps();
    const directionsService = new google.maps.DirectionsService();

    const directionsRequest: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode: google.maps.TravelMode.DRIVING,
    };

    const directionsResult = await directionsService.route(directionsRequest);
    const route = directionsResult.routes?.[0]?.legs?.[0];

    if (!route || !route.distance || !route.duration) {
      return NextResponse.json(
        { error: 'Could not calculate route between the addresses.' },
        { status: 400 }
      );
    }

    const distanceInKm = route.distance.value / 1000;
    const durationInSeconds = route.duration.value;

    // Calculate pricing
    const pricing = calculateDeliveryPrice({
      distance: distanceInKm,
      urgency,
      packageSize,
      pickupDateTime: pickupDateTime ? new Date(pickupDateTime) : undefined,
    });

    return NextResponse.json({
      route: {
        distance: distanceInKm,
        duration: durationInSeconds,
        distanceText: route.distance.text,
        durationText: route.duration.text,
        polyline: directionsResult.routes?.[0]?.overview_polyline,
        estimated: false,
      },
      pricing,
    });
  } catch (error) {
    console.error('Calculate route error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate delivery details' },
      { status: 500 }
    );
  }
}
