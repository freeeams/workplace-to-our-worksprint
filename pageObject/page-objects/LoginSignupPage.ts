import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginSignupPage extends BasePage {
  readonly loginHeading: Locator;
  readonly signupHeading: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginSignupLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAsText: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.loginHeading = page.locator('.login-form h2:has-text("Login to your account")');
    this.signupHeading = page.locator('.signup-form h2:has-text("New User Signup!")');
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.loginSignupLink = page.locator('a:has-text("Signup / Login")').first();
    this.logoutLink = page.locator('a:has-text("Logout")');
    this.deleteAccountLink = page.locator('a:has-text("Delete Account")');
    this.loggedInAsText = page.locator('a:has-text("Logged in as")');
    this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
    this.signupErrorMessage = page.locator('p:has-text("Email Address already exist!")');
  }

  async navigateToLoginSignup() {
    await this.loginSignupLink.click();
    await this.page.waitForURL('**/login', { timeout: 10000 });
  }

  async verifyLoginSignupPage() {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.signupHeading).toBeVisible();
    await expect(this.page).toHaveURL(/login/);
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async signup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async verifyLoginSuccess(username: string) {
    await expect(this.loggedInAsText).toBeVisible();
    await expect(this.loggedInAsText).toContainText(username);
  }

  async verifyLoginError() {
    await expect(this.loginErrorMessage).toBeVisible();
  }

  async verifySignupError() {
    await expect(this.signupErrorMessage).toBeVisible();
  }

  async logout() {
    await this.logoutLink.click();
    await this.page.waitForURL('**/login', { timeout: 10000 });
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
    await this.page.waitForURL('**/delete_account', { timeout: 10000 });
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await expect(this.loggedInAsText).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async loginIfNotLoggedIn(email: string, password: string) {
    const isLoggedIn = await this.isLoggedIn();
    if (!isLoggedIn) {
      await this.navigateToLoginSignup();
      await this.login(email, password);
    }
  }
}