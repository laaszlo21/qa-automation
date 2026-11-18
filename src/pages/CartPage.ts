import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Shopping Cart page (/view_cart).
 * Encapsulates cart item verification, GDPR consent handling,
 * and navigation to the checkout flow.
 */
export class CartPage {
  private page: Page;

  // Locators
  private cartTable = '#cart_info_table';
  private cartRows = '#cart_info_table tbody tr';
  private proceedToCheckoutBtn = '.check_out';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates directly to the shopping cart page and dismisses
   * any GDPR/cookie consent overlay if present.
   */
  async navigateToCart() {
    await this.page.goto('/view_cart');

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
   * Asserts that the cart table is visible and contains at least one item.
   */
  async expectCartToBeNotEmpty() {
    await expect(this.page.locator(this.cartTable)).toBeVisible();
    const rowsCount = await this.page.locator(this.cartRows).count();
    expect(rowsCount).toBeGreaterThan(0);
  }

  /**
   * Verifies that at least one product row is rendered in the cart.
   */
  async expectProductInCart() {
    const rows = this.page.locator(this.cartRows);
    await expect(rows.first()).toBeVisible();
  }

  /**
   * Proceeds from the shopping cart to the checkout page.
   */
  async proceedToCheckout() {
    await this.page.click(this.proceedToCheckoutBtn);
  }
}