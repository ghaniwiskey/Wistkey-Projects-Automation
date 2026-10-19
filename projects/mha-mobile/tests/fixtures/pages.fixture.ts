import { test as base, expect } from '@mobilewright/test';
import { expect as webExpect } from '@playwright/test';
import { resaveSession, savedSession } from '@shared/auth/session';
import { HomePage } from '../pages/home.page';
import { HomeScreen } from '../pages/mobile/home.screen';
import { LoginScreen } from '../pages/mobile/login.screen';
import { SearchAssetScreen } from '../pages/mobile/search-asset.screen';
import { AssignScreen } from '../pages/mobile/assign.screen';
import { NewAssetScreen } from '../pages/mobile/new-asset.screen';
import { RegistrationScreen } from '../pages/mobile/registration.screen';
import { FaveScreen, StocktakeDetailScreen, StocktakeListScreen } from '../pages/mobile/stocktake.screen';
import { type WebAsset, WebAssetPage } from '../pages/web/web-asset.page';
import { WebAssignmentPage } from '../pages/web/web-assignment.page';
import { WebNewAssetPage } from '../pages/web/web-new-asset.page';
import { WebAdHocPage } from '../pages/web/web-adhoc.page';
import { SessionEndedError } from '../pages/web/web-base.page';
import { type FaveTarget, WebFavePage } from '../pages/web/web-fave.page';
import { WebLoginPage } from '../pages/web/web-login.page';
import { mhmAccount, QA_PHOTO, webAccount, WEB_ROLES, type WebRole } from '../utils/test-data';
import { pushGalleryPhoto, removeGalleryPhoto, setNetwork } from '../utils/device';

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
  assignScreen: AssignScreen;
  newAssetScreen: NewAssetScreen;
  registrationScreen: RegistrationScreen;
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
  webAssignmentPage: WebAssignmentPage;
  webNewAssetPage: WebNewAssetPage;
  webAdHocPage: WebAdHocPage;
  /**
   * Find an asset for a phone test: the first AVAILABLE asset of MHA web Asset Listing whose cost centre
   * the phone offers for the role (read from the Switch Role panel), read from Asset Details. With
   * `withRemarks`, only an asset that has location remarks. Skips the test when none fits.
   */
  phoneAsset: (role: string, opts?: { withRemarks?: boolean }) => Promise<WebAsset>;
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
  /** Switch the emulator's Wi-Fi and mobile data; teardown always turns them back on. */
  network: { set(on: boolean): void };
  /** A photo pushed into the gallery as the newest one (removed afterwards); its device file name. */
  galleryPhoto: string;
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
  assignScreen: async ({ screen }, use) => {
    await use(new AssignScreen(screen));
  },
  newAssetScreen: async ({ screen }, use) => {
    await use(new NewAssetScreen(screen));
  },
  registrationScreen: async ({ screen }, use) => {
    await use(new RegistrationScreen(screen));
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
  webAssignmentPage: async ({ webPage }, use) => {
    await use(new WebAssignmentPage(webPage));
  },
  webNewAssetPage: async ({ webPage }, use) => {
    await use(new WebNewAssetPage(webPage));
  },
  webAdHocPage: async ({ webPage }, use) => {
    await use(new WebAdHocPage(webPage));
  },
  phoneAsset: async ({ mobileHome, webAssetPage }, use, testInfo) => {
    await use(async (role, opts) => {
      const offered = await mobileHome.costCentresOf(role);
      const candidates = (await webAssetPage.listedWithStatus('AVAILABLE')).filter((a) => offered.includes(a.costCentre));
      for (const c of candidates) {
        await webAssetPage.openAsset(c.id);
        const asset = await webAssetPage.readAsset();
        if (!opts?.withRemarks || (asset.remarks && asset.remarks !== '-')) return asset;
        await webAssetPage.gotoListing();
      }
      testInfo.skip(true, `No AVAILABLE asset on the first MHA web listing page${opts?.withRemarks ? ' with location remarks' : ''} belongs to a cost centre the phone offers for ${role} (${offered.join(', ')})`);
      throw new Error('unreachable');
    });
  },

  network: async ({}, use) => {
    try {
      await use({ set: setNetwork });
    } finally {
      setNetwork(true);
    }
  },
  galleryPhoto: async ({}, use) => {
    const name = pushGalleryPhoto(QA_PHOTO);
    try {
      await use(name);
    } finally {
      removeGalleryPhoto(name);
    }
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
      // A test may have switched to another web role (e.g. LOGS1 for a relocation); the reset needs VET IC.
      await webFavePage.useRole(WEB_ROLES['vet-ic']);
      await webFavePage.ensurePending(t.costCentre, t.asset);
    }
  },
});

export { expect, webExpect };
export { MOBILE_ROLES, QA_PREFIX, ROLE_TILES, WEB_ROLES, amount, blankable, sameName, unique } from '../utils/test-data';
