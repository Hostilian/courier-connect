import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

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

    // Get courier stats
    const courier = await User.findById(decoded.userId);
    const stats = courier
      ? {
          totalEarnings: courier.earnings || 0,
          completedDeliveries: courier.completedDeliveries || 0,
          rating: courier.rating || 5.0,
          activeDeliveries: courier.activeDeliveries || 0,
        }
      : {
          totalEarnings: 0,
          completedDeliveries: 0,
          rating: 5.0,
          activeDeliveries: 0,
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
