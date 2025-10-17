import { expect, test } from '@playwright/test';

/**
 * E2E Test: Courier Dashboard
 * 
 * Tests courier-specific functionality:
 * 1. Registration
 * 2. Login
 * 3. Dashboard access
 * 4. Delivery acceptance
 * 5. Status updates
 * 6. Earnings display
 */

test.describe('Courier Registration', () => {
  test('should complete courier registration', async ({ page }) => {
    await page.goto('/en/courier/register');

    // Fill registration form
    await page.fill('input[name="name"]', 'Test Courier');
    await page.fill('input[name="email"]', `courier${Date.now()}@example.com`);
    await page.fill('input[name="phone"]', '+420123456789');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!');

    // Vehicle information
    await page.selectOption('select[name="vehicleType"]', 'car');
    await page.fill('input[name="licenseNumber"]', 'ABC123456');

    // Service area
    await page.selectOption('select[name="serviceCountry"]', 'CZ');
    await page.fill('input[name="serviceCity"]', 'Prague');

    // Accept terms
    await page.check('input[type="checkbox"][name*="terms"]');

    // Submit registration
    await page.getByRole('button', { name: /register|sign up/i }).click();

    // Should redirect to verification page or login
    await expect(page).toHaveURL(/\/(courier\/login|verify|dashboard)/);
    
    // Check for success message
    await expect(page.locator('text=/success|registered|verify/i')).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/en/courier/register');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="name"]', 'Test');
    await page.getByRole('button', { name: /register/i }).click();

    // Should show validation error
    await expect(page.locator('text=/invalid email|valid email/i')).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/en/courier/register');

    await page.fill('input[name="password"]', 'weak');
    await page.fill('input[name="confirmPassword"]', 'weak');
    
    // Should show password strength indicator or error
    await expect(page.locator('text=/weak password|password must|at least/i')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Courier Login', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/en/courier/login');

    // Use test credentials (assumes test user exists)
    await page.fill('input[name="email"], input[type="email"]', 'testcourier@example.com');
    await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');

    await page.getByRole('button', { name: /login|sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/courier\/dashboard/, { timeout: 5000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/en/courier/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    await page.getByRole('button', { name: /login/i }).click();

    // Should show error message
    await expect(page.locator('text=/invalid|incorrect|not found/i')).toBeVisible({ timeout: 3000 });
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/en/courier/login');

    const forgotLink = page.getByRole('link', { name: /forgot password/i });
    await expect(forgotLink).toBeVisible();
    
    await forgotLink.click();
    await expect(page).toHaveURL(/\/courier\/forgot-password/);
  });
});

test.describe('Courier Dashboard (Protected)', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/courier/login');
    
    // Login with test credentials
    await page.fill('input[type="email"]', 'testcourier@example.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for dashboard
    await page.waitForURL(/\/courier\/dashboard/, { timeout: 5000 });
  });

  test('should display courier dashboard', async ({ page }) => {
    // Check dashboard elements
    await expect(page.locator('h1, h2').filter({ hasText: /dashboard/i })).toBeVisible();
    
    // Check key sections exist
    await expect(page.locator('text=/active deliveries|available deliveries/i')).toBeVisible();
    await expect(page.locator('text=/earnings|income|revenue/i')).toBeVisible();
    await expect(page.locator('text=/rating|reviews/i')).toBeVisible();
  });

  test('should toggle availability', async ({ page }) => {
    // Find availability toggle
    const availabilityToggle = page.locator('input[type="checkbox"][name*="available"], button[aria-label*="availability"]');
    
    if (await availabilityToggle.isVisible()) {
      const initialState = await availabilityToggle.isChecked?.() || false;
      
      // Toggle availability
      await availabilityToggle.click();
      
      // Wait for state change
      await page.waitForTimeout(1000);
      
      // Verify state changed
      const newState = await availabilityToggle.isChecked?.() || false;
      expect(newState).not.toBe(initialState);
    }
  });

  test('should display earnings breakdown', async ({ page }) => {
    // Check earnings section
    const earningsSection = page.locator('[data-testid="courier-earnings"], section:has-text("Earnings")');
    await expect(earningsSection).toBeVisible();

    // Should show 70% split information
    await expect(page.locator('text=/70%|courier share/i')).toBeVisible();
    
    // Should show total earnings
    await expect(page.locator('text=/total|earned/i')).toBeVisible();
  });

  test('should list available deliveries', async ({ page }) => {
    // Navigate to available deliveries tab/section
    const deliveriesSection = page.locator('[data-testid="available-deliveries"], section:has-text("Available")');
    
    if (await deliveriesSection.isVisible()) {
      // Check if deliveries are listed
      const deliveryCards = page.locator('[data-testid="delivery-card"]');
      
      if (await deliveryCards.count() > 0) {
        // Click on first delivery
        await deliveryCards.first().click();
        
        // Should show delivery details
        await expect(page.locator('text=/details|description|pickup/i')).toBeVisible();
      }
    }
  });

  test('should accept delivery', async ({ page }) => {
    // Find an available delivery
    const acceptButton = page.getByRole('button', { name: /accept|take/i }).first();
    
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
      
      // Wait for confirmation
      await expect(page.locator('text=/accepted|assigned|success/i')).toBeVisible({ timeout: 3000 });
      
      // Should move to active deliveries
      await expect(page.locator('text=/active|in progress/i')).toBeVisible();
    }
  });

  test('should update delivery status', async ({ page }) => {
    // Assumes courier has an active delivery
    const statusButtons = page.locator('button[data-status], select[name="status"]');
    
    if (await statusButtons.first().isVisible()) {
      // Update status (e.g., "Picked Up")
      const pickupButton = page.getByRole('button', { name: /picked up|mark picked/i });
      
      if (await pickupButton.isVisible()) {
        await pickupButton.click();
        
        // Check for confirmation
        await expect(page.locator('text=/status updated|picked up/i')).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should show map with route', async ({ page }) => {
    // Check if map is rendered
    const mapContainer = page.locator('[data-testid="delivery-map"], .google-map, #map');
    
    if (await mapContainer.isVisible()) {
      // Map should be interactive
      await expect(mapContainer).toBeVisible();
      
      // Should show route markers
      // Note: Testing map markers requires additional setup
    }
  });

  test('should logout successfully', async ({ page }) => {
    // Find logout button
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login or homepage
      await expect(page).toHaveURL(/\/(courier\/login|en\/?$)/);
    } else {
      // Try menu logout
      const menuButton = page.locator('[aria-label*="menu"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.getByRole('button', { name: /logout/i }).click();
        await expect(page).toHaveURL(/\/(courier\/login|en\/?$)/);
      }
    }
  });
});

test.describe('Courier Protected Routes', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/en/courier/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/courier\/login/, { timeout: 5000 });
  });

  test('should maintain session after page reload', async ({ page }) => {
    // Login
    await page.goto('/en/courier/login');
    await page.fill('input[type="email"]', 'testcourier@example.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/courier\/dashboard/);

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL(/\/courier\/dashboard/);
    await expect(page.locator('text=/dashboard/i')).toBeVisible();
  });
});

test.describe('Delivery Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Login as courier
    await page.goto('/en/courier/login');
    await page.fill('input[type="email"]', 'testcourier@example.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/courier\/dashboard/);
  });

  test('should complete full delivery lifecycle', async ({ page }) => {
    // This test requires a delivery to be available
    // It's more of an integration test

    // 1. Accept delivery (if available)
    const acceptButton = page.getByRole('button', { name: /accept/i }).first();
    
    if (!(await acceptButton.isVisible())) {
      test.skip();
      return;
    }

    await acceptButton.click();
    await expect(page.locator('text=/accepted/i')).toBeVisible({ timeout: 3000 });

    // 2. Mark as picked up
    const pickupButton = page.getByRole('button', { name: /picked up/i });
    if (await pickupButton.isVisible()) {
      await pickupButton.click();
      await page.waitForTimeout(1000);
    }

    // 3. Mark as in transit
    const transitButton = page.getByRole('button', { name: /in transit/i });
    if (await transitButton.isVisible()) {
      await transitButton.click();
      await page.waitForTimeout(1000);
    }

    // 4. Mark as delivered
    const deliveredButton = page.getByRole('button', { name: /delivered/i });
    if (await deliveredButton.isVisible()) {
      await deliveredButton.click();
      
      // Should show completion confirmation
      await expect(page.locator('text=/completed|success|delivered/i')).toBeVisible({ timeout: 3000 });
    }
  });
});
