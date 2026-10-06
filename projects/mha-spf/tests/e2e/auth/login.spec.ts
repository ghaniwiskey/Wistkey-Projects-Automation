import { test, expect, testAccount } from '../../fixtures/pages.fixture';

// Test case: projects/mha-spf/cases/auth/SPF-001-*.md (the "SPF-001:" title prefix links results to it).
test.describe('Login', () => {
  test('SPF-001: log in with the test account from .env @smoke', async ({ loginPage, dashboardPage }) => {
    const account = testAccount(); // SPF_USER / SPF_PASS from .env

    await test.step('1. Base URL shows the ATS login page', async () => {
      await loginPage.goto();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.ssoButton).toBeVisible();
    });

    await test.step('2-3. Log in with the account from .env (empty SPF_PASS = passwordless)', async () => {
      await loginPage.login(account.username, account.password);
    });

    await test.step('Dashboard with header and side menu', async () => {
      await dashboardPage.expectLoaded();
      expect(await dashboardPage.currentOfficer(), 'the header shows the officer name').toMatch(/\S/);
      await expect(dashboardPage.lastLogin).toBeVisible();
      await expect(dashboardPage.currentRole).toHaveText(/\S/);
      for (const item of ['Dashboard', 'Asset', 'Stocktake', 'Report', 'Settings', 'User']) {
        await expect(dashboardPage.menuItem(item), `side menu shows ${item}`).toBeVisible();
      }
    });
  });
});
