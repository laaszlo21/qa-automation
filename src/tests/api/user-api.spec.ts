/**
 * @fileoverview API Contract and HTTP Method Validation Tests for the Products Endpoint.
 * Verifies valid GET retrieval of the product catalog as well as negative method-enforcement
 * checks (HTTP 405 Method Not Allowed) on `/api/productsList`.
 */
import { test, expect } from '@playwright/test';

test.describe('Automation Exercise API Tests', () => {
  test('GET All Products list should return status 200', async ({ request }) => {
    const response = await request.get('https://automationexercise.com/api/productsList');
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.products.length).toBeGreaterThan(0);
  });

  test('POST To All Products list should not be allowed (Negative test)', async ({ request }) => {
    const response = await request.post('https://automationexercise.com/api/productsList');

    const responseBody = await response.json();
    expect(responseBody.responseCode).toBe(405);
    expect(responseBody.message).toContain('This request method is not supported');
  });
});