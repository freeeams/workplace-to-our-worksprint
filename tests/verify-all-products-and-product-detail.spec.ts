import { test, expect } from '@playwright/test';

test.describe('Verify All Products and Product Detail Page', () => {
  
  test('should navigate to products page and verify all products are displayed', async ({ page }) => {
    // Step 1: Click on the "Products" link in the top navigation bar
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();

    // Step 2: Verify the All Products page loads
    // User is navigated to the All Products page
    await expect(page).toHaveURL(/.*products/);
    
    // The page title contains "All Products", and the page loads without errors
    await expect(page.locator('h2.title.text-center')).toContainText('All Products');
    await expect(page).toHaveTitle(/.*Products/);

    // Step 3: Scroll down to view the product list
    await page.locator('.features_items').scrollIntoViewIfNeeded();
    
    // Multiple products are displayed with name, price, and buttons
    await expect(page.locator('.productinfo').first()).toBeVisible();
    const productCount = await page.locator('.productinfo').count();
    expect(productCount).toBeGreaterThan(0);

    // Verify that each product has necessary elements
    const firstProduct = page.locator('.productinfo').first();
    await expect(firstProduct.locator('h2')).toBeVisible(); // Product name
    await expect(firstProduct.locator('p')).toBeVisible(); // Product price
    await expect(firstProduct.locator('img')).toBeVisible(); // Product image
  });

  test('should click view product and verify product detail page', async ({ page }) => {
    // Step 1: Navigate to products page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();
    await expect(page).toHaveURL(/.*products/);

    // Step 2: Wait for products to load
    await expect(page.locator('.productinfo').first()).toBeVisible();

    // Step 3: Scroll down to view the product list
    await page.locator('.features_items').scrollIntoViewIfNeeded();

    // Step 4: Click on "View Product" for any item
    // A visible product card
    await page.locator('a[href*="/product_details/"]').first().click();

    // Step 5: Verify the product detail page opens
    // User is navigated to the Product Detail page for that item
    await expect(page).toHaveURL(/.*product_details/);

    // Product detail page loads successfully
    await page.waitForLoadState('domcontentloaded');

    // Step 6: Check for presence of key elements (name, category, price, etc.)
    // All product details are visible: name, category, price, availability, description
    
    // Product name should be visible
    await expect(page.locator('.product-information h2')).toBeVisible();
    
    // Category information should be visible
    await expect(page.locator('.product-information p').filter({ hasText: 'Category:' })).toBeVisible();
    
    // Price should be visible
    await expect(page.locator('.product-information span span')).toBeVisible();
    
    // Availability should be visible
    await expect(page.locator('.product-information p').filter({ hasText: 'Availability:' })).toBeVisible();
    
    // Condition should be visible
    await expect(page.locator('.product-information p').filter({ hasText: 'Condition:' })).toBeVisible();
    
    // Brand should be visible
    await expect(page.locator('.product-information p').filter({ hasText: 'Brand:' })).toBeVisible();
    
    // Product image should be visible
    await expect(page.locator('.product-details .view-product img, .product-details img').first()).toBeVisible();
  });

  test('should verify product details are correctly displayed', async ({ page }) => {
    // Navigate to products and select a product detail page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();
    await expect(page).toHaveURL(/.*products/);

    // Wait for products to load and click on first product
    await expect(page.locator('.productinfo').first()).toBeVisible();
    await page.locator('a[href*="/product_details/"]').first().click();
    await expect(page).toHaveURL(/.*product_details/);

    // Verify product information section exists
    const productInfo = page.locator('.product-information');
    await expect(productInfo).toBeVisible();

    // Verify product name is not empty
    const productName = productInfo.locator('h2');
    await expect(productName).toBeVisible();
    const nameText = await productName.textContent();
    expect(nameText?.trim()).toBeTruthy();

    // Verify price is displayed
    const productPrice = productInfo.locator('span span');
    await expect(productPrice).toBeVisible();
    const priceText = await productPrice.textContent();
    expect(priceText?.trim()).toBeTruthy();

    // Verify quantity input is available
    await expect(page.locator('#quantity')).toBeVisible();

    // Verify Add to Cart button is present
    await expect(page.locator('.btn.btn-default.cart')).toBeVisible();
  });

  test('should navigate back to products from product detail page', async ({ page }) => {
    // Navigate to product detail page
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').first().click();
    await expect(page.locator('.productinfo').first()).toBeVisible();
    await page.locator('a[href*="/product_details/"]').first().click();
    await expect(page).toHaveURL(/.*product_details/);

    // Navigate back to products using browser back button
    await page.goBack();
    await expect(page).toHaveURL(/.*products/);
    
    // Verify we're back on the products page
    await expect(page.locator('h2.title.text-center')).toContainText('All Products');
    await expect(page.locator('.productinfo').first()).toBeVisible();
  });
});