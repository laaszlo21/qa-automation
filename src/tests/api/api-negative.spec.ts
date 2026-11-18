/**
 * @fileoverview Data-Driven Negative API Tests for User Authentication.
 * Validates the `/api/verifyLogin` endpoint against various malformed, missing,
 * and non-existent user credential payloads.
 */
import { test, expect } from '@playwright/test';

test.describe('Data-Driven Negative API Tests', () => {
  const invalidLogins = [
    { email: '', password: '', description: 'Empty email and password' },
    { email: 'nonexistent_user_999988@test.com', password: 'wrongpassword', description: 'Non-existent user' },
    { email: 'invalid-email-format-string', password: 'somepassword', description: 'Malformed email format' }
  ];

  for (const testCase of invalidLogins) {
    test(`Should fail verification for scenario: ${testCase.description}`, async ({ request }) => {
      const response = await request.post('https://automationexercise.com/api/verifyLogin', {
        form: {
          email: testCase.email,
          password: testCase.password
        }
      });

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.responseCode).not.toBe(200);
    });
  }
});