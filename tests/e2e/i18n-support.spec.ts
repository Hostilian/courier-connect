import { expect, test } from '@playwright/test';

test.describe('Multi-Language Support Tests', () => {
  test('should display the homepage in different languages', async ({ page }) => {
    // Test English (default)
    await page.goto('/en');
    await expect(page.getByRole('heading', { name: 'Fast Local Deliveries' })).toBeVisible();
    
    // Test Czech
    await page.goto('/cs');
    await expect(page.getByRole('heading', { name: 'Rychlé lokální doručení' })).toBeVisible();
    
    // Test German
    await page.goto('/de');
    await expect(page.getByRole('heading', { name: 'Schnelle lokale Lieferungen' })).toBeVisible();
    
    // Test Spanish
    await page.goto('/es');
    await expect(page.getByRole('heading', { name: 'Entregas locales rápidas' })).toBeVisible();
  });
  
  test('should maintain language selection throughout user flow', async ({ page }) => {
    // Start in Spanish
    await page.goto('/es/request');
    
    // Check that the form is in Spanish
    await expect(page.getByText('Información del remitente')).toBeVisible();
    
    // Fill the form in Spanish
    await page.getByPlaceholder('Nombre completo').fill('Juan Pérez');
    await page.getByPlaceholder('+1 234 567 8900').fill('5551234567');
    await page.getByLabel('Dirección de recogida').fill('789 Calle Principal, Ciudad, ES');
    
    // Proceed to next step
    await page.getByRole('button', { name: 'Siguiente' }).click();
    
    // Verify the language is maintained
    await expect(page.getByText('Información del destinatario')).toBeVisible();
  });
  
  test('should allow language switching via the language selector', async ({ page }) => {
    await page.goto('/en');
    
    // Open language selector
    await page.getByRole('button', { name: 'English' }).click();
    
    // Select French
    await page.getByRole('option', { name: 'Français' }).click();
    
    // Verify URL changed to French
    await expect(page).toHaveURL(/\/fr\//);
    
    // Verify content changed to French
    await expect(page.getByRole('heading', { name: 'Livraisons locales rapides' })).toBeVisible();
  });
  
  test('should respect right-to-left layout for Arabic', async ({ page }) => {
    await page.goto('/ar');
    
    // Check that the page has RTL direction
    const htmlElement = await page.locator('html');
    await expect(htmlElement).toHaveAttribute('dir', 'rtl');
    
    // Verify Arabic content is visible
    await expect(page.getByText('توصيل محلي سريع')).toBeVisible();
  });
  
  test('should show cultural theme colors based on language', async ({ page }) => {
    // Test Turkish theme
    await page.goto('/tr');
    const turkishHeaderBg = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? getComputedStyle(header).backgroundColor : null;
    });
    
    // Test Vietnamese theme
    await page.goto('/vi');
    const vietnameseHeaderBg = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? getComputedStyle(header).backgroundColor : null;
    });
    
    // They should be different colors
    expect(turkishHeaderBg).not.toEqual(vietnameseHeaderBg);
  });
});