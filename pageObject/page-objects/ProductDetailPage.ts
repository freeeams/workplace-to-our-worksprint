import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly productInformation: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p').filter({ hasText: 'Category:' });
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p').filter({ hasText: 'Availability:' });
    this.productCondition = page.locator('.product-information p').filter({ hasText: 'Condition:' });
    this.productBrand = page.locator('.product-information p').filter({ hasText: 'Brand:' });
    this.productDescription = page.locator('.product-information p').first();
    this.productImage = page.locator('.product-details .view-product img, .product-details img').first();
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('.btn.btn-default.cart');
    this.productInformation = page.locator('.product-information');
  }

  async verifyProductDetailPageLoaded() {
    await expect(this.page).toHaveURL(/.*product_details/);
    await expect(this.productName).toBeVisible();
  }

  async verifyProductDetails() {
    // Verify all key elements are visible
    await expect(this.productName).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productAvailability).toBeVisible();
    await expect(this.productCondition).toBeVisible();
    await expect(this.productBrand).toBeVisible();
    await expect(this.productImage).toBeVisible();
  }

  async verifyProductInformationSection() {
    await expect(this.productInformation).toBeVisible();
  }

  async verifyProductNameNotEmpty() {
    const nameText = await this.productName.textContent();
    expect(nameText?.trim()).toBeTruthy();
  }

  async verifyPriceDisplayed() {
    await expect(this.productPrice).toBeVisible();
    const priceText = await this.productPrice.textContent();
    expect(priceText?.trim()).toBeTruthy();
  }

  async verifyQuantityInputAvailable() {
    await expect(this.quantityInput).toBeVisible();
  }

  async verifyAddToCartButtonPresent() {
    await expect(this.addToCartButton).toBeVisible();
  }

  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async setQuantity(quantity: string) {
    await this.quantityInput.fill(quantity);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async navigateBack() {
    await this.page.goBack();
  }
}