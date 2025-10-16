# Quick Reference: Scheduling & Earnings Features

## 🗓️ Scheduling Features

### Using the SchedulePicker Component

```tsx
import SchedulePicker from '@/components/SchedulePicker';

<SchedulePicker
  onScheduleChange={(schedule) => {
    // schedule.pickupDate: "2025-10-18"
    // schedule.pickupTime: "14:30"
    // schedule.deliveryDate: "2025-10-18" (optional)
    // schedule.deliveryTime: "16:00" (optional)
  }}
  showDeliverySchedule={true} // Set false to hide delivery schedule
/>
```

### Scheduling Business Logic

**Discount Calculation:**
```typescript
const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
const hoursInAdvance = (pickupDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

if (hoursInAdvance >= 24) {
  // Apply 10% discount
  discount = totalPrice * 0.10;
}
```

**Validation Rules:**
- Minimum pickup time: 1 hour from now (if today)
- Delivery date: Must be same or after pickup date
- Format: ISO date (YYYY-MM-DD) and time (HH:MM)

## 💰 Earnings Tracking

### Using the CourierEarnings Component

```tsx
import CourierEarnings from '@/components/CourierEarnings';

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

### Fetching Earnings Data

```typescript
const response = await fetch('/api/courier/deliveries?status=completed', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { stats } = await response.json();
// stats contains all earnings data
```

## 💵 Pricing System

### Calculate Delivery Price

```typescript
import { calculateDeliveryPrice } from '@/lib/pricing';

const pricing = calculateDeliveryPrice({
  distance: 5.2,           // kilometers
  urgency: 'scheduled',     // standard | express | urgent | scheduled
  scheduledPickupDate: new Date('2025-10-18T14:00:00'),
  packageSize: 'medium',    // small | medium | large | extra-large
});
```

### Pricing Breakdown Result

```typescript
{
  basePrice: 3.00,              // Base delivery fee
  distancePrice: 4.16,          // 5.2 km × €0.80/km
  urgencyPrice: -0.72,          // Scheduled discount (0.9x multiplier)
  scheduledPrice: -0.64,        // 10% advance booking discount
  packageSizePrice: 1.43,       // Medium package (1.2x multiplier)
  totalPrice: 7.23,             // Final customer price
  courierEarnings: 5.06,        // 70% to courier
  platformFee: 2.17             // 30% to platform
}
```

### Pricing Constants

| Factor | Value | Description |
|--------|-------|-------------|
| Base Price | €3.00 | Minimum fee for any delivery |
| Price per KM | €0.80 | Distance-based pricing |
| Minimum Price | €5.00 | Floor price (enforced after calculations) |
| Courier Split | 70% | Courier's share of total price |
| Platform Fee | 30% | Platform's share of total price |

### Urgency Multipliers

| Level | Multiplier | Description |
|-------|------------|-------------|
| Standard | 1.0x | 2-4 hours delivery |
| Express | 1.5x | 1-2 hours delivery (+50%) |
| Urgent | 2.0x | < 1 hour delivery (+100%) |
| Scheduled | 0.9x | Future delivery (-10%) |

### Package Size Multipliers

| Size | Multiplier | Weight Range |
|------|------------|--------------|
| Small | 1.0x | < 5kg (envelopes, small boxes) |
| Medium | 1.2x | 5-15kg (standard packages) |
| Large | 1.5x | > 15kg (large boxes) |
| Extra-Large | 2.0x | Very large items |

## 🗺️ Maps & Distance

### Calculate Route

```typescript
import { calculateRoute } from '@/lib/maps';

const route = await calculateRoute(
  { lat: 50.0755, lng: 14.4378 }, // Origin
  { lat: 50.0880, lng: 14.4208 }  // Destination
);

// Returns:
// {
//   distance: 3.2,  // kilometers
//   duration: 12,   // minutes
//   polyline: "encoded_polyline_string",
//   bounds: { northeast: {...}, southwest: {...} }
// }
```

### Format Distance & Duration

```typescript
import { formatDistance, formatDuration } from '@/lib/maps';

formatDistance(3.2, 'en');    // "3.2 km"
formatDistance(0.8, 'en');    // "800 m"
formatDuration(65, 'en');     // "1h 5min"
formatDuration(45, 'en');     // "45 min"
```

### Fallback Distance Calculation

```typescript
import { calculateStraightLineDistance } from '@/lib/maps';

// Haversine formula (straight-line distance)
const distance = calculateStraightLineDistance(
  { lat: 50.0755, lng: 14.4378 },
  { lat: 50.0880, lng: 14.4208 }
);
// Returns distance in kilometers
```

## 📊 Database Fields

### DeliveryRequest Model

**Scheduling Fields:**
```typescript
{
  urgency: 'scheduled',
  scheduledPickupDate: new Date('2025-10-18'),
  scheduledPickupTime: '14:30',
  scheduledDeliveryDate: new Date('2025-10-18'),
  scheduledDeliveryTime: '16:00',
  isScheduled: true
}
```

**Pricing Fields:**
```typescript
{
  price: 7.23,                    // Total customer pays
  courierEarnings: 5.06,          // 70% to courier
  platformFee: 2.17,              // 30% to platform
  basePrice: 3.00,
  distancePrice: 4.16,
  urgencyPrice: -0.72,
  scheduledPrice: -0.64,
  packageSizePrice: 1.43,
  packageSize: 'medium'           // enum: small/medium/large/extra-large
}
```

**Rating Field:**
```typescript
{
  courierRating: 4.5  // 1-5 scale
}
```

## 🎨 Translation Keys

### Scheduling
```json
"scheduling": {
  "pickupSchedule": "Pickup Schedule",
  "deliverySchedule": "Delivery Schedule",
  "scheduledFor": "Scheduled for",
  "deliverBy": "Deliver by",
  "advanceBookingDiscount": "Advance booking discount",
  "discount": "discount"
}
```

### Earnings
```json
"courier": {
  "earnings": {
    "total": "Total Earnings",
    "today": "Today",
    "week": "This Week",
    "month": "This Month",
    "performance": "Performance Metrics",
    "yourEarnings": "Your Earnings (70%)",
    "platformFees": "Platform Fees (30%)",
    "totalRevenue": "Total Revenue",
    "completedDeliveries": "Completed Deliveries",
    "averagePerDelivery": "Average per Delivery"
  }
}
```

## 🔧 API Endpoints

### Get Courier Deliveries & Stats

**Request:**
```
GET /api/courier/deliveries?status=completed
Authorization: Bearer <token>
```

**Response:**
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

**Status Options:**
- `available` - Pending deliveries (not assigned)
- `active` - Deliveries in progress
- `completed` - Delivered successfully

## 🧪 Testing Examples

### Test Scheduled Delivery with Discount

```typescript
// Schedule for tomorrow at 2 PM
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(14, 0, 0, 0);

const pricing = calculateDeliveryPrice({
  distance: 8,
  urgency: 'scheduled',
  scheduledPickupDate: tomorrow,
  packageSize: 'small'
});

// Should apply 10% discount
expect(pricing.scheduledPrice).toBeLessThan(0);
```

### Test Earnings Aggregation

```typescript
// Fetch today's earnings
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const deliveries = await DeliveryRequest.find({
  courierId: userId,
  status: 'delivered',
  actualDelivery: { $gte: todayStart }
});

const todayEarnings = deliveries.reduce(
  (sum, d) => sum + d.courierEarnings, 
  0
);
```

## 📱 UI Components

### Price Preview (Live Update)

```tsx
// Auto-updates when form changes
useEffect(() => {
  if (distance && urgency && packageSize) {
    const pricing = calculateDeliveryPrice({
      distance,
      urgency,
      scheduledPickupDate,
      packageSize
    });
    setPriceBreakdown(pricing);
  }
}, [distance, urgency, packageSize, scheduledPickupDate]);
```

### Earnings Cards

```tsx
<div className="grid grid-cols-4 gap-4">
  <EarningsCard
    label="Today"
    value={formatCurrency(stats.todayEarnings)}
    icon={Calendar}
    color="blue"
  />
  <EarningsCard
    label="This Week"
    value={formatCurrency(stats.weekEarnings)}
    icon={TrendingUp}
    color="purple"
  />
  {/* ... */}
</div>
```

## 🚀 Quick Integration

### Add Scheduling to Existing Form

```tsx
// 1. Import component
import SchedulePicker from '@/components/SchedulePicker';

// 2. Add to form (step 3)
{formData.urgency === 'scheduled' && (
  <SchedulePicker
    onScheduleChange={(schedule) => {
      setFormData(prev => ({
        ...prev,
        scheduledPickupDate: schedule.pickupDate,
        scheduledPickupTime: schedule.pickupTime
      }));
    }}
  />
)}
```

### Add Earnings to Dashboard

```tsx
// 1. Import component
import CourierEarnings from '@/components/CourierEarnings';

// 2. Fetch stats
const { stats } = await fetch('/api/courier/deliveries?status=completed')
  .then(r => r.json());

// 3. Render component
<CourierEarnings data={stats} />
```

---

**Pro Tips:**
- ⚡ Cache route calculations to avoid repeated API calls
- 💾 Store pricing breakdown in delivery request for audit trail
- 📊 Use aggregation pipeline for efficient earnings queries
- 🎯 Validate scheduled dates on both client and server
- 🔒 Always verify JWT token before returning earnings data
