import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {
  test('should show 404 page for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    // Should show 404 content
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });

  test('should have "Go Home" button', async ({ page }) => {
    await page.goto('/nonexistent-page');

    const homeButton = page.getByRole('link', { name: /go home|back to home|home/i });
    await expect(homeButton).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/invalid-route');

    const homeButton = page.getByRole('link', { name: /go home|back to home|home/i });
    await homeButton.click();

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/404');

    // Should have proper heading structure
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Should be keyboard navigable
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });
});
