import { getAuth } from '@/lib/auth';
import { getErrorResponse } from '@/lib/helpers';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { user } = await getAuth(request);
    if (!user || user.role !== 'courier') {
      return getErrorResponse(401, 'Unauthorized');
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const deliveries = await DeliveryRequest.find({
      courierId: user.userId,
      status: 'delivered',
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 });

    const totalEarnings = deliveries.reduce((sum, d) => sum + (d.courierEarnings || 0), 0);
    const totalDeliveries = deliveries.length;
    const averageEarningPerDelivery = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

    const recentDeliveries = deliveries.slice(0, 5).map(d => ({
      id: d.trackingId,
      date: d.createdAt,
      amount: d.courierEarnings,
      status: d.status,
    }));

    // This is a simplified trend. A real implementation might group by day.
    const earningsTrend = deliveries.map(d => ({
        name: new Date(d.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
        earnings: d.courierEarnings || 0,
    })).reverse();


    return NextResponse.json({
      totalEarnings,
      totalDeliveries,
      averageEarningPerDelivery,
      earningsTrend,
      recentDeliveries,
    });

  } catch (error: any) {
    console.error('Earnings API error:', error);
    return getErrorResponse(500, error.message || 'Failed to fetch earnings data');
  }
}
