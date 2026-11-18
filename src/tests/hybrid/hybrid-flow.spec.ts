/**
 * @fileoverview Hybrid End-to-End Tests (API + UI Integration).
 * Demonstrates modern test optimization by provisioning test state via REST API,
 * executing critical user actions through the UI, and validating database persistence
 * via API assertions.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { faker } from '@faker-js/faker';

test.describe('Hybrid API + UI User Lifecycle Flow', () => {
  test('Should provision user via API, login & delete via UI, and verify deletion via API', async ({ request, page }) => {
    const loginPage = new LoginPage(page);

    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password({ length: 10 });

    // Step 1: Fast Test Data Provisioning via REST API (Bypassing slow UI registration)
    await test.step('Provision user account via POST /api/createAccount', async () => {
      const createResponse = await request.post('https://automationexercise.com/api/createAccount', {
        form: {
          name: name,
          email: email,
          password: password,
          title: 'Mr',
          birth_date: '15',
          birth_month: 'January',
          birth_year: '1990',
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          address1: faker.location.streetAddress(),
          country: 'United States',
          state: faker.location.state(),
          city: faker.location.city(),
          zipcode: faker.location.zipCode(),
          mobile_number: faker.phone.number()
        }
      });

      expect(createResponse.status()).toBe(200);
      const createBody = await createResponse.json();
      expect(createBody.responseCode).toBe(201);
      expect(createBody.message).toBe('User created!');
    });

    // Step 2: UI Authentication with API-created credentials
    await test.step('Log in via UI using API-provisioned credentials', async () => {
      await loginPage.navigateToLogin();
      await loginPage.login(email, password);
      await loginPage.expectLoggedIn(name);
    });

    // Step 3: UI Account Deletion
    await test.step('Delete user account via UI', async () => {
      await loginPage.deleteAccount();
      await loginPage.expectAccountDeleted();
    });

    // Step 4: Backend Persistence Verification via REST API
    await test.step('Verify account no longer exists via GET /api/getUserDetailByEmail', async () => {
      const getDetailsResponse = await request.get('https://automationexercise.com/api/getUserDetailByEmail', {
        params: { email: email }
      });

      expect(getDetailsResponse.status()).toBe(200);
      const getDetailsBody = await getDetailsResponse.json();
      expect(getDetailsBody.responseCode).toBe(404);
      expect(getDetailsBody.message).toBe('Account not found with this email, try another email!');
    });
  });
});