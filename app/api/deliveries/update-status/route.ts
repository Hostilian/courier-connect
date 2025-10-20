import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { getStripeClient } from '@/lib/stripe';
import DeliveryRequest from '@/models/DeliveryRequest';
import User from '@/models/User';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

const validStatuses = ['picked_up', 'in_transit', 'delivered', 'cancelled'];

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { user } = await getAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deliveryId, status } = await request.json();

    if (!deliveryId || !status) {
      return NextResponse.json({ error: 'Delivery ID and status are required' }, { status: 400 });
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const delivery = await DeliveryRequest.findOne({
      _id: deliveryId,
      courierId: new Types.ObjectId(user.userId),
    });

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found or not assigned to you' }, { status: 404 });
    }

    // Update status
    const oldStatus = delivery.status;
    delivery.status = status;
    await delivery.save();

    // Auto-release escrowed payment when delivery is marked as delivered
    let paymentReleased = false;
    if (status === 'delivered' && delivery.paymentStatus === 'authorized' && delivery.paymentIntentId) {
      try {
        const stripe = getStripeClient();
        
        // Capture payment from escrow
        const paymentIntent = await stripe.paymentIntents.capture(delivery.paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
          delivery.paymentStatus = 'paid';
          delivery.paymentCapturedAt = new Date();
          await delivery.save();

          // Transfer to courier if they have Stripe Connect account
          if (delivery.courierId) {
            const courier = await User.findById(delivery.courierId);
            
            if (courier && courier.stripeAccountId && courier.stripeOnboardingComplete) {
              try {
                const courierEarningsInCents = Math.round(delivery.courierEarnings * 100);
                
                const transfer = await stripe.transfers.create({
                  amount: courierEarningsInCents,
                  currency: 'usd',
                  destination: courier.stripeAccountId,
                  metadata: {
                    deliveryId: delivery._id.toString(),
                    trackingId: delivery.trackingId,
                    courierId: courier._id.toString(),
                  },
                });

                // Update courier earnings
                courier.earnings = (courier.earnings || 0) + delivery.courierEarnings;
                await courier.save();

                paymentReleased = true;
                console.log(`Auto-released $${delivery.courierEarnings} to courier ${courier.name} for delivery ${delivery.trackingId}`);
              } catch (transferError) {
                console.error('Stripe transfer error:', transferError);
                // Payment is captured, transfer can be processed manually later
              }
            }
          }
        }
      } catch (captureError) {
        console.error('Payment capture error:', captureError);
        // Don't fail the status update if payment capture fails
        // Can be manually captured later
      }
    }

    return NextResponse.json({ 
      message: 'Status updated successfully', 
      delivery,
      paymentReleased,
      oldStatus,
      newStatus: status
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
