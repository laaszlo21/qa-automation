import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the User Registration flow (/login and /signup).
 * Handles initial signup initiation, detailed account creation forms,
 * GDPR consent overlays, and registration outcome assertions.
 */
export class SignupPage {
  private page: Page;

  // Initial signup form locators (/login)
  private nameInput = 'input[data-qa="signup-name"]';
  private emailInput = 'input[data-qa="signup-email"]';
  private signupButton = 'button[data-qa="signup-button"]';
  private signupErrorMsg = '.signup-form form p';

  // Detailed account information form locators (/signup)
  private titleMr = '#id_gender1';
  private passwordInput = '#password';
  private firstNameInput = '#first_name';
  private lastNameInput = '#last_name';
  private addressInput = '#address1';
  private stateInput = '#state';
  private cityInput = '#city';
  private zipcodeInput = '#zipcode';
  private mobileInput = '#mobile_number';
  private createAccountButton = 'button[data-qa="create-account"]';

  // Account creation confirmation locators
  private accountCreatedHeader = 'h2[data-qa="account-created"]';
  private continueButton = 'a[data-qa="continue-button"]';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the login/signup page and dismisses any GDPR/cookie consent overlay if present.
   */
  async navigateToSignup() {
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
   * Fills out the initial name and email fields to start the registration process.
   *
   * @param name - Display name for the new account
   * @param email - Unique email address for registration
   */
  async startSignup(name: string, email: string) {
    await this.page.fill(this.nameInput, name);
    await this.page.fill(this.emailInput, email);
    await this.page.click(this.signupButton);
  }

  /**
   * Completes the detailed account registration form and submits it.
   *
   * @param password - Account password
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @param address - Street address
   * @param state - State or province
   * @param city - City name
   * @param zipcode - Postal/ZIP code
   * @param mobile - Contact phone number
   */
  async fillAccountDetails(
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    state: string,
    city: string,
    zipcode: string,
    mobile: string
  ) {
    await this.page.click(this.titleMr);
    await this.page.fill(this.passwordInput, password);

    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.addressInput, address);
    await this.page.fill(this.stateInput, state);
    await this.page.fill(this.cityInput, city);
    await this.page.fill(this.zipcodeInput, zipcode);
    await this.page.fill(this.mobileInput, mobile);

    await this.page.click(this.createAccountButton);
  }

  /**
   * Asserts that the account creation confirmation header is visible.
   */
  async expectAccountCreated() {
    await expect(this.page.locator(this.accountCreatedHeader)).toBeVisible();
    await expect(this.page.locator(this.accountCreatedHeader)).toContainText('Account Created!');
  }

  /**
   * Asserts that a registration error message is displayed (e.g., email already exists).
   */
  async expectSignupError() {
    await expect(this.page.locator(this.signupErrorMsg)).toBeVisible();
  }
}