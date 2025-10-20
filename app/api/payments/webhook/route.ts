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
            // Payment authorized and held in escrow (not captured yet)
            delivery.paymentStatus = 'authorized';
            delivery.paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : undefined;
            delivery.checkoutSessionId = session.id;
            await delivery.save();
            console.log(`Payment authorized for delivery ${delivery.trackingId} - funds in escrow`);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const deliveryId = paymentIntent.metadata?.deliveryId;

        if (deliveryId) {
          await dbConnect();
          const delivery = await DeliveryRequest.findById(deliveryId);

          if (delivery) {
            // Funds captured and ready for payout
            delivery.paymentStatus = 'paid';
            await delivery.save();
            console.log(`Payment captured for delivery ${delivery.trackingId}`);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const deliveryId = paymentIntent.metadata?.deliveryId;

        if (deliveryId) {
          await dbConnect();
          await DeliveryRequest.findByIdAndUpdate(deliveryId, {
            paymentStatus: 'failed',
          });
          console.log(`Payment failed for delivery ${deliveryId}`);
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
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
