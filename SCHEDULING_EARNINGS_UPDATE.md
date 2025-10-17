# Courier Connect - Scheduling & Earnings Update Summary

## Overview
This update adds comprehensive scheduling features, enhanced pricing algorithms, improved maps utilities, and detailed earnings tracking for couriers.

## Changes Made

### 1. DeliveryRequest Model Updates (`models/DeliveryRequest.ts`)

**Added Fields:**
- `packageSize`: Now strictly typed as `'small' | 'medium' | 'large' | 'extra-large'`
- `scheduledPickupTime`: String field for scheduled pickup time
- `scheduledDeliveryTime`: String field for scheduled delivery time  
- `isScheduled`: Boolean flag to mark scheduled deliveries (indexed)
- `courierRating`: Number field (1-5) for customer ratings

**Enhanced Features:**
- Package size is now an enum with validation
- Better scheduling support with separate date and time fields
- Rating system integrated into the model
- Improved indexing for scheduled deliveries

### 2. Pricing Algorithm (`lib/pricing.ts`)

**Already Implemented:**
- Distance-based pricing (€0.80/km)
- Urgency multipliers (standard: 1.0x, express: 1.5x, urgent: 2.0x, scheduled: 0.9x)
- Package size multipliers (small: 1.0x, medium: 1.2x, large: 1.5x, extra-large: 2.0x)
- Advance booking discount (10% for 24+ hours)
- 70/30 split (courier/platform)
- Minimum price enforcement (€5.00)

**Breakdown Includes:**
- Base price
- Distance price  
- Urgency price
- Package size price
- Scheduled discount
- Total price
- Courier earnings (70%)
- Platform fee (30%)

### 3. Maps Utility Enhancements (`lib/maps.ts`)

**New Functions Added:**
- `estimateDuration(distance)`: Calculates estimated delivery time based on distance
- `formatDistance(kilometers, locale)`: Formats distance for display (km or m)
- `formatDuration(minutes, locale)`: Formats duration for display (hours and minutes)

**Existing Functions:**
- `loadGoogleMaps()`: Loads Google Maps API
- `calculateRoute()`: Gets route with distance, duration, and polyline
- `calculateStraightLineDistance()`: Haversine formula fallback

### 4. New Components

#### CourierEarnings Component (`components/CourierEarnings.tsx`)
Displays comprehensive earnings dashboard with:
- **Main Stats**: Total, Today, This Week, This Month
- **Performance Metrics**: 
  - Completed deliveries
  - Today's deliveries  
  - Average earnings per delivery
- **Breakdown**:
  - Courier earnings (70%)
  - Platform fees (30%)
  - Total revenue
- Beautiful card-based layout with animations
- Cultural theming support

#### SchedulePicker Component (`components/SchedulePicker.tsx`)
Advanced scheduling interface with:
- **Pickup Schedule**: Date and time picker
- **Delivery Schedule**: Optional delivery date/time
- **Smart Features**:
  - Minimum date validation (today or later)
  - Minimum time validation (1 hour from now for today)
  - Auto-set delivery date based on pickup
  - Advance booking discount indicator (24+ hours)
- **Visual Feedback**:
  - Color-coded sections (blue for pickup, green for delivery)
  - Real-time formatted date/time display
  - Discount notification

### 5. API Enhancements

#### Courier Deliveries API (`app/api/courier/deliveries/route.ts`)

**Enhanced Statistics:**
- `totalEarnings`: Lifetime courier earnings
- `todayEarnings`: Earnings from today's deliveries
- `weekEarnings`: Last 7 days earnings
- `monthEarnings`: Current month earnings
- `completedDeliveries`: Total completed count
- `todayDeliveries`: Deliveries completed today
- `activeDeliveries`: Current in-progress deliveries
- `averageEarningsPerDelivery`: Average per delivery
- `platformFeesTotal`: Total platform fees collected

**Performance:**
- Uses MongoDB aggregation for efficient calculations
- Calculates time-based earnings dynamically
- No need to update courier model separately

### 6. Courier Dashboard Updates (`app/[locale]/courier/dashboard/page.tsx`)

**Integrated Components:**
- `CourierEarnings` component for comprehensive earnings display
- Enhanced stats state with all new earnings fields

**Display Features:**
- Time-based earnings breakdown
- Performance metrics
- Earnings vs platform fees visualization
- Real-time updates on delivery acceptance/completion

### 7. Translation Updates (`messages/en.json`)

**New Sections Added:**

**Scheduling:**
- `pickupSchedule`, `deliverySchedule`
- `scheduledFor`, `deliverBy`
- `advanceBookingDiscount`, `discount`
- `optional` indicator

**Earnings:**
- `week`, `month` (in addition to existing)
- `performance`: Section title
- `yourEarnings`: Courier's 70% share
- `platformFees`: Platform's 30% share
- `totalRevenue`: Combined total
- `split`, `courier`, `platform`: Labels for breakdown
- `completedDeliveries`, `todayDeliveries`
- `averagePerDelivery`

### 8. Delivery Request Form (`components/DeliveryRequestForm.tsx`)

**Already Implemented:**
- Date/time pickers for scheduled deliveries
- Live price preview with breakdown
- Map interface with route visualization
- Distance and duration calculation
- Package size selection (small/medium/large/extra-large)
- Urgency selection (standard/express/urgent/scheduled)

**Features:**
- Shows 10% discount for 24+ hour advance bookings
- Real-time price updates as user changes options
- Geocoding for address to coordinates conversion
- Route calculation with Google Maps
- Fallback to straight-line distance if Maps unavailable

## Usage Examples

### For Customers (Scheduling)

```typescript
// In the delivery request form
<SchedulePicker
  onScheduleChange={(schedule) => {
    setFormData({
      ...formData,
      scheduledPickupDate: schedule.pickupDate,
      scheduledPickupTime: schedule.pickupTime,
      scheduledDeliveryDate: schedule.deliveryDate,
      scheduledDeliveryTime: schedule.deliveryTime,
    });
  }}
  showDeliverySchedule={true}
/>
```

### For Couriers (Earnings Dashboard)

```typescript
// In courier dashboard
<CourierEarnings 
  data={{
    totalEarnings: 1250.50,
    todayEarnings: 89.20,
    weekEarnings: 420.75,
    monthEarnings: 1250.50,
    completedDeliveries: 45,
    todayDeliveries: 3,
    averageEarningsPerDelivery: 27.79,
    platformFeesTotal: 535.93,
  }}
/>
```

### Price Calculation

```typescript
import { calculateDeliveryPrice } from '@/lib/pricing';

const pricing = calculateDeliveryPrice({
  distance: 5.2, // km
  urgency: 'scheduled',
  scheduledPickupDate: new Date('2025-10-18T14:00:00'),
  packageSize: 'medium',
});

// Returns:
// {
//   basePrice: 3.00,
//   distancePrice: 4.16,
//   urgencyPrice: -0.72,
//   scheduledPrice: -0.64,
//   packageSizePrice: 1.43,
//   totalPrice: 7.23,
//   courierEarnings: 5.06,
//   platformFee: 2.17
// }
```

### Distance Calculation

```typescript
import { calculateRoute, formatDistance, formatDuration } from '@/lib/maps';

const route = await calculateRoute(
  { lat: 50.0755, lng: 14.4378 }, // Prague
  { lat: 50.0880, lng: 14.4208 }
);

console.log(formatDistance(route.distance, 'en')); // "3.2 km"
console.log(formatDuration(route.duration, 'en')); // "12 min"
```

## Database Schema Changes

No migration needed - all new fields are optional and have defaults:
- `scheduledPickupTime`: Optional string
- `scheduledDeliveryTime`: Optional string
- `isScheduled`: Defaults to `false`
- `courierRating`: Optional number (1-5)
- `packageSize`: Enum with default `'small'`

## API Response Example

**GET `/api/courier/deliveries?status=completed`**

```json
{
  "success": true,
  "deliveries": [...],
  "stats": {
    "totalEarnings": 1250.50,
    "todayEarnings": 89.20,
    "weekEarnings": 420.75,
    "monthEarnings": 1250.50,
    "completedDeliveries": 45,
    "todayDeliveries": 3,
    "activeDeliveries": 2,
    "averageEarningsPerDelivery": 27.79,
    "platformFeesTotal": 535.93,
    "rating": 4.8
  }
}
```

## Benefits

### For Customers
✅ Schedule deliveries in advance (10% discount for 24+ hours)
✅ See exact price breakdown before booking
✅ Visual map showing delivery route
✅ Flexible delivery time windows

### For Couriers
✅ Detailed earnings tracking (daily/weekly/monthly)
✅ Performance metrics and averages
✅ Clear 70/30 split visualization
✅ Scheduled deliveries allow better planning

### For Platform
✅ Better pricing transparency
✅ Encourages advance bookings (scheduling)
✅ Improved courier retention with detailed earnings
✅ Data-driven insights via aggregations

## Testing Checklist

- [ ] Create scheduled delivery 24+ hours in advance
- [ ] Verify 10% discount is applied
- [ ] Test date/time picker validation
- [ ] Check earnings calculation accuracy
- [ ] Verify time-based aggregations (today/week/month)
- [ ] Test map distance calculation
- [ ] Verify price breakdown matches total
- [ ] Test package size impact on pricing
- [ ] Verify courier dashboard displays all stats
- [ ] Test rating submission and display

## Next Steps (Optional Enhancements)

1. **Recurring Deliveries**: Allow customers to schedule weekly/monthly pickups
2. **Earnings Export**: CSV/PDF export for courier tax purposes
3. **Route Optimization**: Suggest optimal routes for multiple deliveries
4. **Push Notifications**: Alert couriers about scheduled deliveries 1 hour before
5. **Calendar Integration**: Sync scheduled deliveries with Google Calendar
6. **Advanced Analytics**: Charts and graphs for earnings trends
7. **Tip System**: Allow customers to add tips for excellent service

## Files Modified

- ✅ `models/DeliveryRequest.ts`
- ✅ `lib/pricing.ts` (already complete)
- ✅ `lib/maps.ts`
- ✅ `components/DeliveryRequestForm.tsx` (already complete)
- ✅ `app/api/courier/deliveries/route.ts`
- ✅ `app/[locale]/courier/dashboard/page.tsx`
- ✅ `messages/en.json`

## Files Created

- ✅ `components/CourierEarnings.tsx`
- ✅ `components/SchedulePicker.tsx`

---

**Status**: ✅ All requested features implemented successfully!
