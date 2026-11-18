/**
 * @fileoverview End-to-End Shopping and Checkout Journey Tests.
 * Validates the complete critical user path: dynamic account registration,
 * product search, cart management, checkout review, simulated payment processing,
 * and final order confirmation, protected by network-level ad blocking.
 */
import { test } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

test.describe('End-to-End Shopping & Checkout Flow', () => {
  test('Should complete the full user journey: Register -> Search -> Add to Cart -> Checkout -> Payment -> Success', async ({ page }) => {
    // Block third-party ad networks (Google AdSense / Vignette) to prevent overlay interference
    await page.route('**/*googlesyndication.com*', route => route.abort());
    await page.route('**/*googleads*', route => route.abort());
    await page.route('**/adsbygoogle.js', route => route.abort());

    const signupPage = new SignupPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Register a new user account with dynamically generated Faker data
    const randomName = faker.person.fullName();
    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password({ length: 10 });

    await signupPage.navigateToSignup();
    await signupPage.startSignup(randomName, randomEmail);
    await signupPage.fillAccountDetails(
      randomPassword,
      faker.person.firstName(),
      faker.person.lastName(),
      faker.location.streetAddress(),
      faker.location.state(),
      faker.location.city(),
      faker.location.zipCode(),
      faker.phone.number()
    );
    await signupPage.expectAccountCreated();

    // Step 2: Navigate to the catalog, search for a product, and add it to the cart
    await productsPage.navigateToProducts();
    await productsPage.searchProduct('Tshirt');
    await productsPage.addProductAndClickViewCart();

    // Step 3: Verify cart contents and proceed to the checkout flow
    await cartPage.expectCartToBeNotEmpty();
    await cartPage.proceedToCheckout();

    // Step 4: Review order details and place the order
    await checkoutPage.clickPlaceOrder();

    // Step 5: Submit simulated credit card payment details
    await checkoutPage.fillPaymentDetails(
      faker.person.fullName(),
      faker.finance.creditCardNumber('####-####-####-####'),
      faker.finance.creditCardCVV(),
      '12',
      '2028'
    );

    // Step 6: Validate the final order confirmation message
    await checkoutPage.expectOrderSuccess();
  });
});