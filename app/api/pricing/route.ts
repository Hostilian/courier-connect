// Here we are, the pricing API route. It's a lonely job, being an API route. You just sit here and wait for someone to call you. And when they do, you just do your little dance and give them what they want. It's not a bad life, I guess. Better than working for a living.

import { calculateDeliveryPrice } from '@/lib/pricing';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { distance, urgency, packageSize, scheduledDateTime } = body;

    // You know, you'd think people would send you the right information. But you'd be surprised.
    if (distance === undefined || !urgency || !packageSize) {
      return NextResponse.json({ error: 'Missing required pricing parameters' }, { status: 400 });
    }

    // The main event. The reason we're all here. The calculation.
    const pricing = calculateDeliveryPrice({
      distance,
      urgency,
      packageSize,
      pickupDateTime: scheduledDateTime ? new Date(scheduledDateTime) : undefined,
    });

    // And then you send it back. It's like a game of catch, but with data. And you never know who's on the other end. Could be a guy in his underwear for all I know.
    return NextResponse.json(pricing);
  } catch (error) {
    // Sometimes things go wrong. That's just life. You can't get too upset about it.
    console.error('Pricing API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
