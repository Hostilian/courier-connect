// Pricing calculation for Courier Connect
// 70% to courier, 30% platform fee

export interface PricingInput {
  distance: number; // kilometers
  urgency: 'standard' | 'express' | 'urgent' | 'scheduled';
  scheduledPickupDate?: Date;
  packageSize: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface PricingBreakdown {
  basePrice: number;
  distancePrice: number;
  urgencyPrice: number;
  scheduledPrice: number;
  packageSizePrice: number;
  totalPrice: number;
  courierEarnings: number; // 70%
  platformFee: number; // 30%
}

// Pricing constants (in USD/EUR)
const PRICING_CONFIG = {
  // Base price for any delivery
  BASE_PRICE: 3.00,
  
  // Price per kilometer
  PRICE_PER_KM: 0.80,
  
  // Minimum price
  MINIMUM_PRICE: 5.00,
  
  // Urgency multipliers
  URGENCY_MULTIPLIERS: {
    standard: 1.0, // No extra charge
    express: 1.5, // 50% more
    urgent: 2.0, // 100% more (double)
    scheduled: 0.9, // 10% discount for flexibility
  },
  
  // Package size multipliers
  PACKAGE_SIZE_MULTIPLIERS: {
    'small': 1.0, // envelope, small package
    'medium': 1.2, // box, bag
    'large': 1.5, // large box
    'extra-large': 2.0, // very large item
  },
  
  // Scheduled delivery discount (if scheduled 24+ hours in advance)
  ADVANCE_BOOKING_DISCOUNT: 0.10, // 10% off
  ADVANCE_BOOKING_HOURS: 24,
  
  // Profit split
  COURIER_PERCENTAGE: 0.70, // 70% to courier
  PLATFORM_PERCENTAGE: 0.30, // 30% platform fee
};

/**
 * Calculate delivery price based on distance, urgency, and other factors
 */
export function calculateDeliveryPrice(input: PricingInput): PricingBreakdown {
  const { distance, urgency, scheduledPickupDate, packageSize } = input;
  
  // 1. Base price
  const basePrice = PRICING_CONFIG.BASE_PRICE;
  
  // 2. Distance price
  const distancePrice = distance * PRICING_CONFIG.PRICE_PER_KM;
  
  // 3. Package size multiplier
  const packageSizeMultiplier = PRICING_CONFIG.PACKAGE_SIZE_MULTIPLIERS[packageSize] || 1.0;
  const packageSizePrice = (basePrice + distancePrice) * (packageSizeMultiplier - 1);
  
  // 4. Urgency multiplier
  const urgencyMultiplier = PRICING_CONFIG.URGENCY_MULTIPLIERS[urgency];
  
  // 5. Calculate subtotal before urgency
  let subtotal = basePrice + distancePrice + packageSizePrice;
  
  // 6. Apply urgency multiplier
  const urgencyPrice = subtotal * (urgencyMultiplier - 1);
  subtotal = subtotal * urgencyMultiplier;
  
  // 7. Scheduled delivery discount (if booked in advance)
  let scheduledPrice = 0;
  if (urgency === 'scheduled' && scheduledPickupDate) {
    const hoursInAdvance = (scheduledPickupDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursInAdvance >= PRICING_CONFIG.ADVANCE_BOOKING_HOURS) {
      scheduledPrice = -subtotal * PRICING_CONFIG.ADVANCE_BOOKING_DISCOUNT;
      subtotal = subtotal * (1 - PRICING_CONFIG.ADVANCE_BOOKING_DISCOUNT);
    }
  }
  
  // 8. Apply minimum price
  const totalPrice = Math.max(subtotal, PRICING_CONFIG.MINIMUM_PRICE);
  
  // 9. Calculate 70/30 split
  const courierEarnings = totalPrice * PRICING_CONFIG.COURIER_PERCENTAGE;
  const platformFee = totalPrice * PRICING_CONFIG.PLATFORM_PERCENTAGE;
  
  return {
    basePrice: Number(basePrice.toFixed(2)),
    distancePrice: Number(distancePrice.toFixed(2)),
    urgencyPrice: Number(urgencyPrice.toFixed(2)),
    scheduledPrice: Number(scheduledPrice.toFixed(2)),
    packageSizePrice: Number(packageSizePrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
    courierEarnings: Number(courierEarnings.toFixed(2)),
    platformFee: Number(platformFee.toFixed(2)),
  };
}

/**
 * Get estimated delivery time based on distance and urgency
 */
export function getEstimatedDeliveryTime(
  distance: number,
  urgency: 'standard' | 'express' | 'urgent' | 'scheduled',
  scheduledDeliveryDate?: Date
): Date {
  if (urgency === 'scheduled' && scheduledDeliveryDate) {
    return scheduledDeliveryDate;
  }
  
  // Average speed: 30 km/h in city
  const averageSpeed = 30;
  const travelTimeHours = distance / averageSpeed;
  
  // Add buffer time based on urgency
  const bufferTime = {
    standard: 2, // 2 hours buffer
    express: 0.5, // 30 minutes buffer
    urgent: 0.25, // 15 minutes buffer
    scheduled: 0,
  };
  
  const totalHours = travelTimeHours + (bufferTime[urgency] || 2);
  const estimatedTime = new Date();
  estimatedTime.setHours(estimatedTime.getHours() + totalHours);
  
  return estimatedTime;
}

/**
 * Calculate earnings for a courier for multiple deliveries
 */
export function calculateCourierTotalEarnings(deliveries: Array<{ price: number }>): number {
  const total = deliveries.reduce((sum, delivery) => {
    return sum + (delivery.price * PRICING_CONFIG.COURIER_PERCENTAGE);
  }, 0);
  
  return Number(total.toFixed(2));
}

/**
 * Get pricing config for display purposes
 */
export function getPricingConfig() {
  return {
    basePrice: PRICING_CONFIG.BASE_PRICE,
    pricePerKm: PRICING_CONFIG.PRICE_PER_KM,
    minimumPrice: PRICING_CONFIG.MINIMUM_PRICE,
    courierPercentage: PRICING_CONFIG.COURIER_PERCENTAGE * 100,
    platformPercentage: PRICING_CONFIG.PLATFORM_PERCENTAGE * 100,
    urgencyMultipliers: PRICING_CONFIG.URGENCY_MULTIPLIERS,
    advanceBookingDiscount: PRICING_CONFIG.ADVANCE_BOOKING_DISCOUNT * 100,
  };
}
