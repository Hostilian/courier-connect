import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    await dbConnect();
    const { trackingId } = params;
    if (!trackingId) return NextResponse.json({ error: 'Tracking ID required' }, { status: 400 });
    const d = await DeliveryRequest.findOne({ trackingId: trackingId.toUpperCase() });
    if (!d) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      trackingId: d.trackingId,
      status: d.status,
      senderName: d.senderName,
      receiverName: d.receiverName,
      pickupAddress: d.senderAddress,
      deliveryAddress: d.receiverAddress,
      packageType: d.packageType,
      urgency: d.urgency,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      courierName: d.courierName,
      courierPhone: d.courierPhone,
      estimatedDelivery: d.estimatedDelivery,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}