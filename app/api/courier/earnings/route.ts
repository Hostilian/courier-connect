import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

interface EarningsData {
  totalEarnings: number;
  totalDeliveries: number;
  averageEarningPerDelivery: number;
  recentDeliveries: any[];
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { user } = await getAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    let days;
    switch (period) {
      case '7d':
        days = 7;
        break;
      case '90d':
        days = 90;
        break;
      default:
        days = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const courierId = new Types.ObjectId(user.userId);

    const deliveries = await DeliveryRequest.find({
      courierId: courierId,
      status: 'delivered',
      updatedAt: { $gte: startDate },
    }).sort({ updatedAt: -1 });

    const totalEarnings = deliveries.reduce((sum, delivery) => sum + delivery.price, 0);
    const totalDeliveries = deliveries.length;
    const averageEarningPerDelivery = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

    const recentDeliveries = deliveries.slice(0, 5).map(d => ({
      id: d.trackingId,
      date: d.updatedAt,
      amount: d.price,
    }));

    const earningsData: EarningsData = {
      totalEarnings,
      totalDeliveries,
      averageEarningPerDelivery,
      recentDeliveries,
    };

    return NextResponse.json(earningsData);
  } catch (error) {
    console.error('Error fetching earnings data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
