import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productQuantities: Locator;
  readonly totalPrices: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#cart_items .cart_info tr');
    this.productNames = page.locator('.cart_description h4 a');
    this.productPrices = page.locator('.cart_price p');
    this.productQuantities = page.locator('.cart_quantity .disabled');
    this.totalPrices = page.locator('.cart_total_price');
    this.checkoutButton = page.locator('.btn.btn-default.check_out');
    this.continueShoppingButton = page.locator('.btn.btn-success');
    this.removeButtons = page.locator('.cart_quantity_delete');
    this.emptyCartMessage = page.locator('#empty_cart, .empty-cart');
  }

  async verifyCartPageLoaded() {
    await expect(this.page).toHaveURL(/.*view_cart/);
  }

  async verifyProductsInCart(expectedProducts: string[]) {
    const productNames = await this.productNames.allTextContents();
    
    for (const expectedProduct of expectedProducts) {
      expect(productNames.some(name => 
        name.toLowerCase().includes(expectedProduct.toLowerCase())
      )).toBeTruthy();
    }
  }

  async verifyCartItemsCount(expectedCount: number) {
    const actualCount = await this.cartItems.count();
    expect(actualCount).toBeGreaterThanOrEqual(expectedCount);
  }

  async verifyCartNotEmpty() {
    const itemCount = await this.cartItems.count();
    expect(itemCount).toBeGreaterThan(1); // Greater than 1 because of header row
  }

  async verifyCartEmpty() {
    // Check if cart is empty by looking for empty message or no items
    try {
      await expect(this.emptyCartMessage).toBeVisible({ timeout: 5000 });
    } catch {
      // If no empty message, check if only header row exists
      const itemCount = await this.cartItems.count();
      expect(itemCount).toBeLessThanOrEqual(1);
    }
  }

  async getProductQuantities(): Promise<string[]> {
    return await this.productQuantities.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.productPrices.allTextContents();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async removeProductFromCart(index: number = 0) {
    await this.removeButtons.nth(index).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getTotalPrice(): Promise<string> {
    return await this.totalPrices.first().textContent() || '';
  }

  async clearCart() {
    const removeButtonCount = await this.removeButtons.count();
    for (let i = removeButtonCount - 1; i >= 0; i--) {
      await this.removeButtons.nth(i).click();
      await this.page.waitForTimeout(500); // Wait for removal to complete
    }
  }
}