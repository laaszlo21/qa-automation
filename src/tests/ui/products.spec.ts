/**
 * @fileoverview UI End-to-End Tests for the Product Catalog and Search Module.
 * Validates that the main product listing renders properly and verifies
 * keyword-based product search accuracy across returned catalog items.
 */
import { test } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Product Catalog & Search Tests', () => {
  test('Should display product catalog successfully (Positive test)', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.navigateToProducts();
    await productsPage.expectProductsToBeVisible();
  });

  test('Should search for a product by keyword successfully (Positive test)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const searchKeyword = 'Tshirt';

    await productsPage.navigateToProducts();
    await productsPage.searchProduct(searchKeyword);

    // Assert that the filtered results match the search query
    await productsPage.expectSearchResultsContain(searchKeyword);
  });
});