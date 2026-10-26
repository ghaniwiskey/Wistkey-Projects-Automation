import { test } from '../../fixtures/pages.fixture';
import { storeberryAdmin } from '../../utils/test-data';

// Login assertions contain no password values; disable traces/screenshots to prevent credentials from entering artifacts.
test.use({ trace: 'off', screenshot: 'off' });

test.describe('Storeberry CRM authentication', () => {
  test('SCRM-001: CRM login page loads with sign-in controls @smoke', async ({ loginPage }) => {
    await test.step('1. Open the staging CRM sign-in page', async () => {
      await loginPage.goto();
    });
    await test.step('2. Verify the company, username, password, and LOGIN controls', async () => {
      await loginPage.expectLoginForm();
    });
  });

  test('SCRM-005: store admin signs in to Storeberry Flower CRM @smoke', async ({ loginPage, homePage }) => {
    const admin = storeberryAdmin();
    await test.step('1. Sign in with the staging Storeberry Flower test account', async () => {
      await loginPage.goto();
      await loginPage.login(admin);
    });
    await test.step('2. Confirm the CRM workspace is available', async () => {
      await homePage.expectLoaded();
    });
  });
});
