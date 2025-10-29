import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productsList: Locator;
  readonly productCards: Locator;
  readonly viewProductButtons: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsTitle: Locator;
  readonly addToCartButtons: Locator;
  readonly productImages: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h2.title.text-center');
    this.productsList = page.locator('.features_items');
    this.productCards = page.locator('.productinfo');
    this.viewProductButtons = page.locator('a[href*="/product_details/"]');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsTitle = page.locator('h2.title.text-center').filter({ hasText: 'Searched Products' });
    this.addToCartButtons = page.locator('a[data-product-id]');
    this.productImages = page.locator('.productinfo img');
    this.productNames = page.locator('.productinfo h2');
    this.productPrices = page.locator('.productinfo p');
  }

  async verifyAllProductsPageLoaded() {
    await expect(this.page).toHaveURL(/.*products/);
    await expect(this.pageTitle).toContainText('All Products');
    await expect(this.productsList).toBeVisible();
  }

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(/.*Products/);
  }

  async scrollToViewProducts() {
    await this.productsList.scrollIntoViewIfNeeded();
  }

  async verifyProductsDisplayed() {
    await expect(this.productCards.first()).toBeVisible();
    const productCount = await this.productCards.count();
    expect(productCount).toBeGreaterThan(0);
  }

  async verifyProductElements() {
    // Verify first product has all necessary elements
    const firstProduct = this.productCards.first();
    await expect(firstProduct.locator('h2')).toBeVisible(); // Product name
    await expect(firstProduct.locator('p')).toBeVisible(); // Product price
    await expect(firstProduct.locator('img')).toBeVisible(); // Product image
  }

  async clickViewProductForFirstItem() {
    await this.viewProductButtons.first().click();
  }

  async clickViewProductByIndex(index: number = 0) {
    await this.viewProductButtons.nth(index).click();
  }

  async searchForProduct(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Allow time for search results
  }

  async verifySearchResults(searchTerm: string) {
    await expect(this.searchedProductsTitle).toBeVisible();
    // Verify that products contain the search term
    const productTexts = await this.productCards.allTextContents();
    expect(productTexts.some(text => text.toLowerCase().includes(searchTerm.toLowerCase()))).toBeTruthy();
  }

  async addProductToCart(productIndex: number = 0) {
    await this.addToCartButtons.nth(productIndex).scrollIntoViewIfNeeded();
    await this.addToCartButtons.nth(productIndex).click({ force: true });
  }

  async hoverOverProduct(productIndex: number = 0) {
    await this.productCards.nth(productIndex).hover();
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.productPrices.allTextContents();
  }
}