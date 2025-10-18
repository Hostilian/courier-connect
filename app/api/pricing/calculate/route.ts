import { calculateDeliveryPrice, PricingInput } from '@/lib/pricing';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Calculate delivery price
 * POST /api/pricing/calculate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { distance, urgency, scheduledPickupDate, packageSize } = body;

    // Validate input
    if (typeof distance !== 'number' || distance < 0) {
      return NextResponse.json(
        { error: 'Valid distance is required' },
        { status: 400 }
      );
    }

    if (!urgency || !['standard', 'express', 'urgent', 'scheduled'].includes(urgency)) {
      return NextResponse.json(
        { error: 'Valid urgency level is required' },
        { status: 400 }
      );
    }

    if (!packageSize || !['small', 'medium', 'large', 'extra-large'].includes(packageSize)) {
      return NextResponse.json(
        { error: 'Valid package size is required' },
        { status: 400 }
      );
    }

    const pricingInput: PricingInput = {
      distance,
      urgency,
      packageSize,
      pickupDateTime: scheduledPickupDate ? new Date(scheduledPickupDate) : undefined,
    };

    const pricing = calculateDeliveryPrice(pricingInput);

    return NextResponse.json({
      pricing,
      message: 'Price calculated successfully',
    });

  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate price' },
      { status: 500 }
    );
  }
}

/**
 * Get pricing configuration
 * GET /api/pricing/calculate
 */
export async function GET() {
  try {
    const config = {
      basePrice: 3.00,
      pricePerKm: 0.80,
      minimumPrice: 5.00,
      courierPercentage: 70,
      platformPercentage: 30,
      urgencyMultipliers: {
        standard: '1.0x (No extra charge)',
        express: '1.5x (+50%)',
        urgent: '2.0x (+100%)',
        scheduled: '0.9x (-10% discount)',
      },
      packageSizeMultipliers: {
        small: '1.0x (Envelope, small package)',
        medium: '1.2x (+20%)',
        large: '1.5x (+50%)',
        'extra-large': '2.0x (+100%)',
      },
      advanceBookingDiscount: '10% off for bookings 24+ hours in advance',
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing configuration' },
      { status: 500 }
    );
  }
}
