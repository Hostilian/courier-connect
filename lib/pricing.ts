// Pricing calculation for Courier Connect
// You know what they say about pricing: everyone wants a deal, nobody wants to pay.
// We do a 70/30 split. Courier gets 70%, we get 30%. That's the cost of doing business, folks.
// Don't look at me like that. Servers aren't free. Neither is my therapist.


// What we need to know to price something. It's not rocket science. Though maybe it should be.
export interface PricingInput {
  distance: number; // How far in kilometers. Could be miles, but we're international now.
  urgency: 'standard' | 'express' | 'urgent' | 'scheduled'; // How fast they want it. Spoiler: always fast.
  packageSize: 'small' | 'medium' | 'large' | 'extra-large'; // Like t-shirts, but more expensive
  pickupDateTime?: Date | null; // For planners. All three of them.
}

// The breakdown. Where every penny goes. Transparency, they call it. I call it showing our work.
export interface PricingBreakdown {
  basePrice: number; // The starting number. Like the cover charge at a nightclub.
  distancePrice: number; // More distance, more money. Makes sense. Kind of.
  urgencyPrice: number; // Want it fast? Open your wallet wider.
  timeOfDayPrice: number; // Rush hour? That'll cost you.
  dayOfWeekPrice: number; // Weekend delivery? Oh yeah, that's extra.
  scheduledPrice: number; // Fee or discount for scheduling.
  packageSizePrice: number; // Big box, big bucks. Economics 101.
  totalPrice: number; // The final damage. What you actually pay.
  courierEarnings: number; // 70% - What the courier gets. Before taxes. Ha!
  platformFee: number; // 30% - What we get. For "infrastructure." Yeah, that's it.
}

// Pricing constants. Or as I call them, "numbers we pulled from somewhere."
// These are in USD/EUR. Same thing basically, right? Economics people, don't @ me.
const PRICING_CONFIG = {
  // Base price. The minimum to even consider moving your junk.
  BASE_PRICE: 3.0, // Three dollars. Less than a Starbucks. You're welcome.

  // Price per kilometer. Gas isn't free, turns out.
  PRICE_PER_KM: 0.8, // 80 cents per km. Could be worse.

  // Minimum price. Because we have standards. Low standards, but standards.
  MINIMUM_PRICE: 5.0, // Five bucks minimum. We're not running a charity here.

  // Urgency multipliers. Want it fast? PAY UP.
  URGENCY_MULTIPLIERS: {
    standard: 1.0, // No extra charge. The boring option.
    express: 1.5, // 50% more. Now we're talking.
    urgent: 2.0, // DOUBLE. You want it NOW? This is what NOW costs.
    scheduled: 1.0, // No urgency charge for scheduled deliveries.
  },

  // Package size multipliers. Size matters. In pricing, anyway.
  PACKAGE_SIZE_MULTIPLIERS: {
    small: 1.0, // Envelope, small package. The easy stuff.
    medium: 1.2, // Box, bag. Getting real now.
    large: 1.5, // Large box. Hope you're strong.
    'extra-large': 2.0, // Very large item. Why? Just why?
  },

  // Time-based pricing. Because delivering at 8 AM on a Monday is not the same as 3 PM on a Wednesday.
  TIME_OF_DAY_SURCHARGE: {
    PEAK_HOURS_START: 7, // 7 AM
    PEAK_HOURS_END: 10, // 10 AM
    EVENING_PEAK_START: 16, // 4 PM
    EVENING_PEAK_END: 19, // 7 PM
    SURCHARGE_MULTIPLIER: 1.25, // 25% extra for the trouble.
  },

  // Weekend pricing. You work on weekends, you get paid more. Simple.
  DAY_OF_WEEK_SURCHARGE: {
    WEEKEND_DAYS: [0, 6], // Sunday (0) and Saturday (6). The holy days.
    SURCHARGE_MULTIPLIER: 1.3, // 30% more for giving up your weekend.
  },

  // Scheduled delivery fee. Planning is great, but it also complicates things.
  SCHEDULED_FEE: 1.5, // A buck fifty. For the luxury of choice.

  // Discount for booking in advance. Because we love planners.
  ADVANCE_BOOKING_DISCOUNT: 0.1, // 10% discount

  // The split. The money division. The moment of truth.
  COURIER_PERCENTAGE: 0.7, // 70% to courier. They do the work, they get most of the money. Fair's fair.
  PLATFORM_PERCENTAGE: 0.3, // 30% to us. For the website, the servers, the whole operation. Not greedy at all.
};

/**
 * Calculate delivery price based on distance, urgency, and other factors
 *
 * Now I'm no mathematician, but this function does math. A lot of math.
 * We take distance, multiply it by things, add other things, and hope for the best.
 * It's like making a sandwich, except instead of ingredients, it's numbers. And instead of eating it, you pay it.
 */
export function calculateDeliveryPrice(input: PricingInput): PricingBreakdown {
  const { distance, urgency, packageSize, pickupDateTime } = input;

  // Step 1: Base and distance price. This is the non-surcharged foundation.
  const basePrice = PRICING_CONFIG.BASE_PRICE;
  const distancePrice = distance * PRICING_CONFIG.PRICE_PER_KM;
  const baseAndDistancePrice = basePrice + distancePrice;

  // Step 2: Calculate all surcharges based on the initial baseAndDistancePrice.
  // This prevents compounding multipliers.
  const packageSizeMultiplier = PRICING_CONFIG.PACKAGE_SIZE_MULTIPLIERS[packageSize] || 1.0;
  const packageSizePrice = baseAndDistancePrice * (packageSizeMultiplier - 1);

  const urgencyMultiplier = PRICING_CONFIG.URGENCY_MULTIPLIERS[urgency];
  const urgencyPrice = baseAndDistancePrice * (urgencyMultiplier - 1);

  const now = pickupDateTime || new Date();
  const hour = now.getUTCHours();
  const day = now.getUTCDay();

  let timeOfDayPrice = 0;
  const { PEAK_HOURS_START, PEAK_HOURS_END, EVENING_PEAK_START, EVENING_PEAK_END, SURCHARGE_MULTIPLIER: TIME_SURCHARGE } = PRICING_CONFIG.TIME_OF_DAY_SURCHARGE;
  if ((hour >= PEAK_HOURS_START && hour < PEAK_HOURS_END) || (hour >= EVENING_PEAK_START && hour < EVENING_PEAK_END)) {
    timeOfDayPrice = baseAndDistancePrice * (TIME_SURCHARGE - 1);
  }

  let dayOfWeekPrice = 0;
  const { WEEKEND_DAYS, SURCHARGE_MULTIPLIER: WEEKEND_SURCHARGE } = PRICING_CONFIG.DAY_OF_WEEK_SURCHARGE;
  if (WEEKEND_DAYS.includes(day)) {
    dayOfWeekPrice = baseAndDistancePrice * (WEEKEND_SURCHARGE - 1);
  }

  let scheduledPrice = 0;
  if (urgency === 'scheduled' && pickupDateTime) {
    const hoursDifference = (pickupDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hoursDifference >= 24) {
      // Apply discount to the base+distance+package price
      const subtotalForDiscount = baseAndDistancePrice + packageSizePrice;
      scheduledPrice = - (subtotalForDiscount * PRICING_CONFIG.ADVANCE_BOOKING_DISCOUNT);
    } else {
      scheduledPrice = PRICING_CONFIG.SCHEDULED_FEE;
    }
  }

  // Step 3: Sum up the base price and all calculated surcharges.
  const subtotal = baseAndDistancePrice + packageSizePrice + urgencyPrice + timeOfDayPrice + dayOfWeekPrice + scheduledPrice;

  // Step 4: Minimum price check.
  const finalPrice = Math.max(subtotal, PRICING_CONFIG.MINIMUM_PRICE);

  // Step 5: The split.
  const courierEarnings = finalPrice * PRICING_CONFIG.COURIER_PERCENTAGE;
  const platformFee = finalPrice - courierEarnings;

  return {
    basePrice,
    distancePrice,
    packageSizePrice,
    urgencyPrice,
    timeOfDayPrice,
    dayOfWeekPrice,
    scheduledPrice,
    totalPrice: finalPrice,
    courierEarnings,
    platformFee,
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
