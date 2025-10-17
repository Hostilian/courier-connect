// File: app/api/courier/deliveries/[id]/accept/route.ts
// You know, for a guy who doesn't like to commit, I sure do a lot of it.
// This route is for when a courier decides, "Yeah, I'll take that box." It's a big moment.

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { getAuth } from '@/lib/auth';
import { getErrorResponse } from '@/lib/helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, let's see if you're even allowed to be here.
    const { user } = await getAuth(request);
    if (!user) {
      return getErrorResponse(401, 'Unauthorized. Go sign in, pal.');
    }

    await dbConnect(); // Connect to the database. It's like dialing a phone, but for data.

    const deliveryId = params.id;

    // Find the delivery. It's like a treasure hunt, but the treasure is a cardboard box.
    const delivery = await DeliveryRequest.findById(deliveryId);

    if (!delivery) {
      return getErrorResponse(404, 'Delivery not found. Maybe it never existed.');
    }

    // Can't accept a delivery that's already been spoken for. That's just rude.
    if (delivery.status !== 'pending') {
      return getErrorResponse(
        409, // 409 Conflict - means you're too late, buddy.
        `This delivery is no longer available. Status is currently: ${delivery.status}`
      );
    }

    // Alright, it's yours. Tag it and bag it.
    delivery.status = 'accepted';
    delivery.courierId = user.userId; // Put your name on it.

    await delivery.save(); // Save it to the database. Make it official.

    // Send back the good news. You've got a job to do.
    return NextResponse.json(delivery);
  } catch (error) {
    // Something went wrong. Shocker.
    console.error('Error accepting delivery:', error);
    return getErrorResponse(500, 'Failed to accept delivery. The universe is probably against you.');
  }
}
