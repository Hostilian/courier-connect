import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { trackingId } = await request.json();

    if (!trackingId) {
      return NextResponse.json({ error: 'Tracking ID required' }, { status: 400 });
    }

    const delivery = await DeliveryRequest.findOne({ trackingId: trackingId.toUpperCase() });

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    if (delivery.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Courier Delivery - ${delivery.urgency}`,
              description: `${delivery.packageType} from ${delivery.senderName} to ${delivery.receiverName}`,
            },
            unit_amount: delivery.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${delivery.locale}/track?tracking=${trackingId}&payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${delivery.locale}/track?tracking=${trackingId}&payment=cancelled`,
      metadata: {
        trackingId: delivery.trackingId,
        deliveryId: delivery._id.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
