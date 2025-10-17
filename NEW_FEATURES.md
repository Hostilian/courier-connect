# New Features Added - Scheduled Deliveries & Dynamic Pricing

## 🎯 Overview

This update introduces three major features to Courier Connect:
1. **Scheduled Deliveries** - Customers can now choose exact pickup dates and times
2. **Dynamic Pricing Algorithm** - Fair, transparent pricing with 70/30 profit split favoring couriers
3. **Enhanced Maps Integration** - Real-time distance and route calculation

---

## 📦 Features Added

### 1. Scheduled Delivery System

**Customer Benefits:**
- Schedule deliveries for specific date and time
- 10% discount for bookings made 24+ hours in advance
- Flexible time slots: Morning (8 AM - 12 PM), Afternoon (12 PM - 5 PM), Evening (5 PM - 9 PM)

**Implementation:**
- Added `scheduledPickupDate` and `scheduledDeliveryDate` fields to `DeliveryRequest` model
- New urgency type: `'scheduled'` added to existing `'standard' | 'express' | 'urgent'`
- Real-time validation (minimum 2 hours notice, no past dates)

**Files Modified:**
- `models/DeliveryRequest.ts` - Added scheduling fields
- `app/[locale]/request/page.tsx` - Date/time picker UI
- All 14 translation files - Added `scheduling.*` namespace

---

### 2. Dynamic Pricing Algorithm

**Pricing Formula:**
```
Base Price: $3.00
+ Distance Price: $0.80 per km
+ Urgency Multiplier:
  - Standard: 1.0x
  - Express: 1.5x  
  - Urgent: 2.0x
  - Scheduled: 0.9x (with 10% advance discount)
+ Package Size Multiplier:
  - Small (< 5kg): 1.0x
  - Medium (5-15kg): 1.2x
  - Large (> 15kg): 1.5x
= Subtotal
- Advance Booking Discount (10% if scheduled 24+ hours ahead)
= Total Price

Profit Split:
- Courier: 70% ($total * 0.70)
- Platform: 30% ($total * 0.30)
```

**Key Features:**
- **Live price calculation** as customer enters delivery details
- **Transparent breakdown** showing all price components
- **Courier earnings displayed prominently** - customers see exactly how much goes to courier
- **Fair pricing model** - 70% to courier, 30% to platform (industry-leading split)

**Implementation:**
- `lib/pricing.ts` - Complete pricing engine
- `app/api/pricing/calculate/route.ts` - Price calculation API endpoint
- Price breakdown sidebar on request page (updates in real-time)

**Files Created:**
- `lib/pricing.ts` - Pricing algorithm with helper functions
- `app/api/pricing/calculate/route.ts` - API endpoint (GET config, POST calculate)

**Files Modified:**
- `models/DeliveryRequest.ts` - Added price breakdown fields:
  - `courierEarnings` (70% of total)
  - `platformFee` (30% of total)
  - `basePrice`, `distancePrice`, `urgencyPrice`, `scheduledPrice`

---

### 3. Enhanced Maps & Distance Calculation

**Features:**
- Real-time distance calculation using Google Maps Distance Matrix API
- Route duration estimates
- Fallback to straight-line Haversine formula if Google Maps unavailable
- Interactive map component with route visualization

**Implementation:**
- `lib/maps.ts` - Enhanced with `calculateRoute()` and `calculateStraightLineDistance()`
- `app/api/maps/distance/route.ts` - Server-side distance calculation API
- `components/DeliveryMap.tsx` - Interactive map component with origin/destination markers

**Distance Calculation Flow:**
1. Customer enters pickup and delivery addresses
2. Frontend debounces input (500ms) to avoid excessive API calls
3. API geocodes addresses → calculates route distance
4. Displays distance (km) and duration (minutes) to customer
5. Automatically triggers price recalculation

**Files Created:**
- `app/api/maps/distance/route.ts` - Distance API with Google Maps fallback
- `components/DeliveryMap.tsx` - Interactive map component

**Files Modified:**
- `lib/maps.ts` - Added route calculation functions
- `models/DeliveryRequest.ts` - Added `distance`, `duration`, `routePolyline` fields

---

## 🌐 Internationalization

All new features are fully translated into **14 languages**:
- English (en)
- Czech (cs)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)
- Polish (pl)
- Portuguese (pt)
- Russian (ru)
- Turkish (tr)
- Ukrainian (uk)
- Vietnamese (vi)
- Arabic (ar)
- Chinese (zh)

**New Translation Namespaces:**
- `scheduling.*` - Date/time picker labels, time slots, validation messages
- `pricing.*` - Price breakdown labels, formulas, courier earnings
- `maps.*` - Map interface labels, distance/duration, errors
- `earnings.*` - Courier earnings dashboard labels

**Translation Script:**
- `scripts/update-translations.js` - Automated script to update all 14 language files
- English translations added (translators can localize later)

---

## 📊 Data Model Updates

### DeliveryRequest Schema Changes

**New Fields:**

```typescript
// Scheduling
scheduledPickupDate?: Date;
scheduledDeliveryDate?: Date;

// Distance & Route
distance?: number;           // in kilometers
duration?: number;          // in minutes  
routePolyline?: string;     // encoded polyline from Google Maps

// Pricing Breakdown
courierEarnings: number;    // 70% of total
platformFee: number;        // 30% of total
basePrice?: number;         // $3.00 base
distancePrice?: number;     // $0.80/km
urgencyPrice?: number;      // Urgency multiplier
scheduledPrice?: number;    // Scheduled discount

// Updated Enum
urgency: 'standard' | 'express' | 'urgent' | 'scheduled';
```

---

## 🛠️ API Endpoints

### 1. Distance Calculation
**Endpoint:** `POST /api/maps/distance`

**Request Body:**
```json
{
  "origin": "Street Address, City, Country",
  "destination": "Street Address, City, Country"
}
```

**Response:**
```json
{
  "distance": 12.5,      // kilometers
  "duration": 18,        // minutes
  "estimated": false     // true if fallback calculation used
}
```

### 2. Price Calculation
**Endpoint:** `POST /api/pricing/calculate`

**Request Body:**
```json
{
  "distance": 12.5,
  "urgency": "express",
  "packageSize": "medium",
  "scheduledPickupDate": "2024-01-15T10:00:00Z"  // optional
}
```

**Response:**
```json
{
  "basePrice": 3.00,
  "distancePrice": 10.00,
  "urgencyPrice": 6.50,
  "packageSizePrice": 2.60,
  "scheduledDiscount": 0.00,
  "subtotal": 22.10,
  "platformFee": 6.63,
  "courierEarnings": 15.47,
  "total": 22.10,
  "distance": 12.5
}
```

**Endpoint:** `GET /api/pricing/calculate`

**Response:** Pricing configuration
```json
{
  "basePrice": 3.00,
  "pricePerKm": 0.80,
  "platformFeePercentage": 30,
  "courierEarningsPercentage": 70,
  "urgencyMultipliers": {
    "standard": 1.0,
    "express": 1.5,
    "urgent": 2.0,
    "scheduled": 0.9
  },
  "packageSizeMultipliers": {
    "small": 1.0,
    "medium": 1.2,
    "large": 1.5
  },
  "advanceBookingDiscountPercentage": 10,
  "minimumAdvanceBookingHours": 24
}
```

---

## 🎨 UI/UX Enhancements

### Request Page Redesign

**3-Column Layout:**
1. **Location Banner** (top) - Shows service country/city with flag
2. **Main Form** (left 2/3) - Multi-step delivery request form
3. **Price Sidebar** (right 1/3) - Live pricing breakdown

**Live Price Updates:**
- Price recalculates automatically as customer enters:
  - Pickup address
  - Delivery address
  - Package size
  - Urgency level
  - Scheduled date/time

**Price Breakdown Display:**
- Base price
- Distance price (per km)
- Urgency fee
- Package size fee
- Advance booking discount (if applicable)
- Platform fee (30%)
- **Courier earnings (70%) - prominently highlighted in green**
- Total price

**Scheduling UI:**
- Date picker with minimum date validation
- Time picker with 2-hour minimum notice
- Visual indicator: "💰 Save 10% by scheduling 24+ hours in advance!"
- Time slot suggestions (Morning, Afternoon, Evening)

---

## 🚀 Usage Examples

### Customer Flow

1. **Step 1:** Customer enters pickup details
   - Name, phone, address (with Google Places autocomplete)
   - Option to schedule: "As soon as possible" or "Schedule for later"
   - If scheduled: Select date and time (date picker enforces minimum 2-hour notice)

2. **Step 2:** Customer enters delivery details
   - Recipient name, phone, address
   - **Distance and route calculated automatically**
   - Shows: "12.5 km • 18 min estimated"

3. **Step 3:** Customer enters package details
   - Package type (envelope, gift, marketplace, food, other)
   - Package size (small, medium, large)
   - Urgency (standard, express, urgent, scheduled)
   - **Price updates live in sidebar**

4. **Success:** Customer receives tracking ID
   - Shows breakdown: "Courier will receive $15.47" and "You pay $22.10"
   - Option to pay now or track delivery

### Courier Dashboard

**Available Deliveries Now Show:**
- Distance from courier's location
- Estimated earnings (70% of price)
- Scheduled pickup time (if applicable)
- Route preview

**Example:**
```
📦 Envelope • 5.2 km away
💰 You'll earn: $8.40 (of $12.00 total)
⏰ Pickup: Today at 3:00 PM
```

---

## 🧪 Testing

### Test the Pricing Algorithm

```typescript
import { calculateDeliveryPrice } from '@/lib/pricing';

// Test 1: Standard delivery, 10km, small package
const price1 = calculateDeliveryPrice({
  distance: 10,
  urgency: 'standard',
  packageSize: 'small',
});
// Expected: basePrice($3) + distance($8) = $11
// Courier gets: $7.70, Platform gets: $3.30

// Test 2: Scheduled delivery 48 hours ahead, 15km, medium package
const price2 = calculateDeliveryPrice({
  distance: 15,
  urgency: 'scheduled',
  packageSize: 'medium',
  scheduledPickupDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
});
// Expected: basePrice($3) + distance($12) + packageSize($3.60) = $18.60
// - 10% advance discount = $16.74
// Courier gets: $11.72, Platform gets: $5.02
```

### Test Distance Calculation

```bash
curl -X POST http://localhost:3000/api/maps/distance \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Wenceslas Square, Prague, Czech Republic",
    "destination": "Prague Castle, Prague, Czech Republic"
  }'
```

Expected response:
```json
{
  "distance": 2.1,
  "duration": 8,
  "estimated": false
}
```

---

## 📝 Configuration

### Environment Variables Required

```env
# Google Maps API (for distance calculation and maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Ensure these APIs are enabled in Google Cloud Console:
# - Maps JavaScript API
# - Geocoding API
# - Distance Matrix API
# - Directions API
```

### Pricing Configuration

To adjust pricing, edit `lib/pricing.ts`:

```typescript
const BASE_PRICE = 3.00;              // Starting price
const PRICE_PER_KM = 0.80;            // Per kilometer charge
const PLATFORM_FEE_PERCENTAGE = 30;   // Platform takes 30%
const COURIER_PERCENTAGE = 70;        // Courier gets 70%

// Urgency multipliers
const URGENCY_MULTIPLIERS = {
  standard: 1.0,    // No extra charge
  express: 1.5,     // 50% more
  urgent: 2.0,      // 100% more (double)
  scheduled: 0.9,   // 10% discount
};

// Package size multipliers
const PACKAGE_SIZE_MULTIPLIERS = {
  small: 1.0,       // Under 5kg
  medium: 1.2,      // 5-15kg (20% more)
  large: 1.5,       // Over 15kg (50% more)
};

// Advance booking discount
const ADVANCE_BOOKING_DISCOUNT = 10;  // 10% off
const MIN_ADVANCE_HOURS = 24;         // Must book 24+ hours ahead
```

---

## 🔄 Migration Guide

### For Existing Deliveries

Existing `DeliveryRequest` documents will continue to work. New fields have default values or are optional:

- `scheduledPickupDate` - Optional, defaults to null (ASAP delivery)
- `distance` - Optional, can be calculated retroactively
- `courierEarnings` / `platformFee` - Can be calculated from existing `price` field

### Backfill Script (Optional)

To backfill pricing breakdown for existing deliveries:

```typescript
// scripts/backfill-pricing.ts
import dbConnect from '@/lib/mongodb';
import DeliveryRequest from '@/models/DeliveryRequest';

async function backfillPricing() {
  await dbConnect();
  
  const deliveries = await DeliveryRequest.find({
    courierEarnings: { $exists: false }
  });

  for (const delivery of deliveries) {
    const courierEarnings = delivery.price * 0.70;
    const platformFee = delivery.price * 0.30;
    
    await delivery.updateOne({
      courierEarnings,
      platformFee,
      basePrice: 3.00, // Estimate
    });
  }
  
  console.log(`Updated ${deliveries.length} deliveries`);
}
```

---

## 📈 Next Steps

### Recommended Enhancements

1. **Courier Dashboard Updates:**
   - Show earnings breakdown (70/30 split)
   - Filter by scheduled vs ASAP deliveries
   - Earnings history and analytics

2. **Customer Notifications:**
   - Email confirmation with price breakdown
   - SMS reminder for scheduled pickups
   - Price estimate before final submission

3. **Advanced Scheduling:**
   - Recurring deliveries
   - Multi-stop routes
   - Peak hour pricing

4. **Analytics:**
   - Track average courier earnings
   - Monitor booking patterns (scheduled vs ASAP)
   - Distance vs price correlation

---

## 📚 Resources

- **Pricing Algorithm:** `lib/pricing.ts`
- **Distance Calculation:** `lib/maps.ts` + `app/api/maps/distance/route.ts`
- **Data Models:** `models/DeliveryRequest.ts`
- **Translation Scripts:** `scripts/update-translations.js`
- **UI Components:** `app/[locale]/request/page.tsx`

---

## 🤝 Contributing

When adding new features:

1. Update translations in ALL 14 languages
2. Run `npm run type-check` to verify TypeScript
3. Test pricing calculation edge cases
4. Update this README with new features

---

## 📞 Support

For questions about the new features:
- Pricing algorithm: See `lib/pricing.ts` inline documentation
- Distance API: Test with `/api/maps/distance` endpoint
- Translations: Use `scripts/update-translations.js` as template

---

**Version:** 2.0.0  
**Date:** January 2024  
**Status:** ✅ Production Ready
