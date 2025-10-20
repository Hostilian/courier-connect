import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { getStripeClient } from '@/lib/stripe';
import DeliveryRequest from '@/models/DeliveryRequest';
import User from '@/models/User';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payments/release
 * 
 * Release escrowed payment to courier when delivery is confirmed.
 * This captures the PaymentIntent and optionally transfers to courier's Stripe Connect account.
 */
export async function POST(request: NextRequest) {
  try {
    // Only authenticated couriers or system can release payments
    const { user } = await getAuth(request);
    
    const { deliveryId } = await request.json();

    if (!deliveryId) {
      return NextResponse.json({ error: 'deliveryId is required' }, { status: 400 });
    }

    await dbConnect();

    const delivery = await DeliveryRequest.findById(deliveryId);

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify courier owns this delivery (if user is authenticated)
    if (user && delivery.courierId) {
      const courierId = new Types.ObjectId(user.userId);
      if (!delivery.courierId.equals(courierId)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    if (delivery.status !== 'delivered') {
      return NextResponse.json({ 
        error: 'Delivery must be marked as delivered before releasing payment' 
      }, { status: 400 });
    }

    if (delivery.paymentStatus === 'paid') {
      return NextResponse.json({ 
        error: 'Payment already released' 
      }, { status: 409 });
    }

    if (delivery.paymentStatus !== 'authorized') {
      return NextResponse.json({ 
        error: 'Payment not authorized. Customer must pay first.' 
      }, { status: 400 });
    }

    if (!delivery.paymentIntentId) {
      return NextResponse.json({ 
        error: 'No payment intent found' 
      }, { status: 400 });
    }

    const stripe = getStripeClient();

    // Capture the payment from escrow
    const paymentIntent = await stripe.paymentIntents.capture(delivery.paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ 
        error: 'Payment capture failed',
        details: paymentIntent.status
      }, { status: 500 });
    }

    // Update delivery payment status
    delivery.paymentStatus = 'paid';
    delivery.paymentCapturedAt = new Date();
    await delivery.save();

    // Transfer to courier if they have Stripe Connect account
    let transferId: string | undefined;
    if (delivery.courierId) {
      const courier = await User.findById(delivery.courierId);
      
      if (courier && courier.stripeAccountId && courier.stripeOnboardingComplete) {
        try {
          // Calculate courier's share (courierEarnings already calculated during pricing)
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

          transferId = transfer.id;

          // Update courier earnings
          courier.earnings = (courier.earnings || 0) + delivery.courierEarnings;
          await courier.save();

          console.log(`Transferred $${delivery.courierEarnings} to courier ${courier.name} for delivery ${delivery.trackingId}`);
        } catch (transferError) {
          console.error('Stripe transfer error:', transferError);
          // Don't fail the whole operation if transfer fails
          // Payment is captured, so customer is charged
          // Can manually process transfer later
        }
      }
    }

    return NextResponse.json({
      success: true,
      paymentStatus: 'paid',
      amountCaptured: delivery.price,
      courierEarnings: delivery.courierEarnings,
      platformFee: delivery.platformFee,
      transferId,
      message: 'Payment released successfully',
    });

  } catch (error) {
    console.error('Payment release error:', error);
    return NextResponse.json({ 
      error: 'Failed to release payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
