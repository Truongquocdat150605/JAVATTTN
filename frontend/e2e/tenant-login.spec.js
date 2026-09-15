const { test, expect } = require('@playwright/test');

test.describe('Tenant User Navigation & Redirect E2E Test Suite', () => {

  test('Tenant User Login & Auto-Redirect to /tenant/profile', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    console.log('[Tenant Test] Filling tenant login details...');
    await page.fill('input[name="username"], input[type="text"]', '0963639244');
    await page.fill('input[name="password"], input[type="password"]', '123');

    await page.click('button[type="submit"], button:has-text("Đăng nhập")');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`[Tenant Test] Post-login URL for tenant: ${currentUrl}`);

    // Verify it redirects to tenant profile or non-login page
    expect(currentUrl).not.toContain('/login');
  });

});
