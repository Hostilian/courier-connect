// File: app/api/courier/deliveries/[id]/update/route.ts
// You clicked a button. Now this code runs. It's a simple life.
// This route changes the status of a delivery. From 'accepted' to 'picked_up', etc.
// It's like watching a kid grow up, but the kid is a cardboard box.

import { getAuth } from '@/lib/auth';
import { sendDeliveryCompletedEmail } from '@/lib/email';
import { getErrorResponse } from '@/lib/helpers';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Let's make sure the status is one of the ones we actually use.
// No "in_my_feelings" status allowed.
const updateStatusSchema = z.object({
  status: z.enum(['picked_up', 'in_transit', 'delivered', 'cancelled']),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // You again? Show me your token.
    const { user } = await getAuth(request);
    if (!user) {
      return getErrorResponse(401, 'Unauthorized. Seriously, get a token.');
    }

    const body = await request.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return getErrorResponse(400, 'Invalid status provided.', validation.error.format());
    }

    const { status: newStatus } = validation.data;
    const { id: deliveryId } = params;

    await dbConnect(); // Waking up the database. Again. It's a heavy sleeper.

    // Find the delivery, but only if it belongs to you. No touching other people's boxes.
    const delivery = await DeliveryRequest.findOne({
      _id: deliveryId,
      courierId: user.userId,
    });

    if (!delivery) {
      return getErrorResponse(404, 'Delivery not found or you are not assigned to it.');
    }

    // A simple state machine. Because life is complicated enough.
    const validTransitions: Record<string, string[]> = {
        accepted: ['picked_up', 'cancelled'],
        picked_up: ['in_transit', 'cancelled'],
        in_transit: ['delivered', 'cancelled'],
    };

    const currentStatus = delivery.status;
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
        return getErrorResponse(400, `Invalid status transition from ${currentStatus} to ${newStatus}.`);
    }

    // Update the status. The box is one step closer to its final destination.
    delivery.status = newStatus;
    
    // If it's delivered, let's mark the time. For posterity.
    if (newStatus === 'delivered') {
        delivery.deliveredAt = new Date();
    }

    await delivery.save(); // Save your work. Always save your work.

    // If the delivery is complete, send a nice email to the customer.
    if (newStatus === 'delivered') {
      try {
        await sendDeliveryCompletedEmail(delivery);
      } catch (emailError) {
        console.error('Failed to send delivery completed email:', emailError);
        // Don't let email failure stop the process. Just log it.
      }
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return getErrorResponse(500, 'Failed to update delivery status. The box remains in limbo.');
  }
}
