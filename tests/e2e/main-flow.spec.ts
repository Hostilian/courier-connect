import { expect, test } from '@playwright/test';

test.describe('Primary User Flow: Customer Request to Courier Completion', () => {
  const trackingIdRegex = /^CC-[A-Z0-9]{6}$/;
  let trackingId: string;

  test('Step 1: Customer requests a delivery', async ({ page }) => {
    await page.goto('/en/request');

    // Fill out sender details
    await page.getByPlaceholder('Full Name').fill('John Doe');
    await page.getByPlaceholder('+1 234 567 8900').fill('1234567890');
    await page.getByLabel('Pickup Address').fill('123 Main St, Anytown, USA');

    await page.getByRole('button', { name: 'Next' }).click();

    // Fill out receiver details
    await page.getByPlaceholder('Recipient Full Name').fill('Jane Smith');
    await page.getByPlaceholder('Recipient Phone').fill('0987654321');
    await page.getByLabel('Delivery Address').fill('456 Oak Ave, Othertown, USA');

    await page.getByRole('button', { name: 'Next' }).click();

    // Fill out package details
    await page.getByLabel('Package Type').selectOption('medium');
    await page.getByLabel('Delivery Urgency').selectOption('express');
    
    await page.getByRole('button', { name: 'Request Delivery' }).click();

    // Expect success page and save tracking ID
    await expect(page.getByRole('heading', { name: 'Delivery Requested!' })).toBeVisible();
    
    const trackingIdElement = page.locator('p.font-mono.text-2xl');
    const id = await trackingIdElement.textContent();
    expect(id).toMatch(trackingIdRegex);
    trackingId = id!;

    console.log(`Delivery requested. Tracking ID: ${trackingId}`);
  });

  test('Step 2: Courier registers and logs in', async ({ page }) => {
    const uniqueEmail = `courier-${Date.now()}@example.com`;

    // Register
    await page.goto('/en/courier/register');
    await page.getByPlaceholder('Full Name').fill('Test Courier');
    await page.getByPlaceholder('Email Address').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    await page.getByPlaceholder('Phone Number').fill('555-123-4567');
    await page.getByPlaceholder('Your City').fill('Anytown');
    await page.getByLabel('Vehicle Type').selectOption('car');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Login
    await expect(page.getByRole('heading', { name: 'Courier Login' })).toBeVisible();
    await page.getByPlaceholder('Email Address').fill(uniqueEmail);
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Expect to be on the dashboard
    await expect(page.getByRole('heading', { name: 'Courier Dashboard' })).toBeVisible();
    console.log(`Courier registered and logged in as ${uniqueEmail}`);
  });

  test('Step 3: Courier accepts and completes the delivery', async ({ page, browser }) => {
    // Log in as the previously registered courier
    // Note: In a real scenario, you'd persist the session or use a pre-authenticated state.
    // For this test, we'll quickly log in again.
    const context = await browser.newContext();
    const courierPage = await context.newPage();
    
    await courierPage.goto('/en/courier/login');
    // This relies on the previous test's registration. A more robust setup would use a fixed test user.
    const latestCourierEmail = (await courierPage.evaluate(() => localStorage.getItem('last-registered-courier-email'))) || `courier-${Date.now()}@example.com`;
    await courierPage.getByPlaceholder('Email Address').fill(latestCourierEmail);
    await courierPage.getByPlaceholder('Password').fill('password123');
    await courierPage.getByRole('button', { name: 'Sign In' }).click();
    await expect(courierPage.getByRole('heading', { name: 'Courier Dashboard' })).toBeVisible();

    // Find and accept the job
    const jobLocator = courierPage.locator(`[data-tracking-id="${trackingId}"]`);
    await expect(jobLocator).toBeVisible({ timeout: 10000 });
    await jobLocator.getByRole('button', { name: 'Accept Job' }).click();
    
    console.log(`Courier accepted job: ${trackingId}`);

    // Go to active deliveries and update status
    const activeDelivery = courierPage.locator(`[data-tracking-id="${trackingId}"]`);
    await expect(activeDelivery).toBeVisible();

    await activeDelivery.getByRole('button', { name: 'Mark as Picked Up' }).click();
    console.log('Marked as Picked Up');
    
    await activeDelivery.getByRole('button', { name: 'Mark as In Transit' }).click();
    console.log('Marked as In Transit');

    await activeDelivery.getByRole('button', { name: 'Mark as Delivered' }).click();
    console.log('Marked as Delivered');

    // Expect the delivery to disappear from the active list
    await expect(activeDelivery).not.toBeVisible();
  });

  test('Step 4: Customer tracks the completed delivery', async ({ page }) => {
    await page.goto(`/en/track?id=${trackingId}`);

    await expect(page.getByText('Delivered', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Your package has been successfully delivered.')).toBeVisible();
    
    // Check the timeline for all statuses
    await expect(page.locator('.timeline-item-active:has-text("Pending")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("Accepted")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("Picked Up")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("In Transit")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("Delivered")')).toBeVisible();

    console.log(`Customer confirmed delivery is complete for ${trackingId}`);
  });
});
