// File: app/api/courier/active-deliveries/route.ts
// You want to see what you're working on? Fine. Here's a list.
// Don't come crying to me when you realize how much you've signed up for.

import { getAuth } from '@/lib/auth';
import { getErrorResponse } from '@/lib/helpers';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await dbConnect(); // Waking up the database. Hope it's in a good mood.

    // Let's see some ID.
    const { user } = await getAuth(request);
    if (!user) {
      return getErrorResponse(401, 'Unauthorized. You need a token to get in here.');
    }

    const courierId = new Types.ObjectId(user.userId);

    // Find all the jobs you're stuck with.
    const activeDeliveries = await DeliveryRequest.find({
      courierId: courierId,
      // Anything that's not pending, delivered, or cancelled is your problem now.
      status: { $in: ['accepted', 'picked_up', 'in_transit'] }
    }).sort({ updatedAt: -1 }); // Show the newest ones first. As if that helps.

    return NextResponse.json(activeDeliveries);
  } catch (error) {
    console.error('Error fetching active deliveries:', error);
    return getErrorResponse(500, 'Failed to fetch active deliveries. The server is probably tired.');
  }
}
