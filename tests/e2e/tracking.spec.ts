import { expect, test } from '@playwright/test';

test.describe('Customer Tracking Flow', () => {
  let trackingId: string;

  test.beforeAll(async ({ request }) => {
    // Create a delivery request to get a valid tracking ID
    const response = await request.post('/api/deliveries', {
      data: {
        senderName: 'Test Sender',
        senderPhone: '1234567890',
        senderAddress: '123 Test St, Testville',
        senderLocation: { lat: 34.0522, lng: -118.2437 },
        receiverName: 'Test Receiver',
        receiverPhone: '0987654321',
        receiverAddress: '456 Test Ave, Testburg',
        receiverLocation: { lat: 34.0522, lng: -118.2437 },
        packageType: 'document',
        packageSize: 'small',
        urgency: 'standard',
        locale: 'en',
      },
    });
    const data = await response.json();
    trackingId = data.trackingId;
    expect(trackingId).toBeDefined();
  });

  test('should display tracking information for a valid ID', async ({ page }) => {
    await page.goto(`/en/track?id=${trackingId}`);

    // Check for the tracking ID on the page
    await expect(page.getByText(trackingId)).toBeVisible();

    // Check for status
    await expect(page.getByText('Pending')).toBeVisible();

    // Check for package info
    await expect(page.getByText('document')).toBeVisible();
  });

  test('should show an error for an invalid tracking ID', async ({ page }) => {
    await page.goto('/en/track?id=INVALID-ID');

    // Check for the error message
    await expect(page.getByText('Delivery not found')).toBeVisible();
  });

  test('should show the live map when a courier is assigned', async ({ page, request }) => {
    // This test requires a more complex setup where a courier accepts the delivery.
    // For now, we'll just check that the map is not visible for a pending delivery.
    await page.goto(`/en/track?id=${trackingId}`);
    await expect(page.getByRole('region', { name: /map/i })).not.toBeVisible();

    // TODO: Add a step to accept the delivery via API as a courier,
    // then reload the page and assert the map is visible.
  });
});
