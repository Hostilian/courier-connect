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

// PUT /api/courier/update-status - Update delivery status
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { deliveryId, status } = body;

    if (!deliveryId || !status) {
      return NextResponse.json(
        { error: 'Delivery ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['picked_up', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Find delivery
    const delivery = await DeliveryRequest.findById(deliveryId);
    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      );
    }

    // Verify courier owns this delivery
    if (!delivery.courierId || delivery.courierId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Not your delivery' },
        { status: 403 }
      );
    }

    // Update delivery status
    delivery.status = status;

    // If delivered, set actual delivery time and update courier earnings
    if (status === 'delivered') {
      delivery.actualDelivery = new Date();

      // Update courier stats
      const courier = await User.findById(decoded.userId);
      if (courier) {
        courier.completedDeliveries = (courier.completedDeliveries || 0) + 1;
        courier.activeDeliveries = Math.max((courier.activeDeliveries || 0) - 1, 0);
        courier.earnings = (courier.earnings || 0) + delivery.price;
        await courier.save();
      }
    }

    await delivery.save();

    return NextResponse.json({
      success: true,
      message: `Delivery status updated to ${status}`,
      delivery: {
        id: delivery._id,
        trackingId: delivery.trackingId,
        status: delivery.status,
        actualDelivery: delivery.actualDelivery,
      },
    });
  } catch (error: any) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { error: 'Failed to update status', details: error.message },
      { status: 500 }
    );
  }
}
