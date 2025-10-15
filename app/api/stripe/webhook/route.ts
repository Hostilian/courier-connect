import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    await dbConnect();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { trackingId } = session.metadata || {};

      if (trackingId) {
        await DeliveryRequest.findOneAndUpdate(
          { trackingId: trackingId.toUpperCase() },
          {
            paymentStatus: 'paid',
            paymentIntentId: session.payment_intent as string,
          }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
