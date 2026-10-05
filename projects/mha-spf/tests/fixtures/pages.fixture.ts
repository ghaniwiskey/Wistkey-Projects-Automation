import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ACCOUNTS, ROLES, RoleSlug, accountFor } from '../utils/test-data';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  /** Log in with an account that holds the role and make it the active role (replaces flows/login.md). */
  loginAs: (role: RoleSlug) => Promise<DashboardPage>;
};

/** Page objects as fixtures: specs ask for what they need instead of constructing it. */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  loginAs: async ({ loginPage, dashboardPage }, use) => {
    await use(async (role) => {
      const account = accountFor(role);
      await loginPage.goto();
      await loginPage.login(account.username, account.password);
      await dashboardPage.expectLoaded();
      await dashboardPage.switchRole(ROLES[role]);
      return dashboardPage;
    });
  },
});

export { expect } from '@playwright/test';
export { ACCOUNTS, ROLES };
