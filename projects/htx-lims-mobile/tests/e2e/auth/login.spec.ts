import { test, expect, appAccount } from '../../fixtures/pages.fixture';

// Test case: projects/htx-lims-mobile/cases/auth/HLM-002-*.md
test.describe('App sign-in', () => {
  test('HLM-002: sign in with the .env account downloads the device data and opens the Dashboard @smoke', async ({ loginScreen, dashboardScreen }) => {
    const account = appAccount();
    await test.step('1. Open the app signed out (logs out only when the Upload queue is empty)', async () => {
      await dashboardScreen.ensureLoggedOut(loginScreen);
    });
    await test.step('2. Sign in: "Data downloaded" dialog, OK, Dashboard', async () => {
      await loginScreen.login(account.username, account.password);
      await dashboardScreen.expectLoaded();
    });
    await test.step('3. The bottom bar shows the signed-in username', async () => {
      expect((await dashboardScreen.signedInUsername()).toUpperCase()).toBe(account.username.toUpperCase());
    });
  });
});
