import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    await dbConnect();
    const { trackingId } = params;
    if (!trackingId) return NextResponse.json({ error: 'Tracking ID required' }, { status: 400 });
    const delivery = await DeliveryRequest.findOne({ trackingId: trackingId.toUpperCase() });
    if (!delivery) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, delivery });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}