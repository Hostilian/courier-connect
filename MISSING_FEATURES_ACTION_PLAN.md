# 🎯 Action Plan: Complete Missing Features

## Overview

Based on your refined 15 prompts, **3 key features** need completion to reach 100%:

1. **Smart Matching Algorithm** (Prompt 7) - 60% → 100%
2. **Payment Escrow System** (Prompt 12) - 65% → 100%
3. **Use Case Versatility** (Prompt 11) - 70% → 100%

This document provides implementation roadmaps for each.

---

## 🤖 Feature 1: Smart Matching Algorithm

**Current Status**: Manual courier selection  
**Target**: Automated intelligent matching  
**Priority**: HIGH 🔴  
**Effort**: 2-3 days

### **What It Should Do**

```
1. Customer creates delivery request
2. System identifies all available couriers in service area
3. Scores each courier based on:
   - Distance from pickup (50% weight)
   - Rating (30% weight)
   - Completion rate (20% weight)
4. Notifies top 3 couriers via push notification
5. First to accept gets the job
6. Auto-cancels notifications for others
```

### **Implementation Plan**

#### **Step 1: Create Matching Algorithm**

**File**: `lib/matching.ts`

```typescript
// Smart matching algorithm
import { getDistanceBetweenPoints } from './maps';
import User from '@/models/User';
import DeliveryRequest from '@/models/DeliveryRequest';

interface CourierScore {
  courierId: string;
  score: number;
  distance: number;
  rating: number;
  completionRate: number;
}

export async function findBestCouriers(
  deliveryId: string,
  limit: number = 3
): Promise<CourierScore[]> {
  // Get delivery details
  const delivery = await DeliveryRequest.findById(deliveryId);
  if (!delivery || !delivery.senderLocation) {
    throw new Error('Invalid delivery or missing location');
  }

  // Find available couriers in service area
  const couriers = await User.find({
    role: 'courier',
    isAvailable: true,
    serviceCountry: delivery.serviceCountry,
    // Optional: serviceCity filter for more precision
  });

  // Score each courier
  const scoredCouriers: CourierScore[] = [];

  for (const courier of couriers) {
    if (!courier.currentLocation) continue;

    // Calculate distance
    const distance = getDistanceBetweenPoints(
      delivery.senderLocation,
      courier.currentLocation
    );

    // Get courier stats
    const rating = courier.averageRating || 0;
    const completedDeliveries = courier.completedDeliveries || 0;
    const totalDeliveries = courier.totalDeliveries || 1;
    const completionRate = completedDeliveries / totalDeliveries;

    // Calculate composite score (0-100)
    const distanceScore = Math.max(0, 100 - distance); // Closer = better
    const ratingScore = (rating / 5) * 100; // 5 stars = 100
    const completionScore = completionRate * 100;

    const totalScore =
      distanceScore * 0.5 +
      ratingScore * 0.3 +
      completionScore * 0.2;

    scoredCouriers.push({
      courierId: courier._id.toString(),
      score: totalScore,
      distance,
      rating,
      completionRate,
    });
  }

  // Sort by score (highest first) and return top N
  return scoredCouriers
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
```

#### **Step 2: Push Notification System**

**File**: `lib/notifications.ts`

```typescript
// Push notification system using Firebase Cloud Messaging (FCM)
// or a service like Pusher/Ably

interface NotificationPayload {
  title: string;
  body: string;
  data: Record<string, any>;
  recipients: string[]; // Courier IDs
}

export async function sendPushNotification(
  payload: NotificationPayload
): Promise<void> {
  // Option 1: Firebase Cloud Messaging
  // const admin = require('firebase-admin');
  // await admin.messaging().sendMulticast({
  //   tokens: userDeviceTokens,
  //   notification: {
  //     title: payload.title,
  //     body: payload.body
  //   },
  //   data: payload.data
  // });

  // Option 2: Web Push API (for browser notifications)
  // const webpush = require('web-push');
  // for (const subscription of userSubscriptions) {
  //   await webpush.sendNotification(subscription, JSON.stringify({
  //     title: payload.title,
  //     body: payload.body,
  //     data: payload.data
  //   }));
  // }

  // Option 3: Socket.io (immediate, already implemented!)
  const io = getSocketIO(); // Get Socket.io instance
  for (const courierId of payload.recipients) {
    io.to(`courier:${courierId}`).emit('new-delivery-opportunity', {
      title: payload.title,
      body: payload.body,
      data: payload.data,
    });
  }

  console.log(`Sent notifications to ${payload.recipients.length} couriers`);
}

export async function notifyTopCouriers(deliveryId: string): Promise<void> {
  const topCouriers = await findBestCouriers(deliveryId, 3);
  const delivery = await DeliveryRequest.findById(deliveryId);

  const courierIds = topCouriers.map((c) => c.courierId);

  await sendPushNotification({
    title: 'New Delivery Opportunity! 📦',
    body: `${delivery.packageType} from ${delivery.senderAddress.split(',')[0]} - $${delivery.price.toFixed(2)} (you earn $${delivery.courierEarnings.toFixed(2)})`,
    data: {
      deliveryId,
      price: delivery.price,
      earnings: delivery.courierEarnings,
      distance: topCouriers[0].distance,
    },
    recipients: courierIds,
  });

  // Store notification IDs to cancel if one accepts
  await DeliveryRequest.findByIdAndUpdate(deliveryId, {
    notifiedCouriers: courierIds,
    notifiedAt: new Date(),
  });
}
```

#### **Step 3: Auto-Assignment Logic**

**File**: `app/api/deliveries/accept/route.ts`

```typescript
// When courier accepts delivery
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import DeliveryRequest from '@/models/DeliveryRequest';
import { cancelNotifications } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deliveryId } = await request.json();

    // Check if delivery is still available
    const delivery = await DeliveryRequest.findById(deliveryId);
    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    if (delivery.status !== 'pending') {
      return NextResponse.json(
        { error: 'Delivery already accepted by another courier' },
        { status: 409 }
      );
    }

    // Assign to courier
    delivery.courierId = user.userId;
    delivery.courierName = user.name;
    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();
    await delivery.save();

    // Cancel notifications to other couriers
    if (delivery.notifiedCouriers) {
      await cancelNotifications(delivery.notifiedCouriers, deliveryId);
    }

    return NextResponse.json({ success: true, delivery });
  } catch (error) {
    console.error('Accept delivery error:', error);
    return NextResponse.json({ error: 'Failed to accept delivery' }, { status: 500 });
  }
}
```

#### **Step 4: Update Delivery Creation Flow**

**Modify**: `app/api/deliveries/route.ts`

```typescript
// After creating delivery request
const delivery = await DeliveryRequest.create(deliveryData);

// Trigger smart matching (async, don't wait)
notifyTopCouriers(delivery._id.toString()).catch(err =>
  console.error('Notification error:', err)
);

return NextResponse.json({ trackingId: delivery.trackingId });
```

### **Testing Checklist**

- [ ] Create delivery request
- [ ] Verify top 3 couriers receive notification
- [ ] First courier accepts → others get cancellation
- [ ] Delivery status updates to "accepted"
- [ ] Unnotified couriers don't see it anymore

---

## 💳 Feature 2: Payment Escrow System

**Current Status**: Stripe integrated but not active  
**Target**: Full escrow with automatic release  
**Priority**: HIGH 🔴  
**Effort**: 3-4 days

### **What It Should Do**

```
1. Customer creates delivery → Payment held in escrow
2. Courier accepts → Funds reserved for payout
3. Courier delivers → Customer confirms
4. System releases 70% to courier, keeps 30%
5. If disputed → Funds held until resolution
```

### **Implementation Plan**

#### **Step 1: Stripe Connect Setup**

**Prerequisites**:
```bash
# Install Stripe CLI for testing
npm install --save stripe
# Set up webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Environment Variables**:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### **Step 2: Create Payment Intent on Delivery Request**

**Modify**: `app/api/deliveries/route.ts`

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  // ... existing validation ...

  // Calculate pricing
  const pricing = calculateDeliveryPrice({ ... });

  // Create Stripe PaymentIntent (escrow)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(pricing.totalPrice * 100), // Convert to cents
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      deliveryId: '', // Will update after creation
      type: 'delivery_escrow',
      courierEarnings: pricing.courierEarnings,
      platformFee: pricing.platformFee,
    },
    // Hold funds until manual capture
    capture_method: 'manual',
  });

  // Create delivery
  const delivery = await DeliveryRequest.create({
    ...deliveryData,
    price: pricing.totalPrice,
    courierEarnings: pricing.courierEarnings,
    platformFee: pricing.platformFee,
    paymentIntentId: paymentIntent.id,
    paymentStatus: 'pending',
  });

  // Update payment intent with delivery ID
  await stripe.paymentIntents.update(paymentIntent.id, {
    metadata: { deliveryId: delivery._id.toString() },
  });

  return NextResponse.json({
    trackingId: delivery.trackingId,
    clientSecret: paymentIntent.client_secret,
  });
}
```

#### **Step 3: Payment Confirmation UI**

**Create**: `components/PaymentForm.tsx`

```typescript
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentForm({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} onSuccess={() => {}} />
    </Elements>
  );
}
```

#### **Step 4: Release Payment on Delivery Confirmation**

**Create**: `app/api/deliveries/[id]/confirm/route.ts`

```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const delivery = await DeliveryRequest.findById(params.id);
    if (!delivery) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (delivery.status !== 'delivered') {
      return NextResponse.json({ error: 'Not delivered yet' }, { status: 400 });
    }

    // Capture payment from escrow
    await stripe.paymentIntents.capture(delivery.paymentIntentId);

    // Transfer to courier (requires Stripe Connect)
    const courier = await User.findById(delivery.courierId);
    if (courier.stripeAccountId) {
      await stripe.transfers.create({
        amount: Math.round(delivery.courierEarnings * 100),
        currency: 'usd',
        destination: courier.stripeAccountId,
        metadata: {
          deliveryId: delivery._id.toString(),
        },
      });
    }

    // Update delivery
    delivery.paymentStatus = 'completed';
    delivery.confirmedAt = new Date();
    await delivery.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
```

#### **Step 5: Courier Stripe Connect Onboarding**

**Create**: `app/api/courier/stripe-onboard/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { user } = await getAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const courier = await User.findById(user.userId);

  // Create Stripe Connect account if doesn't exist
  if (!courier.stripeAccountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: courier.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    courier.stripeAccountId = account.id;
    await courier.save();
  }

  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: courier.stripeAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/courier/dashboard`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/courier/dashboard?onboarded=true`,
    type: 'account_onboarding',
  });

  return NextResponse.json({ url: accountLink.url });
}
```

### **Testing Checklist**

- [ ] Customer creates delivery → Payment form appears
- [ ] Customer pays → Funds held in escrow
- [ ] Courier delivers → Customer confirms
- [ ] Payment released to courier Stripe account
- [ ] Platform fee (30%) retained
- [ ] Webhook logs success event

---

## 📦 Feature 3: Enhanced Use Case Versatility

**Current Status**: Basic package types  
**Target**: Pre-defined templates and specialized flows  
**Priority**: MEDIUM 🟡  
**Effort**: 1-2 days

### **Implementation Plan**

#### **Step 1: Use Case Templates**

**Create**: `lib/useCaseTemplates.ts`

```typescript
export interface UseCaseTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  packageType: string;
  packageSize?: string;
  defaultNotes: string;
  specialInstructions?: string[];
  requiresPhoto?: boolean;
  suggestedPrice?: number;
}

export const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  {
    id: 'marketplace',
    name: 'Facebook Marketplace Pickup',
    description: 'Pick up an item from a seller and deliver to you',
    icon: '🛍️',
    packageType: 'Other',
    packageSize: 'medium',
    defaultNotes: 'Please verify item matches description before payment to seller.',
    specialInstructions: [
      'Check item condition',
      'Take photos before pickup',
      'Ask for receipt if available',
    ],
    requiresPhoto: true,
  },
  {
    id: 'grocery',
    name: 'Grocery Shopping & Delivery',
    description: 'Shop for groceries and deliver to your door',
    icon: '🛒',
    packageType: 'Food/Groceries',
    packageSize: 'large',
    defaultNotes: 'Shopping list: [Add items here]',
    specialInstructions: [
      'Keep cold items insulated',
      'Check expiration dates',
      'Send photo of receipt',
    ],
  },
  {
    id: 'document',
    name: 'Document/Envelope Delivery',
    description: 'Fast delivery of important documents',
    icon: '📄',
    packageType: 'Documents',
    packageSize: 'small',
    defaultNotes: 'Handle with care. Signature may be required.',
  },
  {
    id: 'gift',
    name: 'Gift Delivery',
    description: 'Surprise someone with a gift delivery',
    icon: '🎁',
    packageType: 'Other',
    defaultNotes: 'Gift delivery - please ring doorbell and announce it's a gift!',
    requiresPhoto: true,
  },
  {
    id: 'food',
    name: 'Restaurant Takeout',
    description: 'Pick up food from a restaurant',
    icon: '🍕',
    packageType: 'Food/Groceries',
    packageSize: 'small',
    defaultNotes: 'Keep food level and warm. Fast delivery preferred.',
    specialInstructions: ['Keep upright', 'Deliver within 30 minutes'],
  },
  {
    id: 'errand',
    name: 'General Errand',
    description: 'Run any errand on your behalf',
    icon: '✅',
    packageType: 'Other',
    defaultNotes: 'Errand details: [Describe what needs to be done]',
  },
];
```

#### **Step 2: Template Selection UI**

**Create**: `components/UseCaseSelector.tsx`

```typescript
'use client';

import { USE_CASE_TEMPLATES, UseCaseTemplate } from '@/lib/useCaseTemplates';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface UseCaseSelectorProps {
  onSelect: (template: UseCaseTemplate) => void;
}

export default function UseCaseSelector({ onSelect }: UseCaseSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {USE_CASE_TEMPLATES.map((template) => (
        <motion.button
          key={template.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelected(template.id);
            onSelect(template);
          }}
          className={`p-4 rounded-lg border-2 transition-all ${
            selected === template.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-4xl mb-2">{template.icon}</div>
          <div className="font-semibold text-sm">{template.name}</div>
          <div className="text-xs text-gray-600 mt-1">
            {template.description}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
```

#### **Step 3: Integrate into Request Flow**

**Modify**: `components/DeliveryRequestForm.tsx`

```typescript
// Add template selection step
const [selectedTemplate, setSelectedTemplate] = useState<UseCaseTemplate | null>(null);

// When template selected, pre-fill form
useEffect(() => {
  if (selectedTemplate) {
    setFormData((prev) => ({
      ...prev,
      packageType: selectedTemplate.packageType,
      packageSize: selectedTemplate.packageSize || prev.packageSize,
      notes: selectedTemplate.defaultNotes,
    }));
  }
}, [selectedTemplate]);

// Render template selector before form
{!selectedTemplate && (
  <UseCaseSelector onSelect={setSelectedTemplate} />
)}

{selectedTemplate && (
  <>
    {/* Show selected template */}
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{selectedTemplate.icon}</span>
        <div>
          <h3 className="font-semibold">{selectedTemplate.name}</h3>
          <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
        </div>
        <button onClick={() => setSelectedTemplate(null)}>Change</button>
      </div>
    </div>

    {/* Special instructions if any */}
    {selectedTemplate.specialInstructions && (
      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
        <h4 className="font-semibold text-sm mb-2">📋 Important:</h4>
        <ul className="text-sm space-y-1">
          {selectedTemplate.specialInstructions.map((instruction, i) => (
            <li key={i}>• {instruction}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Regular form fields */}
    {/* ... existing form ... */}
  </>
)}
```

### **Testing Checklist**

- [ ] Template grid displays all 6 options
- [ ] Selecting template pre-fills form fields
- [ ] Special instructions show when applicable
- [ ] Can change template mid-flow
- [ ] Submitted delivery includes template ID

---

## 📅 Implementation Timeline

### **Week 1: Core Features**
**Monday-Tuesday**: Smart Matching Algorithm
- Create `lib/matching.ts`
- Implement scoring system
- Test with sample couriers

**Wednesday-Thursday**: Push Notifications
- Set up notification system (Socket.io/FCM)
- Integrate with matching
- Test notification delivery

**Friday**: Auto-Assignment Logic
- Implement accept/cancel flows
- Test race conditions
- Verify notification cancellation

### **Week 2: Payment System**
**Monday-Tuesday**: Stripe Escrow Setup
- Configure Stripe Connect
- Create PaymentIntent flow
- Test escrow holding

**Wednesday-Thursday**: Payment Release
- Implement delivery confirmation
- Automatic transfer to courier
- Test webhook handling

**Friday**: Courier Onboarding
- Stripe Connect onboarding flow
- Dashboard integration
- Test payout process

### **Week 3: Polish & Launch**
**Monday**: Use Case Templates
- Implement templates
- Create selector UI
- Integrate into request form

**Tuesday**: Testing & Bug Fixes
- End-to-end testing
- Fix edge cases
- Performance optimization

**Wednesday-Friday**: Documentation & Deployment
- Update documentation
- Deploy to production
- Monitor for issues

---

## Success Metrics

After implementation, you should be able to:

✅ **Smart Matching**
- [ ] 90%+ of deliveries get 3 courier notifications
- [ ] Average acceptance time < 5 minutes
- [ ] No "stuck" deliveries with no couriers

✅ **Payment Escrow**
- [ ] 100% of payments held in escrow
- [ ] Automatic release on confirmation
- [ ] Zero manual payment processing

✅ **Use Case Templates**
- [ ] 50%+ of requests use a template
- [ ] Reduced form abandonment rate
- [ ] Higher customer satisfaction

---

## Estimated Development Time

| Feature | Time |
|---------|------|
| Smart Matching Algorithm | 2-3 days |
| Push Notification System | 1-2 days |
| Payment Escrow (Stripe) | 3-4 days |
| Use Case Templates | 1-2 days |
| **Total** | **7-11 days** |

**With focused development**: 2-3 weeks to 100% completion.

---

## Ready to Build?

**Priority Order**:
1. Start with **Smart Matching** (highest user impact)
2. Then **Payment Escrow** (enables real transactions)
3. Finally **Use Case Templates** (improves UX)

Let me know which feature you'd like to implement first! 🚀
