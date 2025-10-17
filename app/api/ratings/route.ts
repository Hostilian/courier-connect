import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rating from '@/models/Rating';
import User from '@/models/User';
import DeliveryRequest from '@/models/DeliveryRequest';

export async function POST(req: NextRequest) {
  try {
    const { deliveryId, rating, comment, customerEmail } = await req.json();

    // Validate input
    if (!deliveryId || !rating || !customerEmail) {
      return NextResponse.json(
        { error: 'Delivery ID, rating, and customer email are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if delivery exists and is delivered
    const delivery = await DeliveryRequest.findById(deliveryId);
    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      );
    }

    if (delivery.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Can only rate completed deliveries' },
        { status: 400 }
      );
    }

    // Verify customer email matches
    if (delivery.senderEmail.toLowerCase() !== customerEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized to rate this delivery' },
        { status: 403 }
      );
    }

    // Check if already rated
    const existingRating = await Rating.findOne({ deliveryId });
    if (existingRating) {
      return NextResponse.json(
        { error: 'This delivery has already been rated' },
        { status: 400 }
      );
    }

    if (!delivery.courierId) {
      return NextResponse.json(
        { error: 'Delivery has no assigned courier' },
        { status: 400 }
      );
    }

    // Create rating
    const newRating = await Rating.create({
      deliveryId,
      courierId: delivery.courierId,
      customerEmail: customerEmail.toLowerCase(),
      rating,
      comment: comment || undefined,
    });

    // Update courier's average rating
    const courierRatings = await Rating.find({ courierId: delivery.courierId });
    const avgRating =
      courierRatings.reduce((sum, r) => sum + r.rating, 0) /
      courierRatings.length;

    await User.findByIdAndUpdate(delivery.courierId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
    });

    return NextResponse.json({
      message: 'Rating submitted successfully',
      rating: newRating,
    });
  } catch (error) {
    console.error('Rating submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courierId = searchParams.get('courierId');

    if (!courierId) {
      return NextResponse.json(
        { error: 'Courier ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const ratings = await Rating.find({ courierId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('rating comment createdAt');

    const user = await User.findById(courierId).select(
      'name rating totalDeliveries'
    );

    if (!user) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }

    return NextResponse.json({
      courier: {
        name: user.name,
        rating: user.rating,
        totalDeliveries: user.totalDeliveries,
      },
      ratings: ratings,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}
