/**
 * @fileoverview UI End-to-End Tests for the Shopping Cart Module.
 * Validates adding products from the catalog, interacting with confirmation modals,
 * and verifying cart item persistence on the cart overview page.
 */
import { test } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart Module Tests', () => {
  test('Should add a product to the cart via modal View Cart and verify it (Positive test)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Navigate to the products catalog page
    await productsPage.navigateToProducts();

    // Step 2: Add the first product to the cart and navigate via the confirmation modal
    await productsPage.addProductAndClickViewCart();

    // Step 3: Verify the cart page is rendered and contains the added item
    await cartPage.expectCartToBeNotEmpty();
    await cartPage.expectProductInCart();
  });
});