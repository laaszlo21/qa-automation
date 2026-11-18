import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Checkout and Payment flow (/checkout and /payment).
 * Handles order placement, payment form submission, and order confirmation assertions.
 */
export class CheckoutPage {
  private page: Page;

  // Checkout page locators
  private placeOrderButton = 'a:has-text("Place Order")';

  // Payment page locators
  private nameOnCardInput = 'input[data-qa="name-on-card"]';
  private cardNumberInput = 'input[data-qa="card-number"]';
  private cvcInput = 'input[data-qa="cvc"]';
  private expiryMonthInput = 'input[data-qa="expiry-month"]';
  private expiryYearInput = 'input[data-qa="expiry-year"]';
  private payButton = 'button[data-qa="pay-button"]';

  // Order confirmation locators
  private successOrderMessage = 'h2[data-qa="order-placed"]';

  constructor(page: Page) {
    this.page = page;
  }

/**
   * Clicks the 'Place Order' button and waits for navigation to the payment page.
   */
  async clickPlaceOrder() {
    await this.page.click(this.placeOrderButton);
    await this.page.waitForURL('**/payment', { timeout: 15000 });
  }

  /**
   * Fills out the credit card payment details and submits the payment form.
   *
   * @param name - Cardholder's full name
   * @param cardNumber - Credit card number
   * @param cvc - 3-digit security code
   * @param month - Expiration month (MM)
   * @param year - Expiration year (YYYY)
   */
  async fillPaymentDetails(name: string, cardNumber: string, cvc: string, month: string, year: string) {
    await this.page.fill(this.nameOnCardInput, name);
    await this.page.fill(this.cardNumberInput, cardNumber);
    await this.page.fill(this.cvcInput, cvc);
    await this.page.fill(this.expiryMonthInput, month);
    await this.page.fill(this.expiryYearInput, year);
    await this.page.click(this.payButton);
  }

  /**
   * Asserts that the order placement confirmation message is visible.
   */
  async expectOrderSuccess() {
    await expect(this.page.locator(this.successOrderMessage)).toBeVisible();
    await expect(this.page.locator(this.successOrderMessage)).toContainText('Order Placed!');
  }
}