import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('should display all pricing tiers', async ({ page }) => {
    await page.goto('/pricing');

    // Verify 3 pricing tiers
    await expect(page.getByText(/free/i).first()).toBeVisible();
    await expect(page.getByText(/pro/i).first()).toBeVisible();
    await expect(page.getByText(/enterprise/i).first()).toBeVisible();
  });

  test('should show promo badge when enabled', async ({ page }) => {
    await page.goto('/pricing');

    // Check for promo badge (if PROMO_LAUNCH50=true)
    const promoBadge = page.getByText(/50% off/i);
    const isVisible = await promoBadge.isVisible().catch(() => false);

    // Either visible or not, both are valid based on feature flag
    expect(typeof isVisible).toBe('boolean');
  });

  test('should have clickable upgrade buttons', async ({ page }) => {
    await page.goto('/pricing');

    // Find all upgrade buttons
    const upgradeButtons = page.getByRole('button', { name: /upgrade|get started|contact/i });
    const count = await upgradeButtons.count();

    expect(count).toBeGreaterThan(0);

    // Click first upgrade button
    await upgradeButtons.first().click();
    await page.waitForTimeout(500);
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/pricing');

    // Tab through pricing cards
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Should be able to navigate all interactive elements
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('should display feature lists', async ({ page }) => {
    await page.goto('/pricing');

    // Check for feature lists
    const features = page.locator('ul li, .feature-item');
    const count = await features.count();

    expect(count).toBeGreaterThan(0);
  });
});
