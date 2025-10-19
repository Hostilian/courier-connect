import { getAuth } from '@/lib/auth';
import { getErrorResponse } from '@/lib/helpers';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { user } = await getAuth(request);
    if (!user || user.role !== 'courier') {
      return getErrorResponse(401, 'Unauthorized');
    }

    await dbConnect();

    const courier = await User.findById(user.userId);
    if (!courier || !courier.courierProfile) {
        return getErrorResponse(404, 'Courier profile not found.');
    }

    // For now, just find pending deliveries.
    // A more advanced implementation would use the courier's city or a geospatial query.
    const availableDeliveries = await DeliveryRequest.find({
      status: 'pending',
      // serviceCity: courier.courierProfile.city, // Example of location-based filtering
    }).sort({ createdAt: -1 }).limit(20);

    return NextResponse.json(availableDeliveries);

  } catch (error: any) {
    console.error('Available deliveries API error:', error);
    return getErrorResponse(500, error.message || 'Failed to fetch available deliveries');
  }
}
