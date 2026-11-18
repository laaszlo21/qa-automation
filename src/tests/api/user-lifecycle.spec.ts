/**
 * @fileoverview End-to-End API Lifecycle Tests for User Account Management.
 * Executes a chained CRUD workflow (Create -> Read -> Verify -> Delete) using dynamically
 * generated Faker.js payloads, ensuring isolated and self-cleaning test execution.
 */
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Advanced User API Lifecycle & Workflow', () => {
  test('Should execute full API lifecycle: Create -> Get Details -> Verify Login -> Delete Account', async ({ request }) => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password({ length: 10 });

    // Step 1: Create a new user account via POST /api/createAccount
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

    // Step 2: Retrieve and validate user profile details via GET /api/getUserDetailByEmail
    const getDetailsResponse = await request.get('https://automationexercise.com/api/getUserDetailByEmail', {
      params: { email: email }
    });

    expect(getDetailsResponse.status()).toBe(200);
    const getDetailsBody = await getDetailsResponse.json();
    expect(getDetailsBody.responseCode).toBe(200);
    expect(getDetailsBody.user.email).toBe(email);
    expect(getDetailsBody.user.name).toBe(name);

    // Step 3: Verify user credentials via POST /api/verifyLogin
    const loginResponse = await request.post('https://automationexercise.com/api/verifyLogin', {
      form: {
        email: email,
        password: password
      }
    });

    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    expect(loginBody.responseCode).toBe(200);
    expect(loginBody.message).toBe('User exists!');

    // Step 4: Teardown / Cleanup - Delete the test account via DELETE /api/deleteAccount
    const deleteResponse = await request.delete('https://automationexercise.com/api/deleteAccount', {
      form: {
        email: email,
        password: password
      }
    });

    expect(deleteResponse.status()).toBe(200);
    const deleteBody = await deleteResponse.json();
    expect(deleteBody.responseCode).toBe(200);
    expect(deleteBody.message).toBe('Account deleted!');
  });
});