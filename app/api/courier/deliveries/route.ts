import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'courier-connect-secret-key-change-in-production';

// Verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// GET /api/courier/deliveries - Get deliveries for courier
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = {};

    // Filter by status type
    if (status === 'available') {
      // Available: pending deliveries not assigned to anyone
      query.status = 'pending';
      query.courierId = null;
    } else if (status === 'active') {
      // Active: deliveries assigned to this courier that are not completed
      query.courierId = decoded.userId;
      query.status = { $in: ['accepted', 'picked_up', 'in_transit'] };
    } else if (status === 'completed') {
      // Completed: deliveries completed by this courier
      query.courierId = decoded.userId;
      query.status = 'delivered';
    }

    // Fetch deliveries
    const deliveries = await DeliveryRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v');

    // Get courier stats with enhanced earnings data
    const courier = await User.findById(decoded.userId);
    
    // Calculate time-based earnings
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Aggregate earnings by time period
    const earningsAggregation = await DeliveryRequest.aggregate([
      {
        $match: {
          courierId: decoded.userId,
          status: 'delivered',
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$courierEarnings' },
          todayEarnings: {
            $sum: {
              $cond: [
                { $gte: ['$actualDelivery', todayStart] },
                '$courierEarnings',
                0,
              ],
            },
          },
          weekEarnings: {
            $sum: {
              $cond: [
                { $gte: ['$actualDelivery', weekStart] },
                '$courierEarnings',
                0,
              ],
            },
          },
          monthEarnings: {
            $sum: {
              $cond: [
                { $gte: ['$actualDelivery', monthStart] },
                '$courierEarnings',
                0,
              ],
            },
          },
          completedCount: { $sum: 1 },
          todayDeliveries: {
            $sum: {
              $cond: [
                { $gte: ['$actualDelivery', todayStart] },
                1,
                0,
              ],
            },
          },
          totalPlatformFees: { $sum: '$platformFee' },
        },
      },
    ]);

    const earningsData = earningsAggregation[0] || {
      totalEarnings: 0,
      todayEarnings: 0,
      weekEarnings: 0,
      monthEarnings: 0,
      completedCount: 0,
      todayDeliveries: 0,
      totalPlatformFees: 0,
    };

    // Count active deliveries
    const activeCount = await DeliveryRequest.countDocuments({
      courierId: decoded.userId,
      status: { $in: ['accepted', 'picked_up', 'in_transit'] },
    });

    const stats = {
      totalEarnings: Number(earningsData.totalEarnings.toFixed(2)),
      todayEarnings: Number(earningsData.todayEarnings.toFixed(2)),
      weekEarnings: Number(earningsData.weekEarnings.toFixed(2)),
      monthEarnings: Number(earningsData.monthEarnings.toFixed(2)),
      completedDeliveries: earningsData.completedCount,
      todayDeliveries: earningsData.todayDeliveries,
      activeDeliveries: activeCount,
      averageEarningsPerDelivery: earningsData.completedCount > 0
        ? Number((earningsData.totalEarnings / earningsData.completedCount).toFixed(2))
        : 0,
      platformFeesTotal: Number(earningsData.totalPlatformFees.toFixed(2)),
      rating: courier?.rating || 5.0,
    };

    return NextResponse.json({
      success: true,
      deliveries,
      stats,
    });
  } catch (error: any) {
    console.error('Get courier deliveries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries', details: error.message },
      { status: 500 }
    );
  }
}
