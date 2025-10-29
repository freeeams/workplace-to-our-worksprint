import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productsLink: Locator;
  readonly testCasesLink: Locator;
  readonly cartLink: Locator;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly contactUsLink: Locator;
  readonly loginSignupLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productsLink = page.locator('a[href="/products"]').first();
    this.testCasesLink = page.locator('a[href="/test_cases"]').first();
    this.cartLink = page.locator('a[href="/view_cart"]').first();
    this.logo = page.locator('.logo img');
    this.homeLink = page.locator('a[href="/"]').first();
    this.contactUsLink = page.locator('a[href="/contact_us"]').first();
    this.loginSignupLink = page.locator('a[href="/login"]').first();
  }

  async navigateToHomePage() {
    await this.goto('https://automationexercise.com');
    await this.waitForPageLoad();
  }

  async clickProducts() {
    await this.productsLink.click();
  }

  async clickTestCases() {
    await this.testCasesLink.click();
  }

  async clickCart() {
    await this.cartLink.click();
  }

  async clickContactUs() {
    await this.contactUsLink.click();
  }

  async clickLoginSignup() {
    await this.loginSignupLink.click();
  }

  async clickHome() {
    await this.homeLink.click();
  }

  async verifyHomePageLoaded() {
    await expect(this.logo).toBeVisible();
    await expect(this.page).toHaveURL('https://automationexercise.com');
  }

  async verifyNavigationLinks() {
    await expect(this.productsLink).toBeVisible();
    await expect(this.testCasesLink).toBeVisible();
    await expect(this.cartLink).toBeVisible();
    await expect(this.contactUsLink).toBeVisible();
    await expect(this.loginSignupLink).toBeVisible();
  }
}