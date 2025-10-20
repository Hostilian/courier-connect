import dbConnect from '@/lib/mongodb';
import { getStripeClient } from '@/lib/stripe';
import DeliveryRequest from '@/models/DeliveryRequest';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || 'usd';
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    const { deliveryId, successPath = '/{locale}/payment/success', cancelPath = '/{locale}/payment/cancel' } = await request.json();

    if (!deliveryId) {
      return NextResponse.json({ error: 'deliveryId is required' }, { status: 400 });
    }

    await dbConnect();

    const delivery = await DeliveryRequest.findById(deliveryId);

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    if (delivery.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Delivery has already been paid' }, { status: 409 });
    }

    const stripe = getStripeClient();

    const amountInCents = Math.max(0, Math.round(delivery.price * 100));

    if (amountInCents <= 0) {
      return NextResponse.json({ error: 'Delivery total is invalid for payment' }, { status: 400 });
    }

    // Create PaymentIntent with manual capture for escrow
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: DEFAULT_CURRENCY,
      payment_method_types: ['card'],
      capture_method: 'manual', // Hold funds in escrow until delivery confirmed
      metadata: {
        deliveryId: delivery.id,
        trackingId: delivery.trackingId,
        courierEarnings: String(delivery.courierEarnings),
        platformFee: String(delivery.platformFee),
      },
    });

    const resolvedSuccessPath = successPath.replace('{locale}', delivery.locale || 'en');
    const resolvedCancelPath = cancelPath.replace('{locale}', delivery.locale || 'en');

    const normalizedSuccessPath = resolvedSuccessPath.startsWith('/')
      ? resolvedSuccessPath
      : `/${resolvedSuccessPath}`;
    const normalizedCancelPath = resolvedCancelPath.startsWith('/')
      ? resolvedCancelPath
      : `/${resolvedCancelPath}`;

    // Create Checkout Session with the PaymentIntent
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: DEFAULT_CURRENCY,
            unit_amount: amountInCents,
            product_data: {
              name: `Delivery ${delivery.trackingId}`,
              description: `${delivery.packageType} • ${delivery.urgency}`,
            },
          },
        },
      ],
      customer_email: delivery.senderEmail,
      payment_intent_data: {
        metadata: {
          deliveryId: delivery.id,
          trackingId: delivery.trackingId,
          courierEarnings: String(delivery.courierEarnings),
          platformFee: String(delivery.platformFee),
        },
        capture_method: 'manual', // Escrow - hold until delivery confirmed
      },
      metadata: {
        deliveryId: delivery.id,
        trackingId: delivery.trackingId,
      },
      success_url: `${APP_URL}${normalizedSuccessPath}${normalizedSuccessPath.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}${normalizedCancelPath}`,
    });

    delivery.checkoutSessionId = session.id;
    delivery.paymentIntentId = paymentIntent.id;
    delivery.paymentStatus = 'pending';
    await delivery.save();

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Create Checkout Session error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
