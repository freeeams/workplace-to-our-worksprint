import { test, expect } from '@playwright/test';

test.describe('Verify Test Cases Page', () => {
  
  test('should navigate to test cases page and verify content', async ({ page }) => {
    // Step 1: From the homepage, click on the "Test Cases" link in the top navigation bar
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/test_cases"]').first().click();

    // Step 2: Wait for the Test Cases page to fully load
    // Page loads without errors; URL should be https://automationexercise.com/test_cases
    await expect(page).toHaveURL('https://automationexercise.com/test_cases');

    // Step 3: Verify the page title and heading
    // Page title is "Automation Practice Website for UI Testing - Test Cases"
    await expect(page).toHaveTitle(/.*Test Cases/);
    await expect(page.locator('h2.title.text-center, .title').first()).toBeVisible();

    // Step 4: Scroll through the page and review listed test cases
    await page.locator('.panel-group').first().scrollIntoViewIfNeeded();
    
    // A list of test cases is displayed on the page, each with a title and description
    await expect(page.locator('.panel.panel-default').first()).toBeVisible();
    const testCaseCount = await page.locator('.panel.panel-default').count();
    expect(testCaseCount).toBeGreaterThan(0);

    // Step 5: Optionally, click on a test case or interact if available
    // Page remains stable; if clickable, relevant test case expands or behaves as expected
    const testCases = page.locator('.panel.panel-default');
    const count = await testCases.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) { // Check first 3 test cases
      const testCase = testCases.nth(i);
      await expect(testCase).toBeVisible();
      
      // Check if test case has readable title
      const titleElement = testCase.locator('.panel-title, .test-case-title, h4, h5');
      if (await titleElement.count() > 0) {
        await expect(titleElement.first()).toBeVisible();
      }
    }
  });

  test('should verify test cases page URL and content structure', async ({ page }) => {
    // Step 1: Click on the "Test Cases" link in the top navigation bar
    await page.goto('https://automationexercise.com');
    await page.locator('a[href="/test_cases"]').first().click();

    // Step 2: Wait for the page to finish loading
    // Page loads completely without any visual or console errors
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://automationexercise.com/test_cases');

    // Step 3: Verify the URL of the page
    // URL is https://automationexercise.com/test_cases
    await expect(page).toHaveURL('https://automationexercise.com/test_cases');

    // Step 4: Check the page heading and title
    // Page heading is clearly visible and title includes "Test Cases"
    await expect(page.locator('h2.title.text-center, .title').first()).toBeVisible();
    await expect(page).toHaveTitle(/.*Test Cases/);

    // Step 5: Scroll down through the content
    await page.locator('.panel-group').first().scrollIntoViewIfNeeded();
    
    // A structured list of test cases is visible, each with a title and description
    await expect(page.locator('.panel.panel-default').first()).toBeVisible();

    // Step 6: Verify all test case titles are readable and properly aligned
    // Each test case title is displayed clearly, no layout or formatting issues
    const testCases = page.locator('.panel.panel-default');
    const count = await testCases.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 5); i++) { // Check first 5 test cases
      const testCase = testCases.nth(i);
      await expect(testCase).toBeVisible();
    }
  });
});