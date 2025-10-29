import { test, expect } from '@playwright/test';

test.describe('Search Product Tests', () => {
  
  test('Search for Dress products', async ({ page }) => {
    // Go to website and products page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();
    await expect(page).toHaveURL(/.*products/);

    // Search for "Dress"
    await page.locator('#search_product').fill('Dress');
    await page.locator('#submit_search').click();
    await page.waitForTimeout(2000);

    // Check search results
    await expect(page.locator('h2:has-text("Searched Products")')).toBeVisible();
    const products = await page.locator('.productinfo').allTextContents();
    expect(products.some(text => text.toLowerCase().includes('dress'))).toBeTruthy();
  });

  test('Search for different products', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();

    const searchTerms = ['Top', 'Jeans', 'Shirt'];

    for (const searchTerm of searchTerms) {
      // Search for product
      await page.locator('#search_product').fill(searchTerm);
      await page.locator('#submit_search').click();
      await page.waitForTimeout(2000);

      // Check results
      await expect(page.locator('h2:has-text("Searched Products")')).toBeVisible();
      
      // Go back to products page for next search
      await page.locator('a[href="/products"]').click();
    }
  });
});