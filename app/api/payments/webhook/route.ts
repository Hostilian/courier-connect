import dbConnect from '@/lib/mongodb';
import { getStripeClient } from '@/lib/stripe';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const deliveryId = session.metadata?.deliveryId;

        if (deliveryId) {
          await dbConnect();
          const delivery = await DeliveryRequest.findById(deliveryId);

          if (delivery) {
            delivery.paymentStatus = 'paid';
            delivery.paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : undefined;
            delivery.checkoutSessionId = session.id;
            await delivery.save();
          }
        }
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const deliveryId = session.metadata?.deliveryId;

        if (deliveryId) {
          await dbConnect();
          await DeliveryRequest.findByIdAndUpdate(deliveryId, {
            paymentStatus: 'unpaid',
            checkoutSessionId: undefined,
          });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
