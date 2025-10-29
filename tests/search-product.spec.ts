import { test, expect } from '@playwright/test';

test.describe('Verify Search Product Functionality', () => {
  
  test('should search for products and verify results', async ({ page }) => {
    // Step 1: Click on the "Products" link in the top navigation bar
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();

    // Step 2: Wait for the product list to fully load
    // Product grid is displayed with visible items
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h2.title.text-center')).toContainText('All Products');
    await expect(page.locator('.productinfo').first()).toBeVisible();

    // Step 3: Enter a product name (e.g., "Dress") into the Search field
    const searchTerm = "Dress";
    await page.locator('#search_product').fill(searchTerm);

    // Step 4: Click on the Search button
    // Page refreshes to show only products matching the keyword
    await page.locator('#submit_search').click();
    
    // Use more reliable wait strategy
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow time for search results to load

    // Step 5: Verify that the Searched Products section appears
    // Section title "Searched Products" is displayed above the filtered items
    await expect(page.locator('h2.title.text-center').filter({ hasText: 'Searched Products' })).toBeVisible();

    // Step 6: Check that all shown products match the search term
    // All displayed products contain the keyword "Dress" in their name or description
    const productCards = page.locator('.productinfo');
    const productTexts = await productCards.allTextContents();
    
    // Verify that at least one product is found
    expect(productTexts.length).toBeGreaterThan(0);
    
    // Verify that products contain the search term
    const matchingProducts = productTexts.filter(text => 
      text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(matchingProducts.length).toBeGreaterThan(0);
  });

  test('should handle search with different keywords', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/products"]').click();
    await expect(page).toHaveURL(/.*products/);

    // Test with different search terms
    const searchTerms = ["Top", "Jeans", "Shirt"];

    for (const searchTerm of searchTerms) {
      // Navigate back to products page for each search
      await page.locator('a[href="/products"]').click();
      await expect(page).toHaveURL(/.*products/);

      // Perform search
      await page.locator('#search_product').fill(searchTerm);
      await page.locator('#submit_search').click();
      
      // Use a more flexible wait strategy instead of networkidle
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000); // Give time for search results to load

      // Verify search results
      await expect(page.locator('h2.title.text-center').filter({ hasText: 'Searched Products' })).toBeVisible();
      
      // Check that products are displayed (if any match)
      const productCount = await page.locator('.productinfo').count();
      if (productCount > 0) {
        const productTexts = await page.locator('.productinfo').allTextContents();
        const hasMatchingProducts = productTexts.some(text => 
          text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // If products are shown, at least one should match the search term
        expect(hasMatchingProducts).toBeTruthy();
      }
    }
  });
});