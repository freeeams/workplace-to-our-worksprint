import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestCasesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly pageHeading: Locator;
  readonly testCasesList: Locator;
  readonly testCaseItems: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('title');
    this.pageHeading = page.locator('h2.title.text-center, .title').first();
    this.testCasesList = page.locator('.panel-group').first();
    this.testCaseItems = page.locator('.panel.panel-default');
  }

  async verifyTestCasesPageLoaded() {
    await expect(this.page).toHaveURL('https://automationexercise.com/test_cases');
    await expect(this.pageTitle).toContainText('Test Cases');
  }

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(/.*Test Cases/);
  }

  async verifyPageHeading() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageHeading).toContainText(/Test Cases|TEST CASES/i);
  }

  async scrollThroughTestCases() {
    await this.testCasesList.scrollIntoViewIfNeeded();
  }

  async verifyTestCasesDisplayed() {
    await expect(this.testCaseItems.first()).toBeVisible();
    const testCaseCount = await this.testCaseItems.count();
    expect(testCaseCount).toBeGreaterThan(0);
  }

  async verifyTestCaseTitlesReadable() {
    const testCases = this.testCaseItems;
    const count = await testCases.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) { // Check first 5 test cases
      const testCase = testCases.nth(i);
      await expect(testCase).toBeVisible();
      
      // Check if test case has readable title
      const titleElement = testCase.locator('.panel-title, .test-case-title, h4, h5');
      if (await titleElement.count() > 0) {
        await expect(titleElement.first()).toBeVisible();
      }
    }
  }

  async clickTestCase(index: number = 0) {
    await this.testCaseItems.nth(index).click();
  }

  async getTestCaseCount(): Promise<number> {
    return await this.testCaseItems.count();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000); // Small buffer for content to stabilize
  }
}