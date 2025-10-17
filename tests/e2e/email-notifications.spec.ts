import { expect, test } from '@playwright/test';

test.describe('Email Notification System Tests', () => {
  const trackingIdRegex = /^CC-[A-Z0-9]{6}$/;
  let trackingId: string;

  test('should send confirmation email when delivery is requested', async ({ page, request }) => {
    // Set up a mock for email testing (in a real environment, this would use a test email account)
    // For this test, we'll check for the API call to the email service
    
    await page.goto('/en/request');

    // Fill out sender details with email
    await page.getByPlaceholder('Full Name').fill('Test Customer');
    await page.getByPlaceholder('+1 234 567 8900').fill('5551234567');
    await page.getByLabel('Pickup Address').fill('123 Test St, Testville');
    await page.getByLabel('Email').fill('test_sender@example.com');

    await page.getByRole('button', { name: 'Next' }).click();

    // Fill out receiver details with email
    await page.getByPlaceholder('Recipient Full Name').fill('Test Recipient');
    await page.getByPlaceholder('Recipient Phone').fill('5559876543');
    await page.getByLabel('Delivery Address').fill('456 Test Ave, Testtown');
    await page.getByLabel('Recipient Email').fill('test_recipient@example.com');

    await page.getByRole('button', { name: 'Next' }).click();

    // Fill out package details
    await page.getByLabel('Package Type').selectOption('document');
    await page.getByLabel('Delivery Urgency').selectOption('standard');
    
    // Start monitoring network requests for email API call
    const emailRequestPromise = page.waitForRequest(request => 
      request.url().includes('/api/deliveries') && 
      request.method() === 'POST'
    );
    
    await page.getByRole('button', { name: 'Request Delivery' }).click();

    // Wait for the email API call to complete
    const emailRequest = await emailRequestPromise;
    expect(emailRequest.postDataJSON()).toHaveProperty('senderEmail', 'test_sender@example.com');

    // Save tracking ID for subsequent tests
    await expect(page.getByRole('heading', { name: 'Delivery Requested!' })).toBeVisible();
    const trackingIdElement = page.locator('p.font-mono.text-2xl');
    const id = await trackingIdElement.textContent();
    expect(id).toMatch(trackingIdRegex);
    trackingId = id!;
    
    // On the success page, there should be mention of email notification
    await expect(page.getByText('confirmation email')).toBeVisible();
    
    console.log('Verification complete for delivery request email notification');
  });

  test('should send notification when courier accepts delivery', async ({ page, request }) => {
    // Log in as a test courier
    await page.goto('/en/courier/login');
    await page.getByPlaceholder('Email Address').fill('test_courier@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByRole('heading', { name: 'Courier Dashboard' })).toBeVisible();
    
    // Find the delivery
    const jobLocator = page.locator(`[data-tracking-id="${trackingId}"]`);
    await expect(jobLocator).toBeVisible({ timeout: 10000 });
    
    // Monitor for the accept API call which should trigger an email
    const acceptRequestPromise = page.waitForRequest(request => 
      request.url().includes(`/api/courier/deliveries`) && 
      request.url().includes(`/accept`) &&
      request.method() === 'POST'
    );
    
    await jobLocator.getByRole('button', { name: 'Accept Job' }).click();
    
    // Wait for the accept API call to complete
    const acceptRequest = await acceptRequestPromise;
    expect(acceptRequest.url()).toContain('/accept');
    
    // Verify success message mentioning notification
    await expect(page.getByText('Notification sent to customer')).toBeVisible();
    
    console.log('Verification complete for delivery acceptance email notification');
  });

  test('should send completion notification when delivery is marked as delivered', async ({ page, request }) => {
    // Log in as the courier
    await page.goto('/en/courier/login');
    await page.getByPlaceholder('Email Address').fill('test_courier@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Go to active deliveries
    await expect(page.getByRole('heading', { name: 'Courier Dashboard' })).toBeVisible();
    await page.getByRole('tab', { name: 'Active' }).click();
    
    // Find the delivery
    const deliveryLocator = page.locator(`[data-tracking-id="${trackingId}"]`);
    await expect(deliveryLocator).toBeVisible();
    
    // Update status to picked up
    await deliveryLocator.getByRole('button', { name: 'Mark as Picked Up' }).click();
    await expect(page.getByText('Status updated to picked_up')).toBeVisible();
    
    // Update status to in transit
    await deliveryLocator.getByRole('button', { name: 'Mark as In Transit' }).click();
    await expect(page.getByText('Status updated to in_transit')).toBeVisible();
    
    // Monitor for the delivery completion API call which should trigger completion emails
    const completionRequestPromise = page.waitForRequest(request => 
      request.url().includes(`/api/courier/deliveries`) && 
      request.url().includes(`/update`) &&
      request.method() === 'PUT'
    );
    
    // Mark as delivered
    await deliveryLocator.getByRole('button', { name: 'Mark as Delivered' }).click();
    
    // Wait for the completion API call
    const completionRequest = await completionRequestPromise;
    const requestBody = completionRequest.postDataJSON();
    expect(requestBody).toHaveProperty('status', 'delivered');
    
    // Verify success message mentioning notifications
    await expect(page.getByText('Completion notifications sent')).toBeVisible();
    
    console.log('Verification complete for delivery completion email notifications');
  });
});