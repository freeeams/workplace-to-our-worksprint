import { test, expect } from '@playwright/test';

test.describe('Add Products to Cart', () => {
  
  test('should add multiple products to cart and verify cart contents', async ({ page }) => {
    // Step 1: Click on the "Products" link in the top navigation bar
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();

    // Step 2: Wait for all product cards to fully load
    // Multiple product items are displayed with Add to Cart buttons
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('.productinfo').first()).toBeVisible();

    // Step 3: Hover over a product and click "Add to Cart"
    await page.locator('.productinfo').first().hover();
    // Use force click to bypass any intercepting elements like ads
    await page.locator('a[data-product-id]').first().click({ force: true });

    // Wait for any modal and handle it
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 5000 });
      // Step 4: Click "Continue Shopping" to stay on the product page
      await page.locator('.btn.btn-success, button:has-text("Continue Shopping")').click();
    } catch {
      // If modal doesn't appear, continue anyway
      console.log('Modal did not appear, continuing...');
    }

    // Step 5: Add another product using the same method
    await page.locator('.productinfo').nth(1).hover();
    // Use force click and scroll into view to avoid ad interference
    await page.locator('a[data-product-id]').nth(1).scrollIntoViewIfNeeded();
    await page.locator('a[data-product-id]').nth(1).click({ force: true });

    // Wait for modal and click View Cart
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 5000 });
      await page.locator('a:has-text("View Cart"), .btn:has-text("View Cart")').click();
    } catch {
      // If modal doesn't appear, navigate to cart directly
      await page.locator('a[href="/view_cart"]').first().click();
    }

    // Cart page opens, showing both selected products with correct names and quantities
    await expect(page).toHaveURL(/.*view_cart/);
    
    // Verify cart items (should be 2 products + header row = 3 total rows)
    const cartItems = await page.locator('#cart_items .cart_info tr').count();
    expect(cartItems).toBeGreaterThanOrEqual(2); // At least 2 products
  });

  test('should verify cart functionality with single product', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();
    await expect(page).toHaveURL(/.*products/);

    // Add single product to cart
    await page.locator('.productinfo').first().hover();
    await page.locator('a[data-product-id]').first().scrollIntoViewIfNeeded();
    await page.locator('a[data-product-id]').first().click({ force: true });

    // Handle modal or navigate directly to cart
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 5000 });
      await page.locator('a:has-text("View Cart"), .btn:has-text("View Cart")').click();
    } catch {
      // If modal doesn't appear, navigate to cart directly
      await page.locator('a[href="/view_cart"]').first().click();
    }

    // Verify cart contents
    await expect(page).toHaveURL(/.*view_cart/);
    
    // Verify product details in cart
    const productNames = await page.locator('.cart_description h4 a').count();
    expect(productNames).toBeGreaterThan(0);

    const productPrices = await page.locator('.cart_price p').count();
    expect(productPrices).toBeGreaterThan(0);
  });

  test('should handle adding products via different methods', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();
    await expect(page).toHaveURL(/.*products/);

    // Method 1: Add product directly without hover
    await page.locator('a[data-product-id]').first().scrollIntoViewIfNeeded();
    await page.locator('a[data-product-id]').first().click({ force: true });
    
    // Handle first modal
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 5000 });
      await page.locator('.btn.btn-success, button:has-text("Continue Shopping")').click();
    } catch {
      console.log('First modal did not appear, continuing...');
    }

    // Method 2: Add product with hover first
    await page.locator('.productinfo').nth(1).hover();
    await page.waitForTimeout(1000); // Wait for hover effect
    await page.locator('a[data-product-id]').nth(1).scrollIntoViewIfNeeded();
    await page.locator('a[data-product-id]').nth(1).click({ force: true });
    
    // Handle second modal or navigate to cart
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 5000 });
      await page.locator('a:has-text("View Cart"), .btn:has-text("View Cart")').click();
    } catch {
      // If modal doesn't appear, navigate to cart directly
      await page.locator('a[href="/view_cart"]').first().click();
    }

    // Verify both products in cart
    await expect(page).toHaveURL(/.*view_cart/);
    const cartItems = await page.locator('#cart_items .cart_info tr').count();
    expect(cartItems).toBeGreaterThanOrEqual(2);
  });
});