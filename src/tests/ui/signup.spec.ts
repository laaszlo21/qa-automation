/**
 * @fileoverview UI End-to-End Tests for User Registration.
 * Validates both negative duplicate-email rejection (using dynamically provisioned
 * accounts to avoid hardcoded state dependencies) and positive full registration flows
 * powered by Faker.js.
 */
import { test } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';
import { faker } from '@faker-js/faker';

test.describe('User Registration Tests', () => {
  test('Should not allow registration with an already existing email (Negative test)', async ({ page }) => {
    const signupPage = new SignupPage(page);

    // Step 1: Generate dynamic credentials for a new user
    const existingName = faker.person.fullName();
    const existingEmail = faker.internet.email();
    const password = faker.internet.password({ length: 10 });

    // Step 2: Register the user so the email is guaranteed to exist in the system
    await signupPage.navigateToSignup();
    await signupPage.startSignup(existingName, existingEmail);
    await signupPage.fillAccountDetails(
      password,
      faker.person.firstName(),
      faker.person.lastName(),
      faker.location.streetAddress(),
      faker.location.state(),
      faker.location.city(),
      faker.location.zipCode(),
      faker.phone.number()
    );
    await signupPage.expectAccountCreated();

    // Step 3: Log out and attempt to register a second account using the same email address
    await page.goto('/logout');
    await signupPage.navigateToSignup();
    await signupPage.startSignup('Another Name', existingEmail);

    // Step 4: Verify that the duplicate email error message is displayed
    await signupPage.expectSignupError();
  });

  test('Should register a new user successfully with dynamic data (Positive test)', async ({ page }) => {
    const signupPage = new SignupPage(page);

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
  });
});