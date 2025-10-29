import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactUsPage extends BasePage {
  readonly getInTouchText: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly uploadFileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;
  readonly contactUsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.getInTouchText = page.locator('.contact-form h2.title:has-text("Get In Touch")');
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.subjectInput = page.locator('input[name="subject"]');
    this.messageTextarea = page.locator('textarea[name="message"]');
    this.uploadFileInput = page.locator('input[type="file"]');
    this.submitButton = page.locator('input[type="submit"], button[type="submit"]');
    this.successMessage = page.locator('.status.alert.alert-success');
    this.homeButton = page.locator('a:has-text("Home"), .btn:has-text("Home")');
    this.contactUsLink = page.locator('a:has-text("Contact us")').first();
  }

  async navigateToContactUs() {
    await this.contactUsLink.click();
    await this.page.waitForURL('**/contact_us', { timeout: 10000 });
  }

  async verifyContactUsPage() {
    await expect(this.getInTouchText).toBeVisible();
    await expect(this.page).toHaveURL(/contact_us/);
  }

  async fillContactForm(
    name: string,
    email: string,
    subject: string,
    message: string,
    filePath?: string
  ) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageTextarea.fill(message);
    
    if (filePath) {
      await this.uploadFileInput.setInputFiles(filePath);
    }
  }

  async submitForm() {
    await this.submitButton.click();
    
    // Handle potential alert dialog
    this.page.on('dialog', async dialog => {
      if (dialog.type() === 'alert') {
        await dialog.accept();
      }
    });
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText(/success/i);
  }

  async clickHomeButton() {
    await this.homeButton.click();
    await expect(this.page).toHaveURL(/^\//);
  }

  async fillAndSubmitContactForm(
    contactData: {
      name: string;
      email: string;
      subject: string;
      message: string;
      filePath?: string;
    }
  ) {
    await this.fillContactForm(
      contactData.name,
      contactData.email,
      contactData.subject,
      contactData.message,
      contactData.filePath
    );
    await this.submitForm();
  }
}