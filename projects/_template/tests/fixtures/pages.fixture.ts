import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';

type PageFixtures = {
  homePage: HomePage;
};

/** Page objects as fixtures: specs ask for what they need instead of constructing it. */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from '@playwright/test';
