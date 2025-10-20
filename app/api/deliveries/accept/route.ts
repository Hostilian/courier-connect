import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { user } = await getAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deliveryId } = await request.json();

    if (!deliveryId) {
      return NextResponse.json({ error: 'Delivery ID is required' }, { status: 400 });
    }

    const delivery = await DeliveryRequest.findById(deliveryId);

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    if (delivery.status !== 'pending') {
      return NextResponse.json({ error: 'Delivery has already been accepted' }, { status: 400 });
    }

    delivery.courierId = new Types.ObjectId(user.userId);
    delivery.status = 'accepted';
    await delivery.save();

    return NextResponse.json({ message: 'Delivery accepted successfully', delivery });
  } catch (error) {
    console.error('Error accepting delivery:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
