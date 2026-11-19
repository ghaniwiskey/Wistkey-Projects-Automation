import { test as base, expect } from '@mobilewright/test';
import { DashboardScreen } from '../pages/mobile/dashboard.screen';
import { LoginScreen } from '../pages/mobile/login.screen';
import { CheckInScreen, CheckOutScreen, PreCheckInScreen } from '../pages/mobile/workflow.screen';
import { LimsWebPage } from '../pages/web/lims-web.page';
import { appAccount } from '../utils/test-data';

type Fixtures = {
  loginScreen: LoginScreen;
  dashboardScreen: DashboardScreen;
  /**
   * The app signed in, on the Dashboard. Reuses the app's session when it is already signed in (logging out
   * deletes the device data); otherwise signs in with the .env account.
   */
  appDashboard: DashboardScreen;
  preCheckInScreen: PreCheckInScreen;
  checkInScreen: CheckInScreen;
  checkOutScreen: CheckOutScreen;
  /** HTX LIMS web in the browser `page`, logged in with the same .env account (setup and checks). */
  limsWeb: LimsWebPage;
};

export const test = base.extend<Fixtures>({
  loginScreen: async ({ screen }, use) => {
    await use(new LoginScreen(screen));
  },
  dashboardScreen: async ({ screen }, use) => {
    await use(new DashboardScreen(screen));
  },
  preCheckInScreen: async ({ screen }, use) => {
    await use(new PreCheckInScreen(screen));
  },
  checkInScreen: async ({ screen }, use) => {
    await use(new CheckInScreen(screen));
  },
  checkOutScreen: async ({ screen }, use) => {
    await use(new CheckOutScreen(screen));
  },
  limsWeb: async ({ page }, use) => {
    const web = new LimsWebPage(page);
    const account = appAccount();
    await web.login(account.username, account.password);
    await use(web);
  },
  appDashboard: async ({ loginScreen, dashboardScreen }, use) => {
    await expect(dashboardScreen.title.or(loginScreen.title)).toBeVisible({ timeout: 60_000 });
    if (!(await dashboardScreen.isShown())) {
      const account = appAccount();
      await loginScreen.login(account.username, account.password);
    }
    await dashboardScreen.expectLoaded();
    await use(dashboardScreen);
  },
});

export { expect };
export { DASHBOARD_TILES, appAccount } from '../utils/test-data';
