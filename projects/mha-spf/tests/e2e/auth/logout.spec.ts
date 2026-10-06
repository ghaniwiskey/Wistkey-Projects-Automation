import { test, expect } from '../../fixtures/pages.fixture';

// Test case: projects/mha-spf/cases/auth/SPF-003-*.md
test.describe('Logout', () => {
  test.use({ role: 'logs1' });

  test('SPF-003: log out ends access to protected pages @smoke', async ({ page, dashboardPage, loginPage, assetListingPage }) => {
    await test.step('1. Logout lands on the login page', async () => {
      await dashboardPage.logout();
      await expect(page).toHaveURL(/\/Account\/LoginBk/);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step('2. Asset Listing redirects to login', async () => {
      await assetListingPage.open();
      await expect(page).toHaveURL(/\/Account\/LoginBk\?ReturnUrl=%2FAsset%2FAsset/);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(assetListingPage.heading).toBeHidden();
    });
  });
});
