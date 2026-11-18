import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Contact Us page (/contact_us).
 * Handles form interactions, in-memory file attachments, native browser confirm dialogs,
 * and dynamic GDPR/cookie consent overlays.
 */
export class ContactUsPage {
  private page: Page;

  // Locators
  private nameInput = 'input[data-qa="name"]';
  private emailInput = 'input[data-qa="email"]';
  private subjectInput = 'input[data-qa="subject"]';
  private messageInput = 'textarea[data-qa="message"]';
  private uploadFileInput = 'input[name="upload_file"]';
  private submitButton = 'input[data-qa="submit-button"]';
  private successAlert = '.status.alert.alert-success';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the Contact Us page and dismisses any GDPR/cookie consent iframe if present.
   */
  async navigateToContactUs() {
    await this.page.goto('/contact_us');

    try {
      for (const frame of this.page.frames()) {
        const consentBtn = frame.locator('button:has-text("Consent"), .fc-button.fc-cta-consent').first();
        if (await consentBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await consentBtn.click();
          break;
        }
      }
    } catch (e) {}
  }

  /**
   * Fills out the contact form and attaches a dynamically generated in-memory file
   * to keep the repository clean of static test assets.
   *
   * @param name - Sender's full name
   * @param email - Sender's email address
   * @param subject - Inquiry subject line
   * @param message - Detailed message body
   * @param fileName - Name of the virtual file to attach
   */
  async fillContactForm(name: string, email: string, subject: string, message: string, fileName: string) {
    await this.page.fill(this.nameInput, name);
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.subjectInput, subject);
    await this.page.fill(this.messageInput, message);

    await this.page.setInputFiles(this.uploadFileInput, {
      name: fileName,
      mimeType: 'text/plain',
      buffer: Buffer.from('Automated QA test attachment content.', 'utf-8'),
    });
  }

  /**
   * Registers a one-time listener to accept the native browser confirm dialog
   * and submits the contact form.
   */
  async submitFormAndAcceptDialog() {
    // Listener must be registered before triggering the action that opens the dialog
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.page.click(this.submitButton);
  }

  /**
   * Asserts that the form submission success banner is displayed with the expected text.
   */
  async expectSubmissionSuccess() {
    const alert = this.page.locator(this.successAlert);
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Success! Your details have been submitted successfully.');
  }
}