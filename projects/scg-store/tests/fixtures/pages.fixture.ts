import { test as base } from '@playwright/test';
import { savedSession } from '@shared/auth/session';
import { BasePage } from '../pages/base.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { credentials } from '../utils/test-data';

type Options = {
  /**
   * Start the test logged in as the test account: `test.use({ loggedIn: true })`.
   * Logs in once and reuses the saved session (shared/auth/session.ts), which also keeps the store's
   * location choice. Leave unset for tests of the login itself (SCG-001 logs in through the UI).
   */
  loggedIn: boolean;
};

type PageFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
};

/**
 * Page objects as fixtures, so specs ask for what they need instead of constructing it.
 * Every test also auto-confirms the first-visit "Choose your location" modal.
 */
export const test = base.extend<Options & PageFixtures & { locationModal: void }>({
  loggedIn: [false, { option: true }],

  storageState: async ({ loggedIn, storageState, browser, baseURL, viewport }, use, testInfo) => {
    if (!loggedIn) return use(storageState);
    const { email, password } = credentials();
    await use(
      await savedSession(browser, {
        project: 'scg-store',
        env: String(testInfo.project.metadata.env || ''),
        account: email,
        contextOptions: { baseURL, viewport },
        login: async (page) => {
          await BasePage.handleLocationModal(page);
          const loginPage = new LoginPage(page);
          await loginPage.goto();
          await loginPage.login(email, password);
        },
        isLoggedIn: async (page) => {
          await BasePage.handleLocationModal(page);
          const home = new LoginPage(page);
          await home.navigate('/');
          return home.loggedInIcon.isVisible();
        },
      }),
    );
  },

  locationModal: [
    async ({ page }, use) => {
      await BasePage.handleLocationModal(page);
      await use();
    },
    { auto: true },
  ],
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
