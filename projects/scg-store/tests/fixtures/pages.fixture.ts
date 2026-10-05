import { test as base } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';

type PageFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
};

/**
 * Page objects as fixtures, so specs ask for what they need instead of constructing it.
 * Every test also auto-confirms the first-visit "Choose your location" modal.
 */
export const test = base.extend<PageFixtures & { locationModal: void }>({
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
