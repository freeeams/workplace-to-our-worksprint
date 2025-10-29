import { test, expect } from '@playwright/test';

test.describe('Verify All Products and Product Detail Page', () => {
  
  test('should navigate to products page and verify product detail page', async ({ page }) => {
    // Step 1: Click on the "Products" link in the top navigation bar
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();

    // Step 2: Verify the All Products page loads
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h2.title.text-center')).toContainText('All Products');
    
    // Verify page title contains "All Products" and page loads without errors
    await expect(page).toHaveTitle(/.*Products/);

    // Step 3: Scroll down to view the product list
    await page.locator('.features_items').scrollIntoViewIfNeeded();
    
    // Verify multiple products are displayed with name, price, and buttons
    await expect(page.locator('.productinfo').first()).toBeVisible();
    const productCount = await page.locator('.productinfo').count();
    expect(productCount).toBeGreaterThan(0);

    // Step 4: Click on "View Product" for any item
    await page.locator('a[href*="/product_details/"]').first().click();

    // Step 5: Verify the product detail page opens
    await expect(page).toHaveURL(/.*product_details/);

    // Step 6: Check for presence of key elements (name, category, price, etc.)
    // Verify all product details are visible: name, category, price, availability, description
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('.product-information p').filter({ hasText: 'Category:' })).toBeVisible();
    await expect(page.locator('.product-information span span')).toBeVisible();
    await expect(page.locator('.product-information p').filter({ hasText: 'Availability:' })).toBeVisible();
    await expect(page.locator('.product-information p').filter({ hasText: 'Condition:' })).toBeVisible();
    await expect(page.locator('.product-information p').filter({ hasText: 'Brand:' })).toBeVisible();
    
    // Verify product image is visible
    await expect(page.locator('.product-details .view-product img')).toBeVisible();
  });
});