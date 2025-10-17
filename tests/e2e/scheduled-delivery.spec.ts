import { expect, test } from '@playwright/test';

test.describe('Scheduled Delivery Flow Test', () => {
  const trackingIdRegex = /^CC-[A-Z0-9]{6}$/;
  let trackingId: string;

  test('Step 1: Customer requests a scheduled delivery with email notifications', async ({ page }) => {
    await page.goto('/en/request');

    // Fill out sender details with email
    await page.getByPlaceholder('Full Name').fill('Alice Johnson');
    await page.getByPlaceholder('+1 234 567 8900').fill('5551234567');
    await page.getByLabel('Pickup Address').fill('789 Maple St, Lakeside, USA');
    await page.getByLabel('Email').fill('sender@example.com');

    await page.getByRole('button', { name: 'Next' }).click();

    // Fill out receiver details with email
    await page.getByPlaceholder('Recipient Full Name').fill('Bob Williams');
    await page.getByPlaceholder('Recipient Phone').fill('5559876543');
    await page.getByLabel('Delivery Address').fill('321 Pine Rd, Riverside, USA');
    await page.getByLabel('Recipient Email').fill('receiver@example.com');

    await page.getByRole('button', { name: 'Next' }).click();

    // Fill out package details with scheduled delivery
    await page.getByLabel('Package Type').selectOption('document');
    await page.getByLabel('Delivery Urgency').selectOption('scheduled');
    
    // Set scheduled date (2 days from now)
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    const dateString = twoDaysFromNow.toISOString().split('T')[0];
    await page.getByLabel('Pickup Date').fill(dateString);
    await page.getByLabel('Pickup Time').selectOption('10:00');
    
    await page.getByRole('button', { name: 'Request Delivery' }).click();

    // Expect success page and save tracking ID
    await expect(page.getByRole('heading', { name: 'Delivery Requested!' })).toBeVisible();
    
    const trackingIdElement = page.locator('p.font-mono.text-2xl');
    const id = await trackingIdElement.textContent();
    expect(id).toMatch(trackingIdRegex);
    trackingId = id!;

    console.log(`Scheduled delivery requested. Tracking ID: ${trackingId}`);
    
    // Check email notification (would be mocked in a real test)
    await expect(page.getByText('Confirmation email sent')).toBeVisible();
  });

  test('Step 2: Customer verifies tracking immediately after request', async ({ page }) => {
    await page.goto(`/en/track?id=${trackingId}`);

    // Verify initial status
    await expect(page.getByText('Pending')).toBeVisible();
    
    // Verify scheduled information is visible
    await expect(page.getByText('Scheduled for')).toBeVisible();
    
    // No courier information yet
    await expect(page.locator('text=Courier')).not.toBeVisible();
    
    console.log('Tracking page shows correct pending status for scheduled delivery');
  });

  test('Step 3: Courier accepts the scheduled delivery', async ({ page }) => {
    // Create a test courier account or use an existing one
    await page.goto('/en/courier/login');
    await page.getByPlaceholder('Email Address').fill('test_courier@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByRole('heading', { name: 'Courier Dashboard' })).toBeVisible();
    
    // Go to scheduled deliveries tab
    await page.getByRole('tab', { name: 'Scheduled' }).click();
    
    // Find and accept the job
    const jobLocator = page.locator(`[data-tracking-id="${trackingId}"]`);
    await expect(jobLocator).toBeVisible({ timeout: 10000 });
    await jobLocator.getByRole('button', { name: 'Accept Job' }).click();
    
    // Verify acceptance
    await expect(page.getByText('Delivery accepted successfully')).toBeVisible();
    
    console.log(`Courier accepted scheduled job: ${trackingId}`);
  });

  test('Step 4: Customer verifies courier assignment for scheduled delivery', async ({ page }) => {
    await page.goto(`/en/track?id=${trackingId}`);

    // Verify updated status
    await expect(page.getByText('Accepted')).toBeVisible();
    
    // Courier information should now be visible
    await expect(page.locator('text=Courier')).toBeVisible();
    
    // Scheduled time should still be displayed
    await expect(page.getByText('Scheduled for')).toBeVisible();
    
    console.log('Tracking page shows courier assignment for scheduled delivery');
  });

  test('Step 5: Courier completes the scheduled delivery on the scheduled date', async ({ page }) => {
    // In a real test, we would fast-forward time to the scheduled date
    // For now, we'll simulate the delivery process directly
    
    await page.goto('/en/courier/login');
    await page.getByPlaceholder('Email Address').fill('test_courier@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Go to scheduled deliveries
    await page.getByRole('tab', { name: 'Scheduled' }).click();
    
    // Find the delivery and simulate the day has arrived
    const deliveryLocator = page.locator(`[data-tracking-id="${trackingId}"]`);
    await expect(deliveryLocator).toBeVisible();
    
    // Start the delivery process
    await deliveryLocator.getByRole('button', { name: 'Start Delivery' }).click();
    
    // Update delivery statuses
    await deliveryLocator.getByRole('button', { name: 'Mark as Picked Up' }).click();
    console.log('Marked as Picked Up');
    
    await deliveryLocator.getByRole('button', { name: 'Mark as In Transit' }).click();
    console.log('Marked as In Transit');

    await deliveryLocator.getByRole('button', { name: 'Mark as Delivered' }).click();
    console.log('Marked as Delivered');
    
    // Verify completion notification
    await expect(page.getByText('Delivery completed successfully')).toBeVisible();
  });

  test('Step 6: Customer verifies completed delivery and provides rating', async ({ page }) => {
    await page.goto(`/en/track?id=${trackingId}`);

    // Verify final status
    await expect(page.getByText('Delivered', { exact: true })).toBeVisible();
    await expect(page.getByText('Your package has been successfully delivered.')).toBeVisible();
    
    // Check the timeline for all statuses
    await expect(page.locator('.timeline-item-active:has-text("Pending")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("Accepted")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("Picked Up")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("In Transit")')).toBeVisible();
    await expect(page.locator('.timeline-item-active:has-text("Delivered")')).toBeVisible();

    // Rate the delivery (this would need to be implemented)
    await page.getByRole('button', { name: 'Rate your experience' }).click();
    await page.locator('.star-rating').nth(4).click(); // 5 stars
    await page.getByLabel('Feedback').fill('Great delivery service!');
    await page.getByRole('button', { name: 'Submit Rating' }).click();
    
    await expect(page.getByText('Thank you for your feedback!')).toBeVisible();
    
    console.log(`Customer confirmed delivery is complete and provided rating for ${trackingId}`);
  });
});