import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';

type PageFixtures = {
  homePage: HomePage;
};

/**
 * Page objects as fixtures: specs ask for what they need instead of constructing it.
 *
 * Once the app has a login page object, add a session option so tests that only need a logged-in
 * user start logged in (log in once, reuse): copy the `loggedIn` option and `storageState` override
 * from projects/scg-store/tests/fixtures/pages.fixture.ts (helper: @shared/auth/session).
 */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from '@playwright/test';
