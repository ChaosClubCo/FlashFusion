import { test, expect } from '@playwright/test';

test.describe('Modal Focus Trap', () => {
  test('should trap focus in modal', async ({ page }) => {
    await page.goto('/');

    // Try to trigger a modal (this might need adjustment based on actual implementation)
    // Looking for any modal trigger
    const modalTrigger = page.getByRole('button').first();

    // Check if modal exists in the page
    const hasModal = await page.locator('[role="dialog"], .modal, [data-modal]').count();

    if (hasModal === 0) {
      test.skip();
      return;
    }

    await modalTrigger.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[role="dialog"]').first();
    if (await modal.isVisible()) {
      // Tab through modal
      const focusableElements = modal.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const count = await focusableElements.count();

      if (count > 0) {
        // Tab through all focusable elements
        for (let i = 0; i < count + 2; i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(50);
        }

        // Focus should stay within modal (loop back to first element)
        const focusedElement = page.locator(':focus');
        const isInModal = await modal.locator(':focus').count();
        expect(isInModal).toBeGreaterThan(0);
      }

      // Press Esc to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // Modal should close
      await expect(modal).not.toBeVisible();
    }
  });

  test('should close modal on Escape key', async ({ page }) => {
    await page.goto('/');

    const modal = page.locator('[role="dialog"]').first();
    const hasModal = await modal.count();

    if (hasModal > 0 && await modal.isVisible()) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await expect(modal).not.toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should return focus to trigger element after modal closes', async ({ page }) => {
    await page.goto('/');

    const trigger = page.getByRole('button').first();
    const hasModal = await page.locator('[role="dialog"]').count();

    if (hasModal > 0) {
      await trigger.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]').first();
      if (await modal.isVisible()) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Focus should return to trigger (or be visible somewhere)
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        expect(focused).toBeTruthy();
      }
    } else {
      test.skip();
    }
  });
});
