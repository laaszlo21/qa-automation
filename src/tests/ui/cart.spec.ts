/**
 * @fileoverview UI End-to-End Tests for the Shopping Cart Module.
 * Validates adding products from the catalog, interacting with confirmation modals,
 * verifying cart item persistence, and item removal / empty cart handling.
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

  test('Should remove product from cart and verify empty cart state (Positive test)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Navigate, add product to cart, and go to cart view
    await productsPage.navigateToProducts();
    await productsPage.addProductAndClickViewCart();
    await cartPage.expectCartToBeNotEmpty();

    // Step 2: Remove the product from the cart using the delete button
    await cartPage.removeFirstProductFromCart();

    // Step 3: Verify that the cart is now empty
    await cartPage.expectCartToBeEmpty();
  });
});