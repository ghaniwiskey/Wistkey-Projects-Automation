import { test as base, expect } from '@mobilewright/test';
import { expect as webExpect } from '@playwright/test';
import { resaveSession, savedSession } from '@shared/auth/session';
import { HomePage } from '../pages/home.page';
import { HomeScreen } from '../pages/mobile/home.screen';
import { LoginScreen } from '../pages/mobile/login.screen';
import { SearchAssetScreen } from '../pages/mobile/search-asset.screen';
import { FaveScreen, StocktakeDetailScreen, StocktakeListScreen } from '../pages/mobile/stocktake.screen';
import { WebAssetPage } from '../pages/web/web-asset.page';
import { SessionEndedError } from '../pages/web/web-base.page';
import { type FaveTarget, WebFavePage } from '../pages/web/web-fave.page';
import { WebLoginPage } from '../pages/web/web-login.page';
import { mhmAccount, webAccount, WEB_ROLES, type WebRole } from '../utils/test-data';

type Options = {
  /**
   * Start the browser `page` logged in to MHA web with this role active: `test.use({ webRole: 'vet-ic' })`.
   * Logs in once and reuses the session (shared/auth/session.ts); a test without it gets a logged-out page.
   */
  webRole: WebRole | undefined;
};

type Fixtures = {
  homePage: HomePage;
  // Phone (mobilewright `screen`)
  loginScreen: LoginScreen;
  homeScreen: HomeScreen;
  stocktakeListScreen: StocktakeListScreen;
  faveScreen: FaveScreen;
  stocktakeDetailScreen: StocktakeDetailScreen;
  searchAssetScreen: SearchAssetScreen;
  /**
   * The phone logged in fresh with the .env account, on the home screen. The server ends a mobile session
   * about 10 minutes after login (BUG-001), so every test logs in again instead of reusing the app's session.
   */
  mobileHome: HomeScreen;
  /** The mobile officer's name from the bottom bar (upper case). */
  mobileOfficer: string;
  // MHA web (Playwright `page`)
  webFavePage: WebFavePage;
  webAssetPage: WebAssetPage;
  /**
   * Internal: the browser page with `webRole` active (logs in again if the saved session was ended).
   * Only the web page objects ask for it, so phone-only tests never start a browser.
   */
  webPage: import('@playwright/test').Page;
  /**
   * A FAVE asset for the mobile officer to sight (MHA web, VET IC), found at runtime; skips when none.
   * Teardown sets its result back to PENDING whatever happened in the test.
   */
  faveTarget: FaveTarget;
};

export const test = base.extend<Options & Fixtures>({
  webRole: [undefined, { option: true }],

  storageState: async ({ webRole, storageState, browser, baseURL, viewport }, use, testInfo) => {
    if (!webRole) return use(storageState);
    const account = webAccount();
    await use(
      await savedSession(browser, {
        project: 'mha-mobile',
        env: String(testInfo.project.metadata.env || ''),
        account: account.username,
        contextOptions: { baseURL, viewport },
        login: async (page) => {
          const login = new WebLoginPage(page);
          await login.goto();
          await login.login(account.username, account.password);
        },
        isLoggedIn: async (page) => {
          await page.goto('IndexBk');
          return /\/IndexBk/.test(page.url());
        },
      }),
    );
  },

  webPage: async ({ webRole, page }, use, testInfo) => {
    if (!webRole) throw new Error('A test that uses MHA web page objects needs test.use({ webRole: ... })');
    const web = new WebFavePage(page);
    const label = WEB_ROLES[webRole];
    try {
      await page.goto('IndexBk');
      if (web.isLoginUrl()) throw new SessionEndedError();
      const roles = await web.availableRoles();
      testInfo.skip(!roles.includes(label), `The MHA web account has no role "${label}". It holds: ${roles.join(', ')}`);
      await web.switchRole(label);
    } catch (e) {
      // One session per account: a newer login (a person, Aside's browser, mha-spf tests) ends the saved one.
      if (!(e instanceof SessionEndedError) && !web.isLoginUrl()) throw e;
      const account = webAccount();
      const login = new WebLoginPage(page);
      await login.goto();
      await login.login(account.username, account.password);
      await resaveSession(page, 'mha-mobile', String(testInfo.project.metadata.env || ''), account.username);
      await page.goto('IndexBk');
      await web.switchRole(label);
    }
    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginScreen: async ({ screen }, use) => {
    await use(new LoginScreen(screen));
  },
  homeScreen: async ({ screen }, use) => {
    await use(new HomeScreen(screen));
  },
  stocktakeListScreen: async ({ screen }, use) => {
    await use(new StocktakeListScreen(screen));
  },
  faveScreen: async ({ screen }, use) => {
    await use(new FaveScreen(screen));
  },
  stocktakeDetailScreen: async ({ screen }, use) => {
    await use(new StocktakeDetailScreen(screen));
  },
  searchAssetScreen: async ({ screen }, use) => {
    await use(new SearchAssetScreen(screen));
  },

  mobileHome: async ({ loginScreen, homeScreen }, use) => {
    await homeScreen.ensureLoggedOut(loginScreen);
    const account = mhmAccount();
    await loginScreen.login(account.username, account.password);
    await homeScreen.expectLoaded();
    await use(homeScreen);
  },
  mobileOfficer: async ({ mobileHome }, use) => {
    await use(await mobileHome.officerName());
  },

  webFavePage: async ({ webPage }, use) => {
    await use(new WebFavePage(webPage));
  },
  webAssetPage: async ({ webPage }, use) => {
    await use(new WebAssetPage(webPage));
  },

  faveTarget: async ({ webFavePage, mobileOfficer }, use, testInfo) => {
    const target = await webFavePage.findSightingTarget(mobileOfficer);
    testInfo.skip(
      !target,
      `No cost centre of the current FAVE (MHA web) is open, offers ${mobileOfficer} as stocktaker and has a PENDING asset that is theirs or unassigned. Give the web account (VET IC) a unit where the mobile officer is a stocktaker (context.md > Test data).`,
    );
    const t = target as FaveTarget;
    try {
      await use(t);
    } finally {
      await webFavePage.ensurePending(t.costCentre, t.asset);
    }
  },
});

export { expect, webExpect };
export { MOBILE_ROLES, QA_PREFIX, amount, sameName, unique } from '../utils/test-data';
