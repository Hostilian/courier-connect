import { calculateDeliveryPrice, PricingInput } from '../lib/pricing';

describe('calculateDeliveryPrice', () => {
  // Test case 1: Standard delivery
  it('should calculate the correct fee for a standard delivery', () => {
    const input: PricingInput = {
      distance: 10,
      urgency: 'standard',
      packageSize: 'medium',
      pickupDateTime: new Date('2025-10-22T14:00:00Z'), // A regular Wednesday afternoon
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (10 * 0.8) = 11
    // packageSizePrice = 11 * (1.2 - 1) = 2.2
    // subtotal = 11 + 2.2 = 13.2
    // final = max(13.2, 5) = 13.2
    expect(breakdown.totalPrice).toBeCloseTo(13.2);
  });

  // Test case 2: Express delivery
  it('should apply an express urgency multiplier', () => {
    const input: PricingInput = {
      distance: 10,
      urgency: 'express',
      packageSize: 'medium',
      pickupDateTime: new Date('2025-10-22T14:00:00Z'),
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (10 * 0.8) = 11
    // packageSizePrice = 11 * (1.2 - 1) = 2.2
    // urgencyPrice = 11 * (1.5 - 1) = 5.5
    // subtotal = 11 + 2.2 + 5.5 = 18.7
    // final = max(18.7, 5) = 18.7
    expect(breakdown.totalPrice).toBeCloseTo(18.7);
  });

  // Test case 3: Urgent delivery
  it('should apply an urgent urgency multiplier', () => {
    const input: PricingInput = {
      distance: 10,
      urgency: 'urgent',
      packageSize: 'medium',
      pickupDateTime: new Date('2025-10-22T14:00:00Z'),
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (10 * 0.8) = 11
    // packageSizePrice = 11 * (1.2 - 1) = 2.2
    // urgencyPrice = 11 * (2.0 - 1) = 11
    // subtotal = 11 + 2.2 + 11 = 24.2
    // final = max(24.2, 5) = 24.2
    expect(breakdown.totalPrice).toBeCloseTo(24.2);
  });

  // Test case 4: Large package
  it('should apply a surcharge for a large package', () => {
    const input: PricingInput = {
      distance: 5,
      urgency: 'standard',
      packageSize: 'large',
      pickupDateTime: new Date('2025-10-22T14:00:00Z'),
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (5 * 0.8) = 7
    // packageSizePrice = 7 * (1.5 - 1) = 3.5
    // subtotal = 7 + 3.5 = 10.5
    // final = max(10.5, 5) = 10.5
    expect(breakdown.totalPrice).toBeCloseTo(10.5);
  });

  // Test case 5: Weekend surcharge
  it('should apply a weekend surcharge', () => {
    const input: PricingInput = {
      distance: 8,
      urgency: 'standard',
      packageSize: 'small',
      pickupDateTime: new Date('2025-10-25T14:00:00Z'), // Saturday
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (8 * 0.8) = 9.4
    // packageSizePrice = 0
    // dayOfWeekPrice = 9.4 * (1.3 - 1) = 2.82
    // subtotal = 9.4 + 2.82 = 12.22
    // final = max(12.22, 5) = 12.22
    expect(breakdown.dayOfWeekPrice).toBeCloseTo(2.82);
    expect(breakdown.totalPrice).toBeCloseTo(12.22);
  });

  // Test case 6: Peak hour surcharge
  it('should apply a peak hour surcharge', () => {
    const input: PricingInput = {
      distance: 8,
      urgency: 'standard',
      packageSize: 'small',
      pickupDateTime: new Date('2025-10-22T08:00:00Z'), // Wednesday 8 AM
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (8 * 0.8) = 9.4
    // timeOfDayPrice = 9.4 * (1.25 - 1) = 2.35
    // subtotal = 9.4 + 2.35 = 11.75
    // final = max(11.75, 5) = 11.75
    expect(breakdown.timeOfDayPrice).toBeCloseTo(2.35);
    expect(breakdown.totalPrice).toBeCloseTo(11.75);
  });

  // Test case 7: Minimum price
  it('should enforce the minimum price for a short delivery', () => {
    const input: PricingInput = {
      distance: 1,
      urgency: 'standard',
      packageSize: 'small',
      pickupDateTime: new Date('2025-10-22T14:00:00Z'),
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (0.8) = 3.8
    // final = max(3.8, 5) = 5
    expect(breakdown.totalPrice).toBe(5);
  });

  // Test case 8: All surcharges combined
  it('should correctly apply multiple surcharges (weekend, peak, urgent, large)', () => {
    const input: PricingInput = {
        distance: 15,
        urgency: 'urgent',
        packageSize: 'large',
        pickupDateTime: new Date('2025-10-26T18:00:00Z'), // Sunday 6 PM (Evening Peak)
    };
    const breakdown = calculateDeliveryPrice(input);
    // base (3) + distance (15 * 0.8) = 15
    // packageSizePrice = 15 * (1.5 - 1) = 7.5
    // urgencyPrice = 15 * (2.0 - 1) = 15
    // timeOfDayPrice = 15 * (1.25 - 1) = 3.75
    // dayOfWeekPrice = 15 * (1.3 - 1) = 4.5
    // subtotal = 15 + 7.5 + 15 + 3.75 + 4.5 = 45.75
    // final = max(45.75, 5) = 45.75
    expect(breakdown.totalPrice).toBeCloseTo(45.75);
  });
});

