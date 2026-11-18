/**
 * @fileoverview UI End-to-End Tests for Newsletter Subscription Module.
 * Validates Test Case 10 (Home page subscription) and Test Case 11 (Cart page subscription)
 * with robust GDPR/cookie consent handling[cite: 4].
 */
import { test } from '@playwright/test';
import { SubscriptionPage } from '../../pages/SubscriptionPage';
import { CartPage } from '../../pages/CartPage';
import { faker } from '@faker-js/faker';

test.describe('Newsletter Subscription Tests', () => {
  test('Test Case 10: Should verify subscription successfully in home page', async ({ page }) => {
    const subscriptionPage = new SubscriptionPage(page);
    const testEmail = faker.internet.email();

    // Step 1 & 2: Navigate to home page and dismiss GDPR overlay
    await subscriptionPage.navigateToHome();

    // Step 3, 4 & 5: Scroll to footer and verify 'SUBSCRIPTION' text[cite: 4]
    await subscriptionPage.scrollToFooter();
    await subscriptionPage.expectSubscriptionHeaderVisible();

    // Step 6 & 7: Enter email, click arrow button, and verify success message[cite: 4]
    await subscriptionPage.subscribe(testEmail);
    await subscriptionPage.expectSuccessMessageVisible();
  });

  test('Test Case 11: Should verify subscription successfully in Cart page', async ({ page }) => {
    const subscriptionPage = new SubscriptionPage(page);
    const cartPage = new CartPage(page);
    const testEmail = faker.internet.email();

    // Step 1, 2 & 3: Navigate to home page with cookie handling
    await subscriptionPage.navigateToHome();

    // Step 4: Click 'Cart' button (CartPage handles its own GDPR if needed, or uses current session)
    await cartPage.navigateToCart();

    // Step 5 & 6: Scroll down to footer and verify 'SUBSCRIPTION' text[cite: 4]
    await subscriptionPage.scrollToFooter();
    await subscriptionPage.expectSubscriptionHeaderVisible();

    // Step 7 & 8: Enter email, click arrow button, and verify success message[cite: 4]
    await subscriptionPage.subscribe(testEmail);
    await subscriptionPage.expectSuccessMessageVisible();
  });
});