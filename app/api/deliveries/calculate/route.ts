import { calculateDeliveryPrice } from '@/lib/pricing';
import { NextRequest, NextResponse } from 'next/server';

interface CalculateRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  urgency: 'standard' | 'express' | 'urgent' | 'scheduled';
  packageSize: 'small' | 'medium' | 'large' | 'extra-large';
  scheduledPickupDate?: string;
}

/**
 * POST /api/deliveries/calculate
 * Calculate delivery route and pricing
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculateRequest = await request.json();
    const { origin, destination, urgency, packageSize, scheduledPickupDate } = body;

    // Validate inputs
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      return NextResponse.json(
        { error: 'Missing origin or destination coordinates' },
        { status: 400 }
      );
    }

    // Calculate straight-line distance (Haversine formula)
    const distance = calculateHaversineDistance(origin, destination);

    // Add 40% to account for roads (rough estimate without actual route calculation)
    const estimatedDistance = distance * 1.4;
    
    // Estimate duration: 30 km/h average city speed
    const estimatedDuration = Math.ceil((estimatedDistance / 30) * 60); // minutes

    // Calculate pricing
    const pricing = calculateDeliveryPrice({
      distance: estimatedDistance,
      urgency,
      packageSize,
      scheduledPickupDate: scheduledPickupDate ? new Date(scheduledPickupDate) : undefined,
    });

    // Format distance and duration text
    const distanceText = estimatedDistance >= 1 
      ? `${estimatedDistance.toFixed(1)} km`
      : `${Math.round(estimatedDistance * 1000)} m`;
    
    const durationText = estimatedDuration >= 60
      ? `${Math.floor(estimatedDuration / 60)}h ${estimatedDuration % 60}m`
      : `${estimatedDuration}m`;

    return NextResponse.json({
      route: {
        distance: estimatedDistance,
        duration: estimatedDuration,
        distanceText,
        durationText,
        estimated: true,
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

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function calculateHaversineDistance(
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
