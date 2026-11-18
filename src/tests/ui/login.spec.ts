/**
 * @fileoverview UI End-to-End Tests for User Authentication.
 * Validates both negative login handling (invalid credentials error messaging)
 * and positive end-to-end login flows using dynamically provisioned Faker.js accounts
 * to ensure test isolation and zero dependency on static pre-existing users.
 */
import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { faker } from '@faker-js/faker';

test.describe('Authentication / Login Tests', () => {
  test('Should show error with invalid credentials (Negative test)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLogin();
    await loginPage.login('invalid.user@test.com', 'WrongPassword123');
    await loginPage.expectLoginError();
  });

  test('Should login successfully with valid credentials (Positive test)', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const loginPage = new LoginPage(page);

    // Step 1: Provision a fresh, unique user account to ensure test independence
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

    // Step 2: Log out of the newly created session
    await page.goto('/logout');

    // Step 3: Authenticate with the newly registered credentials
    await loginPage.navigateToLogin();
    await loginPage.login(randomEmail, randomPassword);

    // Step 4: Verify that the user is successfully logged in
    await loginPage.expectLoggedIn(randomName);
  });
});