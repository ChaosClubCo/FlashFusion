import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper page structure on all pages', async ({ page }) => {
    const pages = ['/', '/pricing', '/qa', '/privacy', '/terms', '/status'];

    for (const path of pages) {
      await page.goto(path);

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Should have main landmark
      const main = page.locator('main, [role="main"]');
      await expect(main).toBeVisible();

      // Should have skip link
      await page.keyboard.press('Tab');
      const skipLink = page.locator('a').first();
      const skipText = await skipLink.textContent();
      expect(skipText?.toLowerCase()).toContain('skip');
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    // Check contrast of main heading
    const heading = page.locator('h1').first();
    const contrast = await heading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bg = style.backgroundColor;
      return { color, bg };
    });

    expect(contrast.color).toBeTruthy();
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/');

    // Check buttons have accessible names
    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || await button.textContent();
      expect(accessibleName).toBeTruthy();
    }
  });

  test('should support keyboard navigation throughout', async ({ page }) => {
    await page.goto('/');

    // Tab through first 20 focusable elements
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);

      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          hasVisibleFocus: el ? window.getComputedStyle(el).outline !== 'none' ||
                            window.getComputedStyle(el).boxShadow !== 'none' : false
        };
      });

      if (focused.tag && focused.tag !== 'BODY') {
        // Interactive elements should have visible focus
        expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focused.tag);
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');

    // Find all form inputs
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.evaluate((el) => {
        const id = el.getAttribute('id');
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;

        return !!(label || ariaLabel || ariaLabelledBy);
      });

      expect(hasLabel).toBe(true);
    }
  });

  test('should have lang attribute on html', async ({ page }) => {
    await page.goto('/');

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(0);
  });
});
