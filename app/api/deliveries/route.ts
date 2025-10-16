// Deliveries API. Where delivery requests are born. It's a beautiful thing, really.
// People send us data, we validate it, calculate prices, and save it to a database.
// Then we return a tracking ID. The circle of life, but for packages.
import dbConnect from '@/lib/mongodb';
import { calculateDeliveryPrice, getEstimatedDeliveryTime } from '@/lib/pricing';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

// Type definitions. Because TypeScript demands we label everything like it's kindergarten.
type UrgencyOption = 'standard' | 'express' | 'urgent' | 'scheduled'; // How fast you want it. Spoiler: you always want it urgent.
type PackageSizeOption = 'small' | 'medium' | 'large' | 'extra-large'; // Size. Matters. Allegedly.
type Coordinate = { lat: number; lng: number }; // GPS coordinates. Latitude, longitude. Like finding buried treasure, but boring.

// Allowed values. Because people will send you ANYTHING if you don't stop them.
const ALLOWED_URGENCY: UrgencyOption[] = ['standard', 'express', 'urgent', 'scheduled']; // The four horsemen of delivery speed
const ALLOWED_PACKAGE_SIZES: PackageSizeOption[] = ['small', 'medium', 'large', 'extra-large']; // Four sizes. That's it. Pick one.
const AVERAGE_SPEED_KMH = 30; // 30 km/h average speed. In a city. Optimistic, if you ask me.

// Route details. What the map API tells us. Or what we make up. Depends on the day.
interface RouteDetailsPayload {
  distanceText?: string; // "5.3 km" - distance but with words
  durationText?: string; // "12 min" - time but with words
  estimated?: boolean; // Translation: "We're guessing"
  polyline?: string; // Encoded route line. Looks like gibberish. It's not gibberish. It's map data.
}

// POST endpoint. This is where delivery requests come to be born.
// People send us a bunch of data, we validate it like we're the TSA, then save it.
export async function POST(request: NextRequest) {
  try {
    // First, connect to the database. Can't save anything if we're not connected.
    // It's like trying to write a letter without paper. Doesn't work.
    await dbConnect();

    const body = await request.json();
    const {
      senderName,
      senderPhone,
      senderAddress,
      senderLocation,
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverLocation,
      packageType,
      packageSize,
      packageDescription,
      urgency = 'standard',
      pickupTime,
      notes,
      locale = 'en',
      serviceCountry,
      serviceCity,
      distance,
      duration,
      routePolyline,
      scheduledPickupDate,
      scheduledPickupTime,
      scheduledDeliveryDate,
      scheduledDeliveryTime,
    } = body;

    const routeDetails = (body.routeDetails || {}) as RouteDetailsPayload;

    // Validate required string fields
    if (typeof senderName !== 'string' || !senderName.trim() ||
        typeof senderPhone !== 'string' || !senderPhone.trim() ||
        typeof senderAddress !== 'string' || !senderAddress.trim()) {
      return NextResponse.json(
        { error: 'Sender information is required' },
        { status: 400 }
      );
    }

    if (typeof receiverName !== 'string' || !receiverName.trim() ||
        typeof receiverPhone !== 'string' || !receiverPhone.trim() ||
        typeof receiverAddress !== 'string' || !receiverAddress.trim()) {
      return NextResponse.json(
        { error: 'Receiver information is required' },
        { status: 400 }
      );
    }

    if (typeof packageType !== 'string' || !packageType.trim() ||
        typeof packageSize !== 'string' || !packageSize.trim()) {
      return NextResponse.json(
        { error: 'Package information is required' },
        { status: 400 }
      );
    }

    const urgencyCandidate = typeof urgency === 'string' ? urgency.trim() : 'standard';
    const normalizedUrgency = (ALLOWED_URGENCY.includes(urgencyCandidate as UrgencyOption)
      ? (urgencyCandidate as UrgencyOption)
      : 'standard');

    const packageSizeCandidate = typeof packageSize === 'string'
      ? packageSize.trim().toLowerCase()
      : 'small';
    const normalizedPackageSize = (ALLOWED_PACKAGE_SIZES.includes(packageSizeCandidate as PackageSizeOption)
      ? (packageSizeCandidate as PackageSizeOption)
      : 'small');

    const sanitizedPackageType = packageType.trim();
    const sanitizedPickupTime = typeof pickupTime === 'string' && pickupTime.trim()
      ? pickupTime.trim()
      : (normalizedUrgency === 'scheduled' ? 'scheduled' : 'asap');

    const sanitizedServiceCountry = typeof serviceCountry === 'string' && serviceCountry.trim()
      ? serviceCountry.trim().toUpperCase()
      : undefined;

    const sanitizedServiceCity = typeof serviceCity === 'string' && serviceCity.trim()
      ? serviceCity.trim()
      : undefined;

    // Distance & duration calculations
    let computedDistance = typeof distance === 'number' && distance > 0 ? distance : undefined;
    let distanceEstimated = routeDetails.estimated ?? false;

    if (!computedDistance && isValidCoordinate(senderLocation) && isValidCoordinate(receiverLocation)) {
      computedDistance = calculateStraightLineDistance(senderLocation, receiverLocation);
      distanceEstimated = true;
    }

    if (!computedDistance || computedDistance <= 0) {
      return NextResponse.json(
        { error: 'Unable to determine distance for this delivery' },
        { status: 400 }
      );
    }

    let computedDuration = typeof duration === 'number' && duration > 0
      ? Math.ceil(duration)
      : Math.max(1, Math.ceil(computedDistance / AVERAGE_SPEED_KMH * 60));

    const routeDistanceText = typeof routeDetails.distanceText === 'string'
      ? routeDetails.distanceText
      : typeof body.distanceText === 'string'
        ? body.distanceText
        : undefined;

    const routeDurationText = typeof routeDetails.durationText === 'string'
      ? routeDetails.durationText
      : typeof body.durationText === 'string'
        ? body.durationText
        : undefined;

    const polyline = typeof routePolyline === 'string'
      ? routePolyline
      : typeof routeDetails.polyline === 'string'
        ? routeDetails.polyline
        : undefined;

    const scheduledPickup = combineDateAndTime(scheduledPickupDate, scheduledPickupTime);
    const scheduledDelivery = combineDateAndTime(scheduledDeliveryDate, scheduledDeliveryTime);

    const pricing = calculateDeliveryPrice({
      distance: Number(computedDistance.toFixed(2)),
      urgency: normalizedUrgency,
      packageSize: normalizedPackageSize,
      scheduledPickupDate: scheduledPickup,
    });

    const rawSubtotal =
      pricing.basePrice +
      pricing.distancePrice +
      pricing.packageSizePrice +
      pricing.urgencyPrice +
      pricing.scheduledPrice;

    const minimumAdjustment = Number((pricing.totalPrice - rawSubtotal).toFixed(2));
    const minimumPriceApplied = minimumAdjustment > 0.009;

    const estimatedDelivery = getEstimatedDeliveryTime(
      Number(computedDistance.toFixed(2)),
      normalizedUrgency,
      scheduledDelivery ?? scheduledPickup
    );

    // Generate unique tracking ID
    let trackingId = generateTrackingId();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await DeliveryRequest.findOne({ trackingId });
      if (!existing) break;
      trackingId = generateTrackingId();
      attempts++;
    }

    const delivery = await DeliveryRequest.create({
      trackingId,
      status: 'pending',
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      senderAddress: senderAddress.trim(),
      senderLocation: isValidCoordinate(senderLocation) ? senderLocation : undefined,
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      receiverAddress: receiverAddress.trim(),
      receiverLocation: isValidCoordinate(receiverLocation) ? receiverLocation : undefined,
      packageType: sanitizedPackageType,
      packageSize: normalizedPackageSize,
      packageDescription: typeof packageDescription === 'string' ? packageDescription : '',
      urgency: normalizedUrgency,
      pickupTime: sanitizedPickupTime,
      scheduledPickupDate: scheduledPickup ?? undefined,
      scheduledDeliveryDate: scheduledDelivery ?? undefined,
      notes: typeof notes === 'string' ? notes : '',
      serviceCountry: sanitizedServiceCountry,
      serviceCity: sanitizedServiceCity,
      distance: Number(computedDistance.toFixed(2)),
      duration: computedDuration,
      distanceText: routeDistanceText,
      durationText: routeDurationText,
      distanceEstimated: distanceEstimated,
      routePolyline: polyline,
      price: pricing.totalPrice,
      courierEarnings: pricing.courierEarnings,
      platformFee: pricing.platformFee,
      basePrice: pricing.basePrice,
      distancePrice: pricing.distancePrice,
      urgencyPrice: pricing.urgencyPrice,
      scheduledPrice: pricing.scheduledPrice,
      packageSizePrice: pricing.packageSizePrice,
      minimumAdjustment: minimumPriceApplied ? minimumAdjustment : 0,
      minimumPriceApplied,
      estimatedDelivery,
      locale: typeof locale === 'string' && locale ? locale : 'en',
    });

    return NextResponse.json(
      {
        success: true,
        trackingId: delivery.trackingId,
        price: delivery.price,
        pricing,
        distance: delivery.distance,
        duration: delivery.duration,
        minimumPriceApplied,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create delivery error:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery request', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/deliveries - List deliveries (for admin or testing)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query = status ? { status } : {};
    const deliveries = await DeliveryRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');

    return NextResponse.json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error: any) {
    console.error('Get deliveries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries', details: error.message },
      { status: 500 }
    );
  }
}

// Helpers
function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'CC-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function combineDateAndTime(dateStr?: string, timeStr?: string): Date | undefined {
  if (typeof dateStr !== 'string' || !dateStr) {
    return undefined;
  }

  const safeTime = typeof timeStr === 'string' && timeStr ? timeStr : '12:00';
  const isoString = `${dateStr}T${safeTime}`;
  const parsed = new Date(isoString);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

function isValidCoordinate(value: unknown): value is Coordinate {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.lat === 'number' && !Number.isNaN(candidate.lat) &&
    typeof candidate.lng === 'number' && !Number.isNaN(candidate.lng)
  );
}

function calculateStraightLineDistance(point1: Coordinate, point2: Coordinate): number {
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
