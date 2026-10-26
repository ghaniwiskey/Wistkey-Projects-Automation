import { test as base } from '@playwright/test';
import { savedSession } from '@shared/auth/session';
import { CustomersPage } from '../pages/customers.page';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { OrdersPage } from '../pages/orders.page';
import { ProductsPage } from '../pages/products.page';
import { storeberryAdmin } from '../utils/test-data';

type Options = {
  loggedIn: boolean;
};

type PageFixtures = {
  customersPage: CustomersPage;
  homePage: HomePage;
  loginPage: LoginPage;
  ordersPage: OrdersPage;
  productsPage: ProductsPage;
};

/** Page objects are fixtures; authenticated suites reuse a staging/production-specific session. */
export const test = base.extend<Options & PageFixtures>({
  loggedIn: [false, { option: true }],

  storageState: async ({ loggedIn, storageState, browser, baseURL, viewport }, use, testInfo) => {
    if (!loggedIn) return use(storageState);
    const admin = storeberryAdmin();
    const session = await savedSession(browser, {
      project: 'storeberry-crm',
      env: String(testInfo.project.metadata.env || ''),
      account: admin.username,
      contextOptions: { baseURL, viewport },
      login: async (page) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(admin);
      },
      isLoggedIn: async (page) => new HomePage(page).isLoggedIn(),
    });
    await use(session);
  },

  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
});

export { expect } from '@playwright/test';
