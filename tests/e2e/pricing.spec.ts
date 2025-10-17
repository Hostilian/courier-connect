import { expect, test } from '@playwright/test';

/**
 * E2E Test: Pricing Algorithm
 * 
 * Tests the pricing calculation algorithm:
 * - Base price + distance
 * - Urgency multipliers (standard/express/urgent)
 * - Scheduled delivery discount
 * - 70/30 split (courier/platform)
 * - Package size impact
 */

test.describe('Pricing Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/request');
  });

  test('should calculate standard delivery price', async ({ page }) => {
    // Fill addresses (short distance within Prague)
    await page.fill('input[name="senderAddress"]', 'Wenceslas Square, Prague');
    await page.fill('input[name="receiverAddress"]', 'Old Town Square, Prague');
    
    // Select package details
    await page.selectOption('select[name="packageSize"]', 'small');
    await page.check('input[value="standard"]');

    // Wait for price calculation
    await page.waitForTimeout(1500);

    // Check price is displayed
    const priceElement = page.locator('[data-testid="price-estimate"]');
    await expect(priceElement).toBeVisible();
    
    const priceText = await priceElement.textContent();
    
    // Standard delivery should have base price + distance
    // Short distance ~2km = $3 (base) + $1 (distance) = ~$4-5
    expect(priceText).toMatch(/\$[4-6]\.\d{2}/);
  });

  test('should apply express delivery multiplier', async ({ page }) => {
    await page.fill('input[name="senderAddress"]', 'Wenceslas Square, Prague');
    await page.fill('input[name="receiverAddress"]', 'Old Town Square, Prague');
    await page.selectOption('select[name="packageSize"]', 'small');
    
    // Select express (2x multiplier)
    await page.check('input[value="express"]');
    await page.waitForTimeout(1500);

    const expressPrice = await page.locator('[data-testid="price-estimate"]').textContent();
    
    // Should be roughly 2x the standard price
    // ~$8-10 for express
    expect(expressPrice).toMatch(/\$[8-12]\.\d{2}/);
  });

  test('should apply urgent delivery multiplier', async ({ page }) => {
    await page.fill('input[name="senderAddress"]', 'Wenceslas Square, Prague');
    await page.fill('input[name="receiverAddress"]', 'Old Town Square, Prague');
    await page.selectOption('select[name="packageSize"]', 'small');
    
    // Select urgent (3x multiplier)
    await page.check('input[value="urgent"]');
    await page.waitForTimeout(1500);

    const urgentPrice = await page.locator('[data-testid="price-estimate"]').textContent();
    
    // Should be roughly 3x the standard price
    // ~$12-15 for urgent
    expect(urgentPrice).toMatch(/\$1[2-8]\.\d{2}/);
  });

  test('should apply scheduled delivery discount', async ({ page }) => {
    await page.fill('input[name="senderAddress"]', 'Wenceslas Square, Prague');
    await page.fill('input[name="receiverAddress"]', 'Old Town Square, Prague');
    await page.selectOption('select[name="packageSize"]', 'medium');
    await page.check('input[value="standard"]');
    await page.waitForTimeout(1500);

    // Get standard price
    const standardPrice = await page.locator('[data-testid="price-estimate"]').textContent();
    const standardAmount = parseFloat(standardPrice?.match(/\$([\d.]+)/)?.[1] || '0');

    // Enable scheduling
    const scheduleCheckbox = page.locator('input[type="checkbox"][name*="schedule"]');
    if (await scheduleCheckbox.isVisible()) {
      await scheduleCheckbox.check();
      await page.waitForTimeout(1500);

      // Get scheduled price
      const scheduledPrice = await page.locator('[data-testid="price-estimate"]').textContent();
      const scheduledAmount = parseFloat(scheduledPrice?.match(/\$([\d.]+)/)?.[1] || '0');

      // Scheduled should be 20% less
      const expectedDiscount = standardAmount * 0.20;
      const actualDiscount = standardAmount - scheduledAmount;

      expect(Math.abs(actualDiscount - expectedDiscount)).toBeLessThan(0.5);
    }
  });

  test('should increase price for larger packages', async ({ page }) => {
    await page.fill('input[name="senderAddress"]', 'Prague, Czech Republic');
    await page.fill('input[name="receiverAddress"]', 'Brno, Czech Republic');
    await page.check('input[value="standard"]');

    // Small package
    await page.selectOption('select[name="packageSize"]', 'small');
    await page.waitForTimeout(1500);
    const smallPrice = await page.locator('[data-testid="price-estimate"]').textContent();
    const smallAmount = parseFloat(smallPrice?.match(/\$([\d.]+)/)?.[1] || '0');

    // Large package
    await page.selectOption('select[name="packageSize"]', 'large');
    await page.waitForTimeout(1500);
    const largePrice = await page.locator('[data-testid="price-estimate"]').textContent();
    const largeAmount = parseFloat(largePrice?.match(/\$([\d.]+)/)?.[1] || '0');

    // Large should cost more than small
    expect(largeAmount).toBeGreaterThan(smallAmount);
  });

  test('should increase price for longer distances', async ({ page }) => {
    await page.selectOption('select[name="packageSize"]', 'medium');
    await page.check('input[value="standard"]');

    // Short distance
    await page.fill('input[name="senderAddress"]', 'Wenceslas Square, Prague');
    await page.fill('input[name="receiverAddress"]', 'Old Town Square, Prague');
    await page.waitForTimeout(1500);
    const shortPrice = await page.locator('[data-testid="price-estimate"]').textContent();
    const shortAmount = parseFloat(shortPrice?.match(/\$([\d.]+)/)?.[1] || '0');

    // Long distance
    await page.fill('input[name="senderAddress"]', 'Prague, Czech Republic');
    await page.fill('input[name="receiverAddress"]', 'Brno, Czech Republic');
    await page.waitForTimeout(1500);
    const longPrice = await page.locator('[data-testid="price-estimate"]').textContent();
    const longAmount = parseFloat(longPrice?.match(/\$([\d.]+)/)?.[1] || '0');

    // Long distance should cost significantly more
    expect(longAmount).toBeGreaterThan(shortAmount * 1.5);
  });

  test('should display courier earnings (70%)', async ({ page }) => {
    await page.fill('input[name="senderAddress"]', 'Prague, Czech Republic');
    await page.fill('input[name="receiverAddress"]', 'Brno, Czech Republic');
    await page.selectOption('select[name="packageSize"]', 'medium');
    await page.check('input[value="standard"]');
    await page.waitForTimeout(1500);

    // Check if pricing breakdown is shown
    const breakdown = page.locator('[data-testid="price-breakdown"]');
    
    if (await breakdown.isVisible()) {
      // Should show courier earnings (70%)
      await expect(breakdown.locator('text=/courier.*70%|70%.*courier/i')).toBeVisible();
      
      // Should show platform fee (30%)
      await expect(breakdown.locator('text=/platform.*30%|30%.*fee/i')).toBeVisible();
    }
  });
});

test.describe('Pricing Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/request');
  });

  test('should handle same pickup and dropoff', async ({ page }) => {
    const sameAddress = 'Wenceslas Square, Prague';
    
    await page.fill('input[name="senderAddress"]', sameAddress);
    await page.fill('input[name="receiverAddress"]', sameAddress);
    await page.selectOption('select[name="packageSize"]', 'small');
    await page.check('input[value="standard"]');
    await page.waitForTimeout(1500);

    // Should either show minimum price or error
    const priceElement = page.locator('[data-testid="price-estimate"]');
    const errorElement = page.locator('text=/same address|minimum distance/i');

    const priceVisible = await priceElement.isVisible();
    const errorVisible = await errorElement.isVisible();

    expect(priceVisible || errorVisible).toBeTruthy();

    if (priceVisible) {
      // Should have minimum base price
      const priceText = await priceElement.textContent();
      const amount = parseFloat(priceText?.match(/\$([\d.]+)/)?.[1] || '0');
      expect(amount).toBeGreaterThan(0);
    }
  });

  test('should handle very long distances', async ({ page }) => {
    // Inter-country delivery
    await page.fill('input[name="senderAddress"]', 'Prague, Czech Republic');
    await page.fill('input[name="receiverAddress"]', 'Vienna, Austria');
    await page.selectOption('select[name="packageSize"]', 'medium');
    await page.check('input[value="standard"]');
    await page.waitForTimeout(1500);

    const priceElement = page.locator('[data-testid="price-estimate"]');
    
    if (await priceElement.isVisible()) {
      const priceText = await priceElement.textContent();
      const amount = parseFloat(priceText?.match(/\$([\d.]+)/)?.[1] || '0');
      
      // Should be significantly higher (300+ km = $150+)
      expect(amount).toBeGreaterThan(100);
    } else {
      // Or show "out of service area" error
      await expect(page.locator('text=/out of.*area|not available/i')).toBeVisible();
    }
  });

  test('should update price when inputs change', async ({ page }) => {
    await page.fill('input[name="senderAddress"]', 'Wenceslas Square, Prague');
    await page.fill('input[name="receiverAddress"]', 'Old Town Square, Prague');
    await page.selectOption('select[name="packageSize"]', 'small');
    await page.check('input[value="standard"]');
    await page.waitForTimeout(1500);

    const initialPrice = await page.locator('[data-testid="price-estimate"]').textContent();

    // Change to express
    await page.check('input[value="express"]');
    await page.waitForTimeout(1500);

    const updatedPrice = await page.locator('[data-testid="price-estimate"]').textContent();

    // Price should have changed
    expect(initialPrice).not.toBe(updatedPrice);
  });
});

test.describe('Pricing Display & Formatting', () => {
  test('should format price correctly', async ({ page }) => {
    await page.goto('/en/request');
    
    await page.fill('input[name="senderAddress"]', 'Prague, Czech Republic');
    await page.fill('input[name="receiverAddress"]', 'Brno, Czech Republic');
    await page.selectOption('select[name="packageSize"]', 'medium');
    await page.check('input[value="standard"]');
    await page.waitForTimeout(1500);

    const priceElement = page.locator('[data-testid="price-estimate"]');
    const priceText = await priceElement.textContent();

    // Should have currency symbol and 2 decimal places
    expect(priceText).toMatch(/\$\d+\.\d{2}/);
  });

  test('should show pricing in different locales', async ({ page }) => {
    const locales = ['en', 'cs', 'de'];

    for (const locale of locales) {
      await page.goto(`/${locale}/request`);
      
      await page.fill('input[name="senderAddress"]', 'Prague');
      await page.fill('input[name="receiverAddress"]', 'Brno');
      await page.selectOption('select[name="packageSize"]', 'small');
      await page.check('input[value="standard"]');
      await page.waitForTimeout(1500);

      const priceElement = page.locator('[data-testid="price-estimate"]');
      await expect(priceElement).toBeVisible();
      
      // Price should be displayed (format may vary by locale)
      const priceText = await priceElement.textContent();
      expect(priceText).toBeTruthy();
    }
  });
});
