// Pricing calculation for Courier Connect
// You know what they say about pricing: everyone wants a deal, nobody wants to pay.
// We do a 70/30 split. Courier gets 70%, we get 30%. That's the cost of doing business, folks.
// Don't look at me like that. Servers aren't free. Neither is my therapist.

// What we need to know to price something. It's not rocket science. Though maybe it should be.
export interface PricingInput {
  distance: number; // How far in kilometers. Could be miles, but we're international now.
  urgency: 'standard' | 'express' | 'urgent' | 'scheduled'; // How fast they want it. Spoiler: always fast.
  scheduledPickupDate?: Date; // For planners. All three of them.
  packageSize: 'small' | 'medium' | 'large' | 'extra-large'; // Like t-shirts, but more expensive
}

// The breakdown. Where every penny goes. Transparency, they call it. I call it showing our work.
export interface PricingBreakdown {
  basePrice: number; // The starting number. Like the cover charge at a nightclub.
  distancePrice: number; // More distance, more money. Makes sense. Kind of.
  urgencyPrice: number; // Want it fast? Open your wallet wider.
  scheduledPrice: number; // Discount for planning ahead. Rewarding responsible behavior.
  packageSizePrice: number; // Big box, big bucks. Economics 101.
  totalPrice: number; // The final damage. What you actually pay.
  courierEarnings: number; // 70% - What the courier gets. Before taxes. Ha!
  platformFee: number; // 30% - What we get. For "infrastructure." Yeah, that's it.
}

// Pricing constants. Or as I call them, "numbers we pulled from somewhere."
// These are in USD/EUR. Same thing basically, right? Economics people, don't @ me.
const PRICING_CONFIG = {
  // Base price. The minimum to even consider moving your junk.
  BASE_PRICE: 3.00, // Three dollars. Less than a Starbucks. You're welcome.
  
  // Price per kilometer. Gas isn't free, turns out.
  PRICE_PER_KM: 0.80, // 80 cents per km. Could be worse.
  
  // Minimum price. Because we have standards. Low standards, but standards.
  MINIMUM_PRICE: 5.00, // Five bucks minimum. We're not running a charity here.
  
  // Urgency multipliers. Want it fast? PAY UP.
  URGENCY_MULTIPLIERS: {
    standard: 1.0, // No extra charge. The boring option.
    express: 1.5, // 50% more. Now we're talking.
    urgent: 2.0, // DOUBLE. You want it NOW? This is what NOW costs.
    scheduled: 0.9, // 10% discount. Patience is a virtue. A cheap virtue.
  },
  
  // Package size multipliers. Size matters. In pricing, anyway.
  PACKAGE_SIZE_MULTIPLIERS: {
    'small': 1.0, // Envelope, small package. The easy stuff.
    'medium': 1.2, // Box, bag. Getting real now.
    'large': 1.5, // Large box. Hope you're strong.
    'extra-large': 2.0, // Very large item. Why? Just why?
  },
  
  // Scheduled delivery discount. Plan ahead, save money. Revolutionary concept.
  ADVANCE_BOOKING_DISCOUNT: 0.10, // 10% off. Not much, but better than nothing.
  ADVANCE_BOOKING_HOURS: 24, // Book 24 hours ahead. That's a whole day. Can you imagine?
  
  // The split. The money division. The moment of truth.
  COURIER_PERCENTAGE: 0.70, // 70% to courier. They do the work, they get most of the money. Fair's fair.
  PLATFORM_PERCENTAGE: 0.30, // 30% to us. For the website, the servers, the whole operation. Not greedy at all.
};

/**
 * Calculate delivery price based on distance, urgency, and other factors
 * 
 * Now I'm no mathematician, but this function does math. A lot of math.
 * We take distance, multiply it by things, add other things, and hope for the best.
 * It's like making a sandwich, except instead of ingredients, it's numbers. And instead of eating it, you pay it.
 */
export function calculateDeliveryPrice(input: PricingInput): PricingBreakdown {
  const { distance, urgency, scheduledPickupDate, packageSize } = input;
  
  // Step 1: Base price. The foundation. The bedrock. Three whole dollars.
  const basePrice = PRICING_CONFIG.BASE_PRICE;
  
  // Step 2: Distance price. Multiply distance by our per-km rate. Revolutionary mathematics.
  const distancePrice = distance * PRICING_CONFIG.PRICE_PER_KM;
  
  // Step 3: Package size multiplier. Bigger box = more money. Shocking stuff.
  const packageSizeMultiplier = PRICING_CONFIG.PACKAGE_SIZE_MULTIPLIERS[packageSize] || 1.0; // The || 1.0 is for when things go wrong. They will.
  const packageSizePrice = (basePrice + distancePrice) * (packageSizeMultiplier - 1); // Minus 1 because math. Don't ask me, I just work here.
  
  // Step 4: Urgency multiplier. How bad do you want it?
  const urgencyMultiplier = PRICING_CONFIG.URGENCY_MULTIPLIERS[urgency];
  
  // Step 5: Subtotal before urgency. Add it all up. This is pre-desperation pricing.
  let subtotal = basePrice + distancePrice + packageSizePrice;
  
  // Step 6: Apply urgency. Multiply that subtotal. This is where we get you.
  const urgencyPrice = subtotal * (urgencyMultiplier - 1); // The urgency upcharge. Want it fast? Show me the money.
  subtotal = subtotal * urgencyMultiplier; // New subtotal. Higher than before. Surprise!
  
  // Step 7: Scheduled delivery discount. For responsible people who plan ahead.
  // All three of them.
  let scheduledPrice = 0;
  if (urgency === 'scheduled' && scheduledPickupDate) {
    // Calculate how far in advance they booked. In hours. Because minutes would be too easy.
    const hoursInAdvance = (scheduledPickupDate.getTime() - Date.now()) / (1000 * 60 * 60);
    // If they booked 24+ hours ahead, they get a discount. Look at you, being responsible.
    if (hoursInAdvance >= PRICING_CONFIG.ADVANCE_BOOKING_HOURS) {
      scheduledPrice = -subtotal * PRICING_CONFIG.ADVANCE_BOOKING_DISCOUNT; // Negative number. It's a discount. Math is weird.
      subtotal = subtotal * (1 - PRICING_CONFIG.ADVANCE_BOOKING_DISCOUNT); // Reduce the subtotal. Generosity in action.
    }
  }
  
  // Step 8: Apply minimum price. We have standards. Low, but standards.
  // Math.max picks the bigger number. Either what we calculated, or our minimum. Whichever's higher. Usually the minimum.
  const totalPrice = Math.max(subtotal, PRICING_CONFIG.MINIMUM_PRICE);
  
  // Step 9: The 70/30 split. The moment of truth. Who gets what.
  const courierEarnings = totalPrice * PRICING_CONFIG.COURIER_PERCENTAGE; // 70% to the courier. The person actually doing work.
  const platformFee = totalPrice * PRICING_CONFIG.PLATFORM_PERCENTAGE; // 30% to us. For "overhead." Don't think about it too hard.
  
  // Return everything, formatted to 2 decimal places. Because $5.8474839 looks unprofessional.
  return {
    basePrice: Number(basePrice.toFixed(2)), // .toFixed(2) rounds to 2 decimals. Then Number() makes it a number again. JavaScript is fun.
    distancePrice: Number(distancePrice.toFixed(2)),
    urgencyPrice: Number(urgencyPrice.toFixed(2)),
    scheduledPrice: Number(scheduledPrice.toFixed(2)),
    packageSizePrice: Number(packageSizePrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)), // The big one. The final answer. What you owe.
    courierEarnings: Number(courierEarnings.toFixed(2)), // What they get. The good news.
    platformFee: Number(platformFee.toFixed(2)), // What we get. The even better news.
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
