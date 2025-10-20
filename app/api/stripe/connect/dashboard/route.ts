import { getAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { getStripeClient } from '@/lib/stripe';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/stripe/connect/dashboard
 * 
 * Create login link for courier to access their Stripe Express Dashboard
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

    if (!courier.stripeAccountId) {
      return NextResponse.json({ 
        error: 'No Stripe account found. Please complete onboarding first.' 
      }, { status: 400 });
    }

    const stripe = getStripeClient();

    // Create login link to Express Dashboard
    const loginLink = await stripe.accounts.createLoginLink(courier.stripeAccountId);

    return NextResponse.json({
      url: loginLink.url,
    });

  } catch (error) {
    console.error('Stripe dashboard link error:', error);
    return NextResponse.json({ 
      error: 'Failed to create dashboard link',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
