import { Page, expect } from '@playwright/test';

/**
 * @fileoverview Page Object Model for Newsletter Subscription functionality.
 * Encapsulates footer scrolling, subscription input interaction, success assertions,
 * and GDPR cookie consent handling.
 */
export class SubscriptionPage {
  private page: Page;

  // Locators
  private emailInput = '#susbscribe_email';
  private subscribeButton = '#subscribe';
  private successAlert = '#success-subscribe';
  private subscriptionHeading = 'h2:has-text("Subscription")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the home page and dismisses any GDPR/cookie consent overlay if present.
   */
  async navigateToHome() {
    await this.page.goto('/');

    try {
      for (const frame of this.page.frames()) {
        const consentBtn = frame.locator('button:has-text("Consent"), .fc-button.fc-cta-consent').first();
        if (await consentBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await consentBtn.click();
          break;
        }
      }
    } catch (e) {}
  }

  /**
   * Scrolls down to the footer area of the page.
   */
  async scrollToFooter() {
    await this.page.locator(this.subscriptionHeading).scrollIntoViewIfNeeded();
  }

  /**
   * Asserts that the 'SUBSCRIPTION' header is visible in the footer.
   */
  async expectSubscriptionHeaderVisible() {
    await expect(this.page.locator(this.subscriptionHeading)).toBeVisible();
  }

  /**
   * Enters the email address into the subscription input and clicks the submit button.
   * 
   * @param email - Email address to subscribe with
   */
  async subscribe(email: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.click(this.subscribeButton);
  }

  /**
   * Asserts that the success message appears after subscription.
   */
  async expectSuccessMessageVisible() {
    const alert = this.page.locator(this.successAlert);
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('You have been successfully subscribed!');
  }
}