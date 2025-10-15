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

// POST /api/courier/accept/[id] - Accept delivery
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Find delivery
    const delivery = await DeliveryRequest.findById(id);
    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      );
    }

    // Check if delivery is still available
    if (delivery.status !== 'pending' || delivery.courierId) {
      return NextResponse.json(
        { error: 'Delivery is no longer available' },
        { status: 400 }
      );
    }

    // Get courier information
    const courier = await User.findById(decoded.userId);
    if (!courier) {
      return NextResponse.json(
        { error: 'Courier not found' },
        { status: 404 }
      );
    }

    // Calculate estimated delivery time (1-2 hours from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setHours(estimatedDelivery.getHours() + 2);

    // Update delivery with courier info
    delivery.status = 'accepted';
    delivery.courierId = courier._id;
    delivery.courierName = courier.name;
    delivery.courierPhone = courier.phone;
    delivery.estimatedDelivery = estimatedDelivery;
    await delivery.save();

    // Update courier stats
    courier.activeDeliveries = (courier.activeDeliveries || 0) + 1;
    courier.totalDeliveries = (courier.totalDeliveries || 0) + 1;
    await courier.save();

    return NextResponse.json({
      success: true,
      message: 'Delivery accepted successfully',
      delivery: {
        id: delivery._id,
        trackingId: delivery.trackingId,
        status: delivery.status,
        estimatedDelivery: delivery.estimatedDelivery,
      },
    });
  } catch (error: any) {
    console.error('Accept delivery error:', error);
    return NextResponse.json(
      { error: 'Failed to accept delivery', details: error.message },
      { status: 500 }
    );
  }
}
