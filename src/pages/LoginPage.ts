import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Login / Authentication page (/login).
 * Handles user login attempts, GDPR/cookie consent overlays,
 * and authentication state assertions (both positive and negative).
 */
export class LoginPage {
  private page: Page;

  // Locators
  private loginEmailInput = 'input[data-qa="login-email"]';
  private loginPasswordInput = 'input[data-qa="login-password"]';
  private loginButton = 'button[data-qa="login-button"]';
  private incorrectLoginError = '.login-form form p';
  private loggedInUserText = 'a:has-text("Logged in as")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the login page and dismisses any GDPR/cookie consent overlay
   * across main frame and iframes if present.
   */
  async navigateToLogin() {
    await this.page.goto('/login');

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
   * Submits user credentials to log into the application.
   *
   * @param email - Registered user email address
   * @param pass - User account password
   */
  async login(email: string, pass: string) {
    await this.page.fill(this.loginEmailInput, email);
    await this.page.fill(this.loginPasswordInput, pass);
    await this.page.click(this.loginButton);
  }

  /**
   * Asserts that an authentication error message is visible for invalid credentials.
   */
  async expectLoginError() {
    await expect(this.page.locator(this.incorrectLoginError)).toBeVisible();
  }

  /**
   * Asserts that the user is logged in and the header displays the expected username.
   *
   * @param username - Expected display name shown in the navigation bar
   */
  async expectLoggedIn(username: string) {
    const userElement = this.page.locator(this.loggedInUserText);
    await expect(userElement).toBeVisible();
    await expect(userElement).toContainText(username);
  }

  /**
   * Navigates to the account deletion page by clicking the delete account link in the header.
   */
  async deleteAccount() {
    await this.page.locator('a[href="/delete_account"]').click();
  }

  /**
   * Asserts that the account has been successfully deleted and the confirmation message is displayed.
   */
  async expectAccountDeleted() {
    const deleteHeader = this.page.locator('h2[data-qa="account-deleted"]');
    await expect(deleteHeader).toBeVisible();
    await expect(deleteHeader).toHaveText('Account Deleted!');
  }
}