import { test, expect } from '@playwright/test';

test.describe('Products and Product Detail Tests', () => {
  
  test('View products and product details', async ({ page }) => {
    // Go to products page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();
    await expect(page).toHaveURL(/.*products/);

    // Check products page loaded
    await expect(page.locator('h2:has-text("All Products")')).toBeVisible();
    await expect(page.locator('.productinfo').first()).toBeVisible();

    // Click first product to view details
    await page.locator('a[href*="/product_details/"]').first().click();
    await expect(page).toHaveURL(/.*product_details/);

    // Check product detail page elements
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('.product-information p:has-text("Category:")')).toBeVisible();
    await expect(page.locator('.product-information span span')).toBeVisible();
    await expect(page.locator('.view-product img')).toBeVisible();
  });
});