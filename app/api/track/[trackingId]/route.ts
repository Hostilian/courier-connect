// File: app/api/track/[trackingId]/route.ts
// So, a customer wants to know where their box is. Fair enough.
// This public endpoint is their window into that world. No login required.
// Just a magic string of characters.

import { getErrorResponse } from '@/lib/helpers';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest, { IDeliveryRequest } from '@/models/DeliveryRequest';
import User from '@/models/User'; // We need this to get the courier's name.
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const { trackingId } = params;

    // Basic validation. A tracking ID should look like a tracking ID.
    if (!trackingId || !trackingId.startsWith('CC-')) {
      return getErrorResponse(400, 'Invalid tracking ID format.');
    }

    await dbConnect(); // Let's talk to the database.

    // Find the delivery. The trackingId is supposed to be unique. Supposed to be.
    const delivery = await DeliveryRequest.findOne<IDeliveryRequest>({ trackingId: trackingId.toUpperCase() }).lean();

    if (!delivery) {
      return getErrorResponse(404, 'Delivery not found.');
    }

    let courierName = null;
    let courierRating = null;
    // If a courier has claimed this sacred duty, let's find out who they are.
    if (delivery.courierId) {
      const courier = await User.findById(delivery.courierId).select('name rating');
      if (courier) {
        courierName = courier.name;
        courierRating = courier.rating;
      }
    }

    // We don't want to send everything to the client. That's how you get hacked.
    // Just the important stuff.
    const publicDeliveryData = {
      trackingId: delivery.trackingId,
      status: delivery.status,
      senderAddress: delivery.senderAddress,
      receiverAddress: delivery.receiverAddress,
      packageType: delivery.packageType,
      packageSize: delivery.packageSize,
      urgency: delivery.urgency,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
      deliveredAt: delivery.deliveredAt,
      courierName: courierName, // May be null, and that's okay.
      courierRating: courierRating,
      estimatedDelivery: delivery.estimatedDelivery,
      senderLocation: delivery.senderLocation,
      receiverLocation: delivery.receiverLocation,
      routePolyline: delivery.routePolyline,
    };

    return NextResponse.json(publicDeliveryData);
  } catch (error) {
    console.error(`Error fetching tracking info for ${params.trackingId}:`, error);
    return getErrorResponse(500, 'An unexpected error occurred. The server might be napping.');
  }
}