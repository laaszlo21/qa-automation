/**
 * @fileoverview UI End-to-End Tests for the Contact Us Form Module.
 * Validates form submission using dynamically generated Faker.js data,
 * in-memory file uploads, native browser confirm dialog handling,
 * and network-level ad blocking for test stability.
 */
import { test } from '@playwright/test';
import { ContactUsPage } from '../../pages/ContactUsPage';
import { faker } from '@faker-js/faker';

test.describe('Contact Us Form Tests', () => {
  test('Should submit contact form with file attachment and handle native alert dialog (Positive test)', async ({ page }) => {
    // Block third-party ad networks to prevent overlay interference and stabilize execution
    await page.route('**/*googlesyndication.com*', route => route.abort());
    await page.route('**/*googleads*', route => route.abort());
    await page.route('**/adsbygoogle.js', route => route.abort());

    const contactUsPage = new ContactUsPage(page);

    // Step 1: Navigate to the Contact Us page
    await contactUsPage.navigateToContactUs();

    // Step 2: Populate the contact form with dynamic Faker data and attach an in-memory file
    await contactUsPage.fillContactForm(
      faker.person.fullName(),
      faker.internet.email(),
      'Automated QA Inquiry - ' + faker.lorem.words(3),
      faker.lorem.paragraph(),
      'qa-test-attachment.txt'
    );

    // Step 3: Submit the form and accept the native browser confirmation dialog
    await contactUsPage.submitFormAndAcceptDialog();

    // Step 4: Assert that the submission success message is displayed
    await contactUsPage.expectSubmissionSuccess();
  });
});