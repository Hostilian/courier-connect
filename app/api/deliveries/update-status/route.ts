import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

const validStatuses = ['picked_up', 'in_transit', 'delivered', 'cancelled'];

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { user } = await getAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deliveryId, status } = await request.json();

    if (!deliveryId || !status) {
      return NextResponse.json({ error: 'Delivery ID and status are required' }, { status: 400 });
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const delivery = await DeliveryRequest.findOne({
      _id: deliveryId,
      courierId: new Types.ObjectId(user.userId),
    });

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found or not assigned to you' }, { status: 404 });
    }

    // Add logic here to prevent invalid status transitions (e.g., from 'delivered' back to 'picked_up')
    // For now, we'll allow any valid status change.

    delivery.status = status;
    await delivery.save();

    return NextResponse.json({ message: 'Status updated successfully', delivery });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
