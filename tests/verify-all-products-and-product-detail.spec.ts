import { test, expect } from '@playwright/test';

test.describe('Verify All Products and Product Detail', () => {
  
  test('Verify all products are displayed', async ({ page }) => {
    // Go to products page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();
    await expect(page).toHaveURL(/.*products/);

    // Check products page loaded
    await expect(page.locator('h2:has-text("All Products")')).toBeVisible();
    await expect(page.locator('.productinfo').first()).toBeVisible();
    
    // Check multiple products displayed
    const productCount = await page.locator('.productinfo').count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('View product details', async ({ page }) => {
    // Go to products page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();
    await expect(page).toHaveURL(/.*products/);

    // Click first product to view details
    await page.locator('a[href*="/product_details/"]').first().click();
    await expect(page).toHaveURL(/.*product_details/);

    // Check product detail elements
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('.product-information p:has-text("Category:")')).toBeVisible();
    await expect(page.locator('.product-information span span')).toBeVisible();
    await expect(page.locator('.view-product img')).toBeVisible();
  });

  test('Verify product information is complete', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();
    
    // View first product
    await page.locator('a[href*="/product_details/"]').first().click();
    await expect(page).toHaveURL(/.*product_details/);

    // Check product has name and price
    const productName = await page.locator('.product-information h2').textContent();
    const productPrice = await page.locator('.product-information span span').textContent();
    
    expect(productName?.trim()).toBeTruthy();
    expect(productPrice?.trim()).toBeTruthy();
    
    // Check quantity input and add to cart button
    await expect(page.locator('#quantity')).toBeVisible();
    await expect(page.locator('.btn.btn-default.cart')).toBeVisible();
  });

  test('Navigate back from product detail', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();
    
    // Go to product detail
    await page.locator('a[href*="/product_details/"]').first().click();
    await expect(page).toHaveURL(/.*product_details/);

    // Go back to products
    await page.goBack();
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h2:has-text("All Products")')).toBeVisible();
  });
});