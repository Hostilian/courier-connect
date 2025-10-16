import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    await dbConnect();
    const { trackingId } = params;
    if (!trackingId) return NextResponse.json({ error: 'Tracking ID required' }, { status: 400 });
    const doc = await DeliveryRequest.findOne({ trackingId: trackingId.toUpperCase() });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const record = doc.toObject();

    return NextResponse.json({
      trackingId: record.trackingId,
      status: record.status,
      senderName: record.senderName,
      senderAddress: record.senderAddress,
      senderPhone: record.senderPhone,
      senderLocation: record.senderLocation,
      receiverName: record.receiverName,
      receiverAddress: record.receiverAddress,
      receiverPhone: record.receiverPhone,
      receiverLocation: record.receiverLocation,
      packageType: record.packageType,
      packageSize: record.packageSize,
      packageDescription: record.packageDescription,
      urgency: record.urgency,
      pickupTime: record.pickupTime,
      notes: record.notes,
      serviceCity: record.serviceCity,
      serviceCountry: record.serviceCountry,
      distance: record.distance,
      distanceText: record.distanceText,
      distanceEstimated: record.distanceEstimated,
      duration: record.duration,
      durationText: record.durationText,
      routePolyline: record.routePolyline,
      price: record.price,
      courierEarnings: record.courierEarnings,
      platformFee: record.platformFee,
      basePrice: record.basePrice,
      distancePrice: record.distancePrice,
      urgencyPrice: record.urgencyPrice,
      scheduledPrice: record.scheduledPrice,
      packageSizePrice: record.packageSizePrice,
      minimumAdjustment: record.minimumAdjustment,
      minimumPriceApplied: record.minimumPriceApplied,
      scheduledPickupDate: record.scheduledPickupDate,
      scheduledDeliveryDate: record.scheduledDeliveryDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      courierName: record.courierName,
      courierPhone: record.courierPhone,
      estimatedDelivery: record.estimatedDelivery,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}