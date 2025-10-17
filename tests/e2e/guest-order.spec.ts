import { expect, test } from '@playwright/test';

/**
 * E2E Test: Guest Order Flow
 * 
 * Tests the complete guest order submission without registration:
 * 1. Visit homepage
 * 2. Navigate to request delivery
 * 3. Fill out delivery form
 * 4. Submit order
 * 5. Receive tracking ID
 * 6. Track delivery
 */

test.describe('Guest Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/en');
  });

  test('should complete guest order submission', async ({ page }) => {
    // Click "Request Delivery" button
    await page.getByRole('link', { name: /request delivery/i }).click();
    
    // Wait for form to load
    await expect(page).toHaveURL(/\/en\/request/);
    await expect(page.locator('h1')).toContainText(/request delivery/i);

    // Fill sender information
    await page.fill('input[name="senderName"]', 'John Doe');
    await page.fill('input[name="senderPhone"]', '+420123456789');
    await page.fill('input[name="senderEmail"]', 'john@example.com');
    await page.fill('input[name="senderAddress"]', 'Main Street 123, Prague');

    // Fill receiver information
    await page.fill('input[name="receiverName"]', 'Jane Smith');
    await page.fill('input[name="receiverPhone"]', '+420987654321');
    await page.fill('input[name="receiverAddress"]', 'Charles Square 45, Prague');

    // Fill package details
    await page.selectOption('select[name="packageType"]', 'Documents');
    await page.selectOption('select[name="packageSize"]', 'small');
    await page.fill('input[name="packageWeight"]', '0.5');
    await page.fill('textarea[name="packageDescription"]', 'Important contract documents');

    // Select urgency
    await page.check('input[value="standard"]');

    // Add notes
    await page.fill('textarea[name="notes"]', 'Please handle with care');

    // Check price estimate appears
    const priceElement = page.locator('[data-testid="price-estimate"]');
    await expect(priceElement).toBeVisible();
    await expect(priceElement).toContainText(/\$/);

    // Submit form
    await page.getByRole('button', { name: /submit|request/i }).click();

    // Wait for confirmation page
    await expect(page).toHaveURL(/\/en\/track/);
    
    // Check tracking ID is displayed
    const trackingId = await page.locator('[data-testid="tracking-id"]').textContent();
    expect(trackingId).toMatch(/^CC-[A-Z0-9]{6}$/);

    // Verify confirmation message
    await expect(page.locator('text=/order created|delivery requested/i')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/en/request');

    // Try to submit empty form
    await page.getByRole('button', { name: /submit|request/i }).click();

    // Check for validation errors
    await expect(page.locator('text=/required|cannot be empty/i')).toBeVisible();
  });

  test('should calculate price dynamically', async ({ page }) => {
    await page.goto('/en/request');

    // Fill minimum required fields
    await page.fill('input[name="senderAddress"]', 'Prague, Czech Republic');
    await page.fill('input[name="receiverAddress"]', 'Brno, Czech Republic');
    await page.selectOption('select[name="packageSize"]', 'medium');

    // Wait for price calculation
    await page.waitForTimeout(1000);

    // Check price is displayed
    const priceElement = page.locator('[data-testid="price-estimate"]');
    await expect(priceElement).toBeVisible();
    
    const priceText = await priceElement.textContent();
    expect(priceText).toMatch(/\$\d+\.\d{2}/);
  });

  test('should show scheduled delivery option', async ({ page }) => {
    await page.goto('/en/request');

    // Check for schedule toggle/checkbox
    const scheduleOption = page.locator('input[type="checkbox"][name*="schedule"]');
    await expect(scheduleOption).toBeVisible();

    // Enable scheduling
    await scheduleOption.check();

    // Date/time pickers should appear
    await expect(page.locator('input[type="date"], input[type="datetime-local"]')).toBeVisible();
  });
});

test.describe('Guest Tracking', () => {
  test('should track delivery with tracking ID', async ({ page }) => {
    await page.goto('/en/track');

    // Enter tracking ID
    const trackingInput = page.locator('input[placeholder*="tracking" i]');
    await trackingInput.fill('CC-TEST123');
    
    // Submit
    await page.getByRole('button', { name: /track|search/i }).click();

    // Should show delivery details or "not found" message
    await expect(
      page.locator('text=/delivery details|not found/i')
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Multi-locale Support', () => {
  const locales = ['en', 'cs', 'de', 'es', 'uk', 'tr', 'vi'];

  for (const locale of locales) {
    test(`should load homepage in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      
      // Check page loads successfully
      await expect(page).toHaveURL(new RegExp(`/${locale}`));
      
      // Check header is present
      await expect(page.locator('header')).toBeVisible();
      
      // Check language selector exists
      await expect(page.locator('[data-testid="language-selector"]')).toBeVisible();
    });
  }

  test('should switch languages via selector', async ({ page }) => {
    await page.goto('/en');

    // Open language selector
    await page.click('[data-testid="language-selector"]');

    // Select Czech
    await page.click('button[data-locale="cs"], a[href*="/cs"]');

    // Verify URL changed
    await expect(page).toHaveURL(/\/cs/);
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test('should be mobile-friendly', async ({ page }) => {
    await page.goto('/en');

    // Check mobile menu is accessible
    const mobileMenu = page.locator('[aria-label*="menu" i]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('nav')).toBeVisible();
    }

    // Navigate to request page
    await page.goto('/en/request');

    // Check form is scrollable and inputs are accessible
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="senderName"]')).toBeVisible();

    // Check touch targets are large enough (at least 44x44px)
    const submitButton = page.getByRole('button', { name: /submit/i });
    const box = await submitButton.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/en/request');

    // Check form has accessible labels
    const nameInput = page.locator('input[name="senderName"]');
    const label = await nameInput.getAttribute('aria-label') || 
                  await page.locator(`label[for="${await nameInput.getAttribute('id')}"]`).textContent();
    
    expect(label).toBeTruthy();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/en');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check focus is visible
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
