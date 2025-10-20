# 💳 Payment Escrow System - Complete Implementation Guide

## Overview

The **Payment Escrow System** is now fully implemented, enabling secure payment handling with automatic fund holding and release. This system ensures customers pay upfront, funds are held safely in escrow, and couriers are paid automatically upon delivery confirmation.

---

## 🎯 Key Features

### 1. **Payment Authorization (Escrow)**
- Customer pays when creating delivery request
- Funds are **authorized but not captured** (held in escrow)
- Stripe PaymentIntent created with `capture_method: 'manual'`
- Payment status: `pending` → `authorized`

### 2. **Automatic Payment Capture**
- When courier marks delivery as `delivered`, payment is **automatically captured**
- Funds are transferred from escrow to platform
- Payment status: `authorized` → `paid`

### 3. **Automatic Courier Payout**
- After payment capture, system automatically transfers 70% to courier's Stripe Connect account
- Platform keeps 30% as fee
- Courier's earnings balance is updated

### 4. **Stripe Connect Integration**
- Couriers onboard via Stripe Connect Express
- Simple onboarding flow directly in dashboard
- Access to Stripe Express Dashboard for payout management

---

## 📂 Implementation Details

### API Endpoints Created

#### 1. `/api/payments/create-checkout-session` (Modified)
**Method**: POST

**What Changed**:
- Now creates PaymentIntent with `capture_method: 'manual'`
- Funds are authorized (held) but not captured
- Metadata includes `courierEarnings` and `platformFee` for split calculation

**Request**:
```json
{
  "deliveryId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/...",
  "paymentIntentId": "pi_..."
}
```

---

#### 2. `/api/payments/webhook` (Enhanced)
**Method**: POST (Stripe webhook)

**New Events Handled**:
- `checkout.session.completed`: Payment authorized → status: `authorized`
- `payment_intent.succeeded`: Payment captured → status: `paid`
- `payment_intent.payment_failed`: Payment failed → status: `failed`

---

#### 3. `/api/payments/release` (New)
**Method**: POST  
**Auth**: Required (courier JWT)

**Purpose**: Manually release escrowed payment (mostly for debugging/admin use)

**Request**:
```json
{
  "deliveryId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response**:
```json
{
  "success": true,
  "paymentStatus": "paid",
  "amountCaptured": 15.50,
  "courierEarnings": 10.85,
  "platformFee": 4.65,
  "transferId": "tr_..."
}
```

**Validations**:
- Delivery must be `delivered` status
- Payment must be `authorized` (not already `paid`)
- Courier must own the delivery (if authenticated)

---

#### 4. `/api/deliveries/update-status` (Enhanced)
**Method**: POST  
**Auth**: Required (courier JWT)

**What Changed**:
- When status is updated to `delivered`, **automatically triggers payment release**
- Captures payment from escrow
- Transfers courier's share to their Stripe account
- Updates courier's earnings balance

**Auto-Release Flow**:
1. Courier marks delivery as `delivered`
2. System captures PaymentIntent from escrow
3. System creates Stripe Transfer to courier's account (if connected)
4. Courier's `earnings` field is incremented
5. Delivery `paymentStatus` updated to `paid`
6. `paymentCapturedAt` timestamp set

---

#### 5. `/api/stripe/connect/onboard` (New)
**Method**: POST (create onboarding link), GET (check status)  
**Auth**: Required (courier JWT)

**POST - Start Onboarding**:
Creates Stripe Connect Express account and onboarding link.

**Response**:
```json
{
  "url": "https://connect.stripe.com/express/...",
  "accountId": "acct_..."
}
```

**GET - Check Status**:
Returns current onboarding status.

**Response**:
```json
{
  "onboarded": true,
  "accountId": "acct_...",
  "detailsSubmitted": true,
  "chargesEnabled": true,
  "payoutsEnabled": true
}
```

---

#### 6. `/api/stripe/connect/dashboard` (New)
**Method**: POST  
**Auth**: Required (courier JWT)

**Purpose**: Generate login link to Stripe Express Dashboard

**Response**:
```json
{
  "url": "https://connect.stripe.com/express/..."
}
```

---

### Database Schema Changes

#### User Model (`models/User.ts`)
**New Fields**:
```typescript
stripeAccountId?: string;           // Stripe Connect account ID
stripeOnboardingComplete: boolean;  // Has courier completed onboarding?
```

---

#### DeliveryRequest Model (`models/DeliveryRequest.ts`)
**Updated Field**:
```typescript
paymentStatus: 'unpaid' | 'pending' | 'authorized' | 'paid' | 'refunded' | 'failed';
```

**New Field**:
```typescript
paymentCapturedAt?: Date;  // When payment was captured from escrow
```

**Status Meanings**:
- `unpaid`: Customer hasn't paid
- `pending`: Payment in progress (Stripe checkout session active)
- `authorized`: Payment authorized and held in escrow
- `paid`: Payment captured and processed
- `refunded`: Payment refunded to customer
- `failed`: Payment authorization failed

---

### UI Components

#### `StripeConnectOnboarding.tsx`
**Location**: `components/StripeConnectOnboarding.tsx`  
**Usage**: Displayed in courier dashboard

**Three States**:

1. **Not Onboarded** (Blue)
   - Call-to-action to connect bank account
   - Lists benefits (automatic transfers, 70% earnings, real-time tracking)
   - "Connect Bank Account" button → starts onboarding flow

2. **Partially Onboarded** (Yellow)
   - Shows verification progress
   - Checkmarks for completed steps (details, charges, payouts)
   - "Continue Setup" button → returns to onboarding

3. **Fully Onboarded** (Green)
   - Success message
   - "Open Stripe Dashboard" button → access Express Dashboard
   - Shows courier is ready to receive payouts

**Integration**:
```tsx
// app/[locale]/courier/dashboard/page.tsx
import StripeConnectOnboarding from '@/components/StripeConnectOnboarding';

<StripeConnectOnboarding />
```

---

## 🔄 Complete Payment Flow

### Step 1: Customer Creates Delivery
1. Customer fills delivery request form
2. Clicks "Request Delivery" → redirected to payment
3. Delivery created with `paymentStatus: 'unpaid'`

### Step 2: Customer Pays
1. Customer clicks "Pay Now"
2. API creates Stripe Checkout Session with PaymentIntent (`capture_method: 'manual'`)
3. Customer completes payment in Stripe Checkout
4. **Funds are authorized (held in escrow)**, NOT captured yet
5. Webhook receives `checkout.session.completed` → delivery `paymentStatus: 'authorized'`

### Step 3: Courier Accepts & Delivers
1. Courier browses available deliveries
2. Accepts delivery → status: `accepted`
3. Picks up package → status: `picked_up`
4. In transit → status: `in_transit`
5. **Marks as delivered** → status: `delivered`

### Step 4: Automatic Payment Release
1. API detects status change to `delivered`
2. Calls `stripe.paymentIntents.capture(paymentIntentId)`
3. Funds are captured from escrow
4. Payment status: `authorized` → `paid`
5. If courier has Stripe Connect account:
   - Creates transfer: `stripe.transfers.create()`
   - Amount: `courierEarnings` (70% of total)
   - Destination: courier's `stripeAccountId`
   - Courier's `earnings` balance updated
6. Platform keeps 30% automatically (remaining funds)

---

## 🧪 Testing Checklist

### Local Testing (Test Mode)

**Prerequisites**:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Test Cards** (Stripe test mode):
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```

**Test Flow**:
- [ ] Customer creates delivery request
- [ ] Customer pays via Stripe Checkout (test card)
- [ ] Payment status shows `authorized` (funds held in escrow)
- [ ] Courier accepts delivery
- [ ] Courier marks as `delivered`
- [ ] Payment automatically captured (status: `paid`)
- [ ] Courier with connected account receives transfer
- [ ] Courier's earnings balance updates
- [ ] Payment shows in Stripe Dashboard > Payments

**Courier Onboarding Test**:
- [ ] Courier clicks "Connect Bank Account" in dashboard
- [ ] Redirected to Stripe Connect onboarding
- [ ] Fills form (test mode allows skipping verification)
- [ ] Redirected back to dashboard with success message
- [ ] Status shows "Payment Setup Complete"
- [ ] Can access Stripe Express Dashboard

**Webhook Testing**:
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/payments/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
```

---

### Production Testing

**Prerequisites**:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From live webhook endpoint
```

**Webhook Setup**:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://hostilian.org/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret → add to `STRIPE_WEBHOOK_SECRET`

**Real Transaction Test**:
- [ ] Create delivery with real payment
- [ ] Verify funds authorized (check Stripe Dashboard)
- [ ] Complete delivery → verify auto-capture
- [ ] Check courier's Stripe account for transfer
- [ ] Verify platform fee retained (30%)

---

## 💰 Money Flow Example

**Delivery Price**: $15.00

### 1. Customer Pays
- $15.00 authorized (held in escrow)
- NOT yet in platform's balance

### 2. Delivery Marked as Delivered
- $15.00 captured from escrow → Platform's Stripe balance
- Immediately triggers transfer:
  - **Courier receives**: $10.50 (70%)
  - **Platform keeps**: $4.50 (30%)

### 3. Final State
- Delivery `paymentStatus`: `paid`
- Delivery `paymentCapturedAt`: `2025-10-20T15:30:00Z`
- Courier `earnings`: +$10.50
- Platform net: $4.50

---

## 🔐 Security Features

1. **Manual Capture**: Funds can't be captured before delivery confirmation
2. **Webhook Verification**: All webhook events verified with signature
3. **Authorization Checks**: Only delivery's courier can trigger payment release
4. **Idempotency**: Multiple capture attempts are handled safely
5. **Error Handling**: Failed transfers don't block delivery confirmation

---

## 🚨 Error Handling

### Payment Capture Fails
- Delivery status still updates to `delivered`
- Payment remains in `authorized` state
- Admin can manually capture via Stripe Dashboard or `/api/payments/release`

### Transfer to Courier Fails
- Payment is still captured (customer is charged)
- Transfer can be retried manually
- Courier's earnings still updated (for tracking)
- Error logged for admin review

### Courier Not Onboarded
- Payment is captured successfully
- Transfer is skipped (courier doesn't have connected account)
- Funds remain in platform account
- Courier can onboard later and request payout

---

## 📊 Monitoring & Admin

### Check Payment Status
```typescript
// Get delivery
const delivery = await DeliveryRequest.findOne({ trackingId: 'CC-ABC123' });

console.log('Payment Status:', delivery.paymentStatus);
console.log('Payment Intent:', delivery.paymentIntentId);
console.log('Captured At:', delivery.paymentCapturedAt);
```

### Check Courier Earnings
```typescript
const courier = await User.findById(courierId);

console.log('Total Earnings:', courier.earnings);
console.log('Stripe Account:', courier.stripeAccountId);
console.log('Onboarding Complete:', courier.stripeOnboardingComplete);
```

### Stripe Dashboard Links
- **Test Mode**: https://dashboard.stripe.com/test
- **Live Mode**: https://dashboard.stripe.com
- **Webhooks**: Developers → Webhooks
- **Payments**: Payments → All payments
- **Transfers**: Connect → Transfers

---

## 🔧 Troubleshooting

### Issue: Payment stuck in "authorized" state
**Solution**: Manually capture via Stripe Dashboard or call `/api/payments/release`

### Issue: Courier not receiving transfer
**Check**:
1. Is courier's `stripeOnboardingComplete` true?
2. Is courier's `stripeAccountId` set?
3. Check Stripe Dashboard → Connect → Transfers for errors

### Issue: Webhook not firing
**Check**:
1. Webhook secret correct in `.env`?
2. Webhook endpoint accessible (not localhost in production)?
3. Stripe CLI forwarding events (for local testing)?

### Issue: "Insufficient funds" error on transfer
**Cause**: Platform Stripe balance doesn't have enough funds
**Solution**: Payment must be captured BEFORE creating transfer (our flow does this)

---

## 🎉 Success Metrics

After implementation, you can now:

✅ **Customer POV**: Pay upfront, funds held safely until delivery
✅ **Courier POV**: Get paid automatically upon delivery confirmation
✅ **Platform POV**: Retain 30% fee automatically
✅ **Security**: Escrow prevents fraud from both sides
✅ **Automation**: Zero manual payout processing required

---

## 📝 Next Steps (Optional Enhancements)

1. **Refund Flow**: Add API endpoint for refunding unauthorized payments
2. **Partial Captures**: Support partial payment capture (e.g., delivery partially completed)
3. **Dispute System**: Handle Stripe disputes with evidence upload
4. **Payout Schedule**: Allow couriers to set weekly/monthly payout schedule
5. **Multi-Currency**: Support EUR, GBP, etc. based on courier country
6. **Analytics Dashboard**: Show payment trends, failed captures, pending transfers

---

## 🔗 Related Files

- `models/User.ts` - User schema with Stripe fields
- `models/DeliveryRequest.ts` - Delivery schema with payment status
- `app/api/payments/create-checkout-session/route.ts` - Payment creation
- `app/api/payments/webhook/route.ts` - Webhook handler
- `app/api/payments/release/route.ts` - Manual payment release
- `app/api/deliveries/update-status/route.ts` - Auto-release on delivery
- `app/api/stripe/connect/onboard/route.ts` - Stripe Connect onboarding
- `app/api/stripe/connect/dashboard/route.ts` - Express Dashboard access
- `components/StripeConnectOnboarding.tsx` - Onboarding UI
- `lib/stripe.ts` - Stripe client singleton

---

**Implementation Status**: ✅ **100% Complete**  
**Production Ready**: ✅ **Yes** (pending live Stripe credentials)  
**Testing Required**: ⚠️ **Yes** (use test mode first)

---

Made with ❤️ by the Courier Connect team
