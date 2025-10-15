import dbConnect from '@/lib/mongodb';

import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

// Generate unique tracking ID
function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'CC-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Calculate price based on urgency
function calculatePrice(urgency: string): number {
  switch (urgency) {
    case 'urgent':
      return 20;
    case 'express':
      return 10;
    case 'standard':
    default:
      return 5;
  }
}

// POST /api/deliveries - Create new delivery request
export async function POST(request: NextRequest) {
  try {
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
    } = body;

    // Validate required fields
    if (!senderName || !senderPhone || !senderAddress) {
      return NextResponse.json(
        { error: 'Sender information is required' },
        { status: 400 }
      );
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      return NextResponse.json(
        { error: 'Receiver information is required' },
        { status: 400 }
      );
    }

    if (!packageType || !packageSize) {
      return NextResponse.json(
        { error: 'Package information is required' },
        { status: 400 }
      );
    }

    // Generate unique tracking ID
    let trackingId = generateTrackingId();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await DeliveryRequest.findOne({ trackingId });
      if (!existing) break;
      trackingId = generateTrackingId();
      attempts++;
    }

    // Calculate price
    const price = calculatePrice(urgency);

    // Create delivery request
    const delivery = await DeliveryRequest.create({
      trackingId,
      status: 'pending',
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
      packageDescription: packageDescription || '',
      urgency,
      pickupTime,
      notes: notes || '',
      price,
      locale,
      serviceCountry,
      serviceCity,
    });

    return NextResponse.json(
      {
        success: true,
        trackingId: delivery.trackingId,
        price: delivery.price,
        message: 'Delivery request created successfully',
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
