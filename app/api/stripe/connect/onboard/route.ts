import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { getStripeClient } from '@/lib/stripe';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * POST /api/stripe/connect/onboard
 * 
 * Create Stripe Connect account and onboarding link for courier to receive payouts
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const courier = await User.findById(user.userId);

    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }

    if (courier.role !== 'courier') {
      return NextResponse.json({ error: 'Only couriers can onboard to Stripe' }, { status: 403 });
    }

    const stripe = getStripeClient();

    let accountId = courier.stripeAccountId;

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // TODO: Get from courier's country
        email: courier.email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          email: courier.email,
          first_name: courier.name.split(' ')[0],
          last_name: courier.name.split(' ').slice(1).join(' ') || courier.name.split(' ')[0],
        },
        metadata: {
          courierId: courier._id.toString(),
          courierName: courier.name,
        },
      });

      accountId = account.id;

      // Save account ID to courier
      courier.stripeAccountId = accountId;
      await courier.save();
    }

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${APP_URL}/courier/dashboard?stripe_onboarding=refresh`,
      return_url: `${APP_URL}/courier/dashboard?stripe_onboarding=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId,
    });

  } catch (error) {
    console.error('Stripe Connect onboarding error:', error);
    return NextResponse.json({ 
      error: 'Failed to create onboarding link',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET /api/stripe/connect/onboard
 * 
 * Check onboarding status of courier's Stripe Connect account
 */
export async function GET(request: NextRequest) {
  try {
    const { user } = await getAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const courier = await User.findById(user.userId);

    if (!courier || !courier.stripeAccountId) {
      return NextResponse.json({
        onboarded: false,
        accountId: null,
      });
    }

    const stripe = getStripeClient();

    // Get account details
    const account = await stripe.accounts.retrieve(courier.stripeAccountId);

    const onboardingComplete = account.details_submitted && account.charges_enabled;

    // Update courier's onboarding status if it changed
    if (onboardingComplete !== courier.stripeOnboardingComplete) {
      courier.stripeOnboardingComplete = onboardingComplete;
      await courier.save();
    }

    return NextResponse.json({
      onboarded: onboardingComplete,
      accountId: courier.stripeAccountId,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });

  } catch (error) {
    console.error('Stripe Connect status check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check onboarding status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
