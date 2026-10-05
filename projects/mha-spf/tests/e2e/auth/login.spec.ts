import { test, expect, ACCOUNTS } from '../../fixtures/pages.fixture';
import { accountFor } from '../../utils/test-data';

// Test case: projects/mha-spf/cases/auth/SPF-001-*.md (the "SPF-001:" title prefix links results to it).
test.describe('Login', () => {
  test('SPF-001: log in with the passwordless test account @smoke', async ({ loginPage, dashboardPage }) => {
    const account = accountFor('agency-admin');

    await test.step('1. Base URL shows the ATS login page', async () => {
      await loginPage.goto();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.ssoButton).toBeVisible();
    });

    await test.step('2-3. Log in with the user name only', async () => {
      await loginPage.login(account.username);
    });

    await test.step('Dashboard with header and side menu', async () => {
      await dashboardPage.expectLoaded();
      await expect(dashboardPage.officerName(ACCOUNTS[0].officer)).toBeVisible();
      await expect(dashboardPage.lastLogin).toBeVisible();
      await expect(dashboardPage.currentRole).toHaveText(/\S/);
      for (const item of ['Dashboard', 'Asset', 'Stocktake', 'Report', 'Settings', 'User']) {
        await expect(dashboardPage.menuItem(item), `side menu shows ${item}`).toBeVisible();
      }
    });
  });
});
