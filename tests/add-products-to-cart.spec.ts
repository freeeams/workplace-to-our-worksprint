import { test, expect } from '@playwright/test';

test.describe('Add Products to Cart Tests', () => {
  
  test('Add products to cart', async ({ page }) => {
    // Go to products page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();
    await expect(page).toHaveURL(/.*products/);

    // Add first product to cart
    await page.locator('a[data-product-id]').first().click({ force: true });

    // Try to handle modal if it appears
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 3000 });
      await page.locator('button:has-text("Continue Shopping")').click();
    } catch {
      // Continue if no modal
    }

    // Add second product to cart
    await page.locator('a[data-product-id]').nth(1).click({ force: true });

    // Go to cart
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 3000 });
      await page.locator('a:has-text("View Cart")').click();
    } catch {
      await page.locator('a[href="/view_cart"]').click();
    }

    // Check cart has products
    await expect(page).toHaveURL(/.*view_cart/);
    const cartItems = await page.locator('#cart_items .cart_info tr').count();
    expect(cartItems).toBeGreaterThan(1);
  });

  test('Add single product to cart', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();

    // Add one product to cart
    await page.locator('a[data-product-id]').first().click({ force: true });

    // Go to cart
    try {
      await page.waitForSelector('#cartModal', { state: 'visible', timeout: 3000 });
      await page.locator('a:has-text("View Cart")').click();
    } catch {
      await page.locator('a[href="/view_cart"]').click();
    }

    // Check cart has the product
    await expect(page).toHaveURL(/.*view_cart/);
    const productNames = await page.locator('.cart_description h4 a').count();
    expect(productNames).toBeGreaterThan(0);
  });
});