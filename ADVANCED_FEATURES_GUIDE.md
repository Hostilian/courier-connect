# 🚀 Courier Connect - Advanced Features Implementation

## Overview
This document describes the comprehensive set of advanced features added to Courier Connect, including BlaBlaCar-style interactive maps, real-time tracking, delivery preferences, and courier management tools.

---

## 🆕 New Features Summary

### ✅ **Already Implemented**
1. **Date/Time Scheduling** - SchedulePicker component with flexible pickup/delivery times
2. **Dynamic Pricing Algorithm** - 70/30 split with distance, urgency, and package size factors
3. **Earnings Dashboard** - Detailed courier earnings tracking (daily/weekly/monthly)
4. **Basic Maps Integration** - Google Maps with route calculation

### 🎉 **Newly Added Features**

#### **For Customers:**
1. **InteractiveMap Component** - BlaBlaCar-style map selection
2. **LiveTrackingMap Component** - Real-time delivery tracking
3. **DeliveryPreferencesForm** - Comprehensive delivery options
4. **Enhanced Scheduling** - Any date/time selection with discounts

#### **For Couriers:**
1. **CourierFeatures Component** - Advanced courier preferences
2. **Auto-Accept System** - Automatic delivery acceptance based on criteria
3. **Service Area Configuration** - Customizable delivery radius
4. **Working Schedule Management** - Set availability hours/days
5. **Enhanced Earnings** - Real-time earnings calculation with time-based breakdowns

---

## 📦 Component Details

### 1. InteractiveMap Component (`components/InteractiveMap.tsx`)

**BlaBlaCar-Style Features:**
- ✅ Click-to-select locations on map
- ✅ Search bar with autocomplete (Google Places)
- ✅ Current location detection
- ✅ Visual route display with distance/duration
- ✅ Draggable markers (A for pickup, B for delivery)
- ✅ Real-time route calculation
- ✅ Beautiful UI with search results dropdown

**Usage:**
```tsx
<InteractiveMap
  onOriginSelect={(location) => console.log('Pickup:', location)}
  onDestinationSelect={(location) => console.log('Delivery:', location)}
  mode="select-origin" // or "select-destination" or "view-route"
  showMyLocation={true}
  height="500px"
/>
```

**Features:**
- **Modes**: `select-origin`, `select-destination`, `view-route`
- **Search**: Type address or place name, get instant results
- **Click Selection**: Click anywhere on map to set location
- **Current Location**: One-click GPS location detection
- **Route Visualization**: Automatic route drawing with distance/time
- **Mobile-Friendly**: Responsive design with touch support

---

### 2. LiveTrackingMap Component (`components/LiveTrackingMap.tsx`)

**Real-Time Tracking Features:**
- ✅ Live courier location (blue bouncing marker)
- ✅ Pickup location (green marker - A)
- ✅ Delivery location (red marker - B)
- ✅ Route visualization
- ✅ Auto-refresh every 30 seconds
- ✅ Info cards with sender/receiver/courier details
- ✅ ETA display
- ✅ Distance and duration
- ✅ Status indicator
- ✅ Contact courier button (call/text)

**Usage:**
```tsx
<LiveTrackingMap
  delivery={ {
    trackingId: "CC-ABC123",
    status: "in_transit",
    senderName: "John Doe",
    senderAddress: "123 Main St",
    senderLocation: { lat: 50.0755, lng: 14.4378 },
    receiverName: "Jane Smith",
    receiverAddress: "456 Oak Ave",
    receiverLocation: { lat: 50.0880, lng: 14.4208 },
    courierName: "Mike Courier",
    courierLocation: { lat: 50.0800, lng: 14.4300 },
    courierPhone: "+420 123 456 789",
    estimatedDelivery: "2025-10-16T15:30:00",
    distance: "3.2 km",
    duration: "12 min"
  }}
  showCourierLocation={true}
  autoRefresh={true}
  refreshInterval={30000}
  height="600px"
/>
```

**Features:**
- **Live Indicator**: Pulsing dot shows "Live Tracking" when courier is moving
- **Info Windows**: Click markers to see detailed information
- **Contact Options**: Direct call/text links to courier
- **Auto-Refresh**: Configurable refresh interval (default 30s)
- **Status Colors**: Visual status indicators (pending, in_transit, delivered, etc.)

---

### 3. DeliveryPreferencesForm Component (`components/DeliveryPreferencesForm.tsx`)

**Customer Preferences:**

#### **Package Details**
- 📦 Package value input (for insurance calculation)
- 🛡️ Insurance option (1% of value, $1-$50 range)
- ⚠️ Fragile item checkbox

#### **Delivery Preferences**
- ✍️ Signature required
- 🚪 Leave at door option
- 📸 Photo proof of delivery
- 🔒 Mutually exclusive (signature OR leave at door)

#### **Communication**
- 🔔 Notify before arrival (5/10/15/30 min options)
- 📞 Contact preference (call, text, or both)

#### **Courier Preferences**
- ⭐ Minimum courier rating (3.0 to 5.0 stars)
- 📝 Special instructions (200 char limit)

**Usage:**
```tsx
<DeliveryPreferencesForm
  onPreferencesChange={(prefs) => {
    console.log('Insurance:', prefs.insurance);
    console.log('Fragile:', prefs.fragile);
    console.log('Signature:', prefs.signatureRequired);
    console.log('Min Rating:', prefs.preferredCourierRating);
  }}
  initialPreferences={{
    insurance: false,
    fragile: false,
    signatureRequired: false,
    leaveAtDoor: true,
    notifyBeforeArrival: true,
    notifyMinutes: 10
  }}
/>
```

**Insurance Calculation:**
```typescript
// 1% of package value, min $1, max $50
insuranceCost = Math.min(Math.max(packageValue * 0.01, 1), 50);
```

---

### 4. CourierFeatures Component (`components/CourierFeatures.tsx`)

**Courier Advanced Settings:**

#### **Auto-Accept Settings**
- ✅ Enable/disable automatic acceptance
- 💰 Minimum price threshold ($3-$50)
- 📏 Maximum distance threshold (1-50 km)
- 🤖 Smart matching based on preferences

#### **Service Area**
- 🗺️ Preferred radius (1-50 km)
- 📍 Prioritization for nearby deliveries

#### **Vehicle & Capacity**
- 🚲 Vehicle type (bike, motorcycle, car, van)
- 📦 Max package size (small, medium, large, extra-large)

#### **Working Schedule**
- 📅 Working days selection (Mon-Sun)
- 🕐 Start time (24-hour format)
- 🕔 End time (24-hour format)
- ⏰ Automatic availability filtering

#### **Notifications**
- 📬 New deliveries
- ⏱️ Near deadline
- 💵 Earnings updates
- 💬 Messages

#### **Battery Optimization**
- 🔋 Reduce GPS updates when idle
- ⚡ Save battery between deliveries

**Usage:**
```tsx
<CourierFeatures
  onPreferencesChange={(prefs) => {
    console.log('Auto-accept:', prefs.acceptAutomatic);
    console.log('Min price:', prefs.minimumPrice);
    console.log('Radius:', prefs.preferredRadius);
    console.log('Vehicle:', prefs.vehicleType);
    console.log('Working days:', prefs.workingDays);
  }}
  initialPreferences={{
    acceptAutomatic: false,
    preferredRadius: 10,
    minimumPrice: 5,
    vehicleType: 'car',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  }}
/>
```

---

## 💰 Enhanced Pricing Algorithm

### Current Pricing Formula

```typescript
const pricing = calculateDeliveryPrice({
  distance: 5.2,              // km
  urgency: 'scheduled',        // standard | express | urgent | scheduled
  scheduledPickupDate: new Date('2025-10-18T14:00:00'),
  packageSize: 'medium'        // small | medium | large | extra-large
});
```

### Breakdown Components

| Component | Calculation | Example |
|-----------|-------------|---------|
| **Base Price** | Fixed €3.00 | €3.00 |
| **Distance** | €0.80 × km | €4.16 (5.2 km) |
| **Package Size** | Multiplier | €1.43 (medium = 1.2x) |
| **Urgency** | Multiplier | -€0.72 (scheduled = 0.9x) |
| **Advance Booking** | -10% if 24+ hrs | -€0.64 |
| **Total** | Sum of all | €7.23 |
| **Courier (70%)** | Total × 0.7 | €5.06 |
| **Platform (30%)** | Total × 0.3 | €2.17 |

### Urgency Multipliers

| Type | Multiplier | Time Window | Extra Cost |
|------|------------|-------------|-----------|
| Standard | 1.0x | 2-4 hours | +€0 |
| Express | 1.5x | 1-2 hours | +50% |
| Urgent | 2.0x | < 1 hour | +100% |
| Scheduled | 0.9x | Future | -10% |

### Package Size Multipliers

| Size | Multiplier | Weight | Extra Cost |
|------|------------|--------|-----------|
| Small | 1.0x | < 5kg | +€0 |
| Medium | 1.2x | 5-15kg | +20% |
| Large | 1.5x | > 15kg | +50% |
| Extra-Large | 2.0x | Very large | +100% |

### Special Discounts

**Advance Booking (24+ hours)**
- Discount: 10% off total price
- Condition: Scheduled pickup at least 24 hours in advance
- Example: €8.00 → €7.20 (saves €0.80)

---

## 🗺️ Maps Integration

### Google Maps Features

**1. InteractiveMap**
- Places API for search autocomplete
- Geocoding API for address ↔ coordinates
- Directions API for route calculation
- Maps JavaScript API for rendering

**2. LiveTrackingMap**
- Real-time marker updates
- Route polyline drawing
- Info windows with rich content
- Bounds fitting for optimal view

**3. DeliveryMap (Existing)**
- Static route display
- Pickup and delivery markers
- Distance and duration labels

### API Configuration

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Required APIs:**
- Maps JavaScript API
- Places API
- Geocoding API
- Directions API

---

## 📱 User Flows

### **Customer Journey**

1. **Request Delivery**
   - Use InteractiveMap to select pickup/delivery locations
   - Set date/time with SchedulePicker
   - Configure preferences with DeliveryPreferencesForm
   - See live price preview
   - Submit request

2. **Track Delivery**
   - Receive tracking ID
   - Access LiveTrackingMap
   - See courier's real-time location
   - Get notifications before arrival
   - Contact courier if needed
   - Receive photo proof

3. **Rate Experience**
   - Rate courier (1-5 stars)
   - Leave feedback

### **Courier Journey**

1. **Configure Preferences**
   - Set up auto-accept criteria with CourierFeatures
   - Define service area radius
   - Set working schedule
   - Choose vehicle type and capacity
   - Enable notifications

2. **Receive Deliveries**
   - Get notified of new deliveries
   - Auto-accept if criteria match
   - View delivery details on map
   - Accept manually if desired

3. **Complete Delivery**
   - Navigate using map route
   - Update status (picked_up, in_transit)
   - Take photo proof
   - Mark as delivered
   - Earn 70% of price

4. **Track Earnings**
   - View real-time earnings with CourierEarnings
   - See daily/weekly/monthly breakdowns
   - Monitor performance metrics

---

## 🎨 UI/UX Highlights

### Design Principles
- **Mobile-First**: All components responsive
- **Touch-Friendly**: Large tap targets, swipe gestures
- **Cultural Theming**: Adapts to locale preferences
- **Accessibility**: Semantic HTML, ARIA labels
- **Performance**: Lazy loading, optimized assets

### Visual Feedback
- 🎯 Loading spinners during map initialization
- ✨ Animations for marker drops
- 🔄 Auto-refresh indicators
- ✅ Success/error states
- 📊 Progress indicators

---

## 🔧 Technical Implementation

### State Management
```typescript
// Component-level state
const [origin, setOrigin] = useState<Location | undefined>();
const [destination, setDestination] = useState<Location | undefined>();
const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

// Parent callbacks
onOriginSelect={(location) => {
  // Update parent state
}}
```

### Map Initialization
```typescript
useEffect(() => {
  const initMap = async () => {
    const google = await loadGoogleMaps();
    const map = new google.maps.Map(mapRef.current!, {
      center: { lat: 50.0755, lng: 14.4378 },
      zoom: 12,
      ...options
    });
    setMap(map);
  };
  initMap();
}, []);
```

### Route Calculation
```typescript
const directionsService = new google.maps.DirectionsService();
directionsService.route(
  {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING
  },
  (result, status) => {
    if (status === 'OK') {
      // Display route
      directionsRenderer.setDirections(result);
    }
  }
);
```

---

## 📊 Database Schema Extensions

### DeliveryRequest Model Updates

```typescript
interface IDeliveryRequest {
  // ... existing fields ...
  
  // Scheduling
  scheduledPickupTime?: string;
  scheduledDeliveryTime?: string;
  isScheduled: boolean;
  
  // Preferences
  preferences?: {
    insurance: boolean;
    fragile: boolean;
    signatureRequired: boolean;
    leaveAtDoor: boolean;
    deliveryProofRequired: boolean;
    notifyBeforeArrival: boolean;
    notifyMinutes?: number;
    specialInstructions?: string;
  };
  
  // Courier tracking
  courierLocation?: { lat: number; lng: number };
  courierRating?: number;
}
```

### User Model (Courier) Updates

```typescript
interface ICourierUser {
  // ... existing fields ...
  
  preferences?: {
    acceptAutomatic: boolean;
    preferredRadius: number;
    minimumPrice: number;
    maximumDistance: number;
    workingHours: { start: string; end: string };
    workingDays: string[];
    vehicleType: string;
    maxPackageSize: string;
    batteryOptimization: boolean;
  };
}
```

---

## 🚀 Deployment Checklist

- [ ] Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable
- [ ] Enable required Google Maps APIs
- [ ] Test all map components in production
- [ ] Configure CORS for Maps API
- [ ] Set up auto-refresh intervals for live tracking
- [ ] Test on mobile devices (iOS and Android)
- [ ] Verify pricing calculations
- [ ] Test courier auto-accept logic
- [ ] Monitor API usage and costs
- [ ] Set up error tracking (Sentry, etc.)

---

## 📈 Future Enhancements

### Planned Features
1. **Multi-Stop Deliveries** - Courier picks up from multiple locations
2. **Route Optimization** - AI-powered best route calculation
3. **Push Notifications** - Firebase Cloud Messaging integration
4. **In-App Chat** - Direct messaging between customer and courier
5. **Tip System** - Allow customers to tip couriers
6. **Recurring Deliveries** - Schedule weekly/monthly pickups
7. **Analytics Dashboard** - Detailed business insights
8. **Referral Program** - Earn credits for referrals

### Technical Improvements
- [ ] Service Workers for offline support
- [ ] WebSocket for real-time updates
- [ ] Redis caching for faster route calculations
- [ ] Geolocation clustering for nearby deliveries
- [ ] Machine learning for pricing optimization

---

## 📝 Translation Keys Added

```json
{
  "maps": {
    "searchOrigin": "Search pickup location...",
    "searchDestination": "Search delivery location...",
    "selectOrigin": "Click on the map to select pickup location",
    "selectDestination": "Click on the map to select delivery location"
  },
  "preferences": {
    "packageDetails": "Package Details",
    "insurance": "Add Insurance",
    "fragile": "Fragile Item",
    "deliveryPreferences": "Delivery Preferences",
    "signatureRequired": "Signature Required",
    "leaveAtDoor": "Leave at Door",
    "photoProof": "Photo Proof of Delivery",
    "communication": "Communication Preferences",
    "courierPreferences": "Courier Preferences",
    "minimumRating": "Minimum Courier Rating"
  }
}
```

---

## 🎯 Success Metrics

### For Customers
- ✅ Reduced booking time (interactive map vs manual address entry)
- ✅ Increased satisfaction (real-time tracking visibility)
- ✅ Higher completion rate (delivery preferences reduce issues)

### For Couriers
- ✅ More deliveries accepted (auto-accept feature)
- ✅ Better work-life balance (working schedule control)
- ✅ Higher earnings transparency (real-time dashboard)

### For Platform
- ✅ Reduced support tickets (clear delivery status)
- ✅ Increased retention (better UX)
- ✅ Higher GMV (more deliveries completed)

---

**Status**: ✅ All advanced features implemented and documented!

**Next Steps**: Test components, gather user feedback, iterate based on metrics.
