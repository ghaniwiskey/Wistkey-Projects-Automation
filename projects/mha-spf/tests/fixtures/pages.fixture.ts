import { test as base } from '@playwright/test';
import { forgetSession, resaveSession, savedSession } from '@shared/auth/session';
import { SessionEndedError } from '../pages/base.page';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { AssetListingPage } from '../pages/asset-listing.page';
import { AssetDetailsPage } from '../pages/asset-details.page';
import { AssignmentPage } from '../pages/assignment.page';
import { AssignmentCreatePage } from '../pages/assignment-create.page';
import { ACCOUNTS, ROLES, RoleSlug, accountFor } from '../utils/test-data';

type Options = {
  /**
   * Start the test logged in with this role active: `test.use({ role: 'logs1' })`.
   * Logs in once per account and reuses the saved session (shared/auth/session.ts); the role is
   * switched on the dashboard before the test body runs. Leave unset for tests of the login itself.
   */
  role: RoleSlug | undefined;
};

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  assetListingPage: AssetListingPage;
  assetDetailsPage: AssetDetailsPage;
  assignmentPage: AssignmentPage;
  assignmentCreatePage: AssignmentCreatePage;
  /** Log in through the UI with an account that holds the role and make it active. Prefer `test.use({ role })`. */
  loginAs: (role: RoleSlug) => Promise<DashboardPage>;
  /** Internal: puts a test that set `role` on the dashboard with that role active. */
  activeRole: void;
};

/** Page objects as fixtures: specs ask for what they need instead of constructing it. */
export const test = base.extend<Options & PageFixtures>({
  role: [undefined, { option: true }],

  storageState: async ({ role, storageState, browser, baseURL, viewport }, use, testInfo) => {
    if (!role) return use(storageState);
    const account = accountFor(role);
    await use(
      await savedSession(browser, {
        project: 'mha-spf',
        env: String(testInfo.project.metadata.env || ''),
        account: account.username,
        contextOptions: { baseURL, viewport },
        login: async (page) => {
          const loginPage = new LoginPage(page);
          await loginPage.goto();
          await loginPage.login(account.username, account.password);
          await new DashboardPage(page).expectLoaded();
        },
        isLoggedIn: async (page) => {
          await page.goto('IndexBk');
          return /\/IndexBk/.test(page.url()) && (await new DashboardPage(page).heading.isVisible());
        },
      }),
    );
  },

  activeRole: [
    async ({ role, page }, use, testInfo) => {
      if (role) {
        const dashboard = new DashboardPage(page);
        const label = ROLES[role];
        try {
          await dashboard.goto();
          await dashboard.switchRole(label);
        } catch (e) {
          // ATS allows one session per account, so a newer login (SPF-001, a person, Aside) ends the
          // saved one. Log in again on this page, save the new session for later tests, and continue.
          if (!(e instanceof SessionEndedError) && !dashboard.isLoginUrl()) throw e;
          const account = accountFor(role);
          const loginPage = new LoginPage(page);
          await loginPage.goto();
          await loginPage.login(account.username, account.password);
          await dashboard.expectLoaded();
          await resaveSession(page, 'mha-spf', String(testInfo.project.metadata.env || ''), account.username);
          await dashboard.switchRole(label);
        }
      }
      await use();
    },
    { auto: true },
  ],

  loginPage: async ({ page }, use, testInfo) => {
    await use(new LoginPage(page));
    // A test that logs in or out through the UI ends the saved session (one session per account).
    // The dead session still loads pages and only fails on the next server action, so drop it now
    // and let the next test log in again.
    const env = String(testInfo.project.metadata.env || '');
    for (const a of ACCOUNTS) if (process.env[a.envUser]) forgetSession('mha-spf', env, process.env[a.envUser] as string);
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  assetListingPage: async ({ page }, use) => {
    await use(new AssetListingPage(page));
  },
  assetDetailsPage: async ({ page }, use) => {
    await use(new AssetDetailsPage(page));
  },
  assignmentPage: async ({ page }, use) => {
    await use(new AssignmentPage(page));
  },
  assignmentCreatePage: async ({ page }, use) => {
    await use(new AssignmentCreatePage(page));
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
export { ASSETS } from '../utils/test-data';
