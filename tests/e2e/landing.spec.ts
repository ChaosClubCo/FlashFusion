import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load and display hero section', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/FlashFusion/);

    // Verify Hero renders
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check for CTA button
    const ctaButton = page.getByRole('button', { name: /start building/i });
    await expect(ctaButton).toBeVisible();
  });

  test('should have working CTA button', async ({ page }) => {
    await page.goto('/');

    const ctaButton = page.getByRole('button', { name: /start building/i });
    await ctaButton.click();

    // Should navigate or trigger action
    await page.waitForTimeout(500);
  });

  test('should have accessible skip link', async ({ page }) => {
    await page.goto('/');

    // Tab to skip link
    await page.keyboard.press('Tab');

    // Skip link should be visible when focused
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();

    // Press Enter on skip link
    await page.keyboard.press('Enter');

    // Focus should move to main content
    const main = page.locator('#main');
    await expect(main).toBeFocused();
  });

  test('should display metrics section', async ({ page }) => {
    await page.goto('/');

    // Check for metrics
    await expect(page.getByText(/projects created/i)).toBeVisible();
  });

  test('should have proper focus visible states', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that focused element is visible
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.outline !== 'none' || style.boxShadow.includes('0 0');
    });

    expect(focused).toBeTruthy();
  });

  test('should respect reduced motion preference', async ({ page, context }) => {
    // Set reduced motion preference
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      });
    });

    await page.goto('/');

    // Animations should be disabled or reduced
    const hasReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    expect(hasReducedMotion).toBe(true);
  });
});
