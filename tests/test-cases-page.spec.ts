import { test, expect } from '@playwright/test';

test.describe('Test Cases Page Tests', () => {
  
  test('Navigate to Test Cases page', async ({ page }) => {
    // Go to home page and click Test Cases
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/test_cases"]').first().click();

    // Check page loaded correctly
    await expect(page).toHaveURL('https://automationexercise.com/test_cases');
    await expect(page.locator('.title').first()).toBeVisible();
    await expect(page.locator('.panel.panel-default').first()).toBeVisible();
  });

  test('Verify Test Cases content', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/test_cases"]').first().click();

    // Check URL and title
    await expect(page).toHaveURL('https://automationexercise.com/test_cases');
    await expect(page).toHaveTitle(/.*Test Cases/);

    // Check test cases are displayed
    const testCases = page.locator('.panel.panel-default');
    const count = await testCases.count();
    expect(count).toBeGreaterThan(0);
    
    // Check first few test cases are visible
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(testCases.nth(i)).toBeVisible();
    }
  });
});