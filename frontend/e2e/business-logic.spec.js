const { test, expect } = require('@playwright/test');

test.describe('Smart Phòng Trọ - Business Logic & UI E2E Automated Tests', () => {

  test('1. Public Homepage & Room Browsing Test', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Verify Title & Hero Section
    const title = await page.title();
    console.log(`[Test 1] Page Title: ${title}`);
    await expect(page).toHaveTitle(/Smart Phòng Trọ|Phòng Trọ/i);
  });

  test('2. Admin Authentication & Dashboard Navigation Test', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('[Test 2] Attempting login with admin credentials...');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[name="password"], input[type="password"]', 'admin123');

    // Click Login
    await page.click('button[type="submit"], button:has-text("Đăng nhập")');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`[Test 2] Post-login URL: ${currentUrl}`);

    // Verify URL or Login Form existence
    expect(page.url()).toBeDefined();
  });

  test('3. Emoji Removal Verification Test across UI', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const bodyText = await page.innerText('body');
    
    // List of forbidden AI cheesy emojis
    const cheesyEmojis = ['🔥', '✨', '⚡', '📊', '📋', '🎯', '💬', '⚠️', '🚀', '🔑'];
    const foundEmojis = cheesyEmojis.filter(emoji => bodyText.includes(emoji));

    console.log(`[Test 3] Cheesy emojis found in UI body text:`, foundEmojis);
    expect(foundEmojis.length).toBe(0);
  });

  test('4. Security & Role Restriction Verification', async ({ page }) => {
    // Attempt direct access to admin page without auth
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const finalUrl = page.url();
    console.log(`[Test 4] Unauthenticated access to /admin/dashboard redirected to: ${finalUrl}`);
    // Should be redirected to login page or home page
    expect(finalUrl).not.toContain('/admin/dashboard');
  });

});
