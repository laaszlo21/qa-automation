import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Products catalog page (/products).
 * Handles product search, adding items to the shopping cart via modal dialogs,
 * GDPR consent overlays, and search result assertions.
 */
export class ProductsPage {
  private page: Page;

  // Locators
  private searchInput = '#search_product';
  private searchButton = '#submit_search';
  private productsList = '.features_items';
  private productTitles = '.productinfo p';
  private firstProductCard = '.features_items .col-sm-4';
  private addToCartBtn = '.add-to-cart';
  private viewCartModalLink = 'u:has-text("View Cart")';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the products catalog page and dismisses any GDPR/cookie consent overlay if present.
   */
  async navigateToProducts() {
    await this.page.goto('/products');

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
   * Enters a search term into the search bar and submits the query.
   *
   * @param keyword - Product name or keyword to search for
   */
  async searchProduct(keyword: string) {
    await this.page.fill(this.searchInput, keyword);
    await this.page.click(this.searchButton);
  }

  /**
   * Hovers over the first product card, adds it to the cart,
   * and navigates to the cart via the confirmation modal.
   */
  async addProductAndClickViewCart() {
    const product = this.page.locator(this.firstProductCard).first();
    await product.hover();
    await product.locator(this.addToCartBtn).first().click();

    const viewCartLink = this.page.locator(this.viewCartModalLink);
    await expect(viewCartLink).toBeVisible({ timeout: 5000 });
    await viewCartLink.click();
  }

  /**
   * Asserts that the main products container is visible on the page.
   */
  async expectProductsToBeVisible() {
    await expect(this.page.locator(this.productsList)).toBeVisible();
  }

  /**
   * Verifies that search results are returned and at least one product title matches the keyword.
   *
   * @param keyword - Expected search keyword (case-insensitive)
   */
  async expectSearchResultsContain(keyword: string) {
    const titles = this.page.locator(this.productTitles);
    const count = await titles.count();

    expect(count).toBeGreaterThan(0);

    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text && text.toLowerCase().includes(keyword.toLowerCase())) {
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  }
}