import { test, expect, unique } from '../../fixtures/pages.fixture';
import { mhmAccount } from '../../utils/test-data';

// Test cases: projects/mha-mobile/cases/auth/MHM-002-*.md, MHM-003-*.md
test.describe('Mobile login', () => {
  test('MHM-002: stocktaker logs in on the mobile app with the account from .env @smoke', async ({ loginScreen, homeScreen }) => {
    await test.step('1. Open the app logged out', async () => {
      await homeScreen.ensureLoggedOut(loginScreen);
      await loginScreen.expectShown();
    });
    await test.step('2. Log in with the .env account, empty password, agency SPF', async () => {
      const account = mhmAccount();
      await loginScreen.login(account.username, account.password);
      await homeScreen.expectLoaded();
      await expect(homeScreen.officer).toHaveText(/^[A-Z][A-Z' .-]+$/);
      await expect(homeScreen.roleAndCostCentre).toHaveText(/^.+ \| \d{6}$/);
    });
    await test.step('3. Switch opens the Switch Role panel', async () => {
      await homeScreen.openSwitch();
      await expect(homeScreen.roleSpinner).toBeVisible();
      await expect(homeScreen.costCentreSpinner).toBeVisible();
      await expect(homeScreen.confirmButton).toBeVisible();
      await expect(homeScreen.logoutButton).toBeVisible();
      await homeScreen.closeSwitch();
    });
  });

  test('MHM-003: login with an unknown username is refused @regression', async ({ loginScreen, homeScreen }) => {
    await test.step('1. Open the app logged out', async () => {
      await homeScreen.ensureLoggedOut(loginScreen);
    });
    let refusal: [string, string] = ['', ''];
    await test.step('2. Log in as an unknown user', async () => {
      refusal = await loginScreen.attemptLogin(`QA-NOUSER-${unique()}`);
    });
    await test.step('"Login failed": username or password is incorrect', async () => {
      expect(refusal[0]).toBe('Login failed');
      expect(refusal[1]).toMatch(/Your username or password is incorrect\.\s*Please try again\./);
    });
    await test.step('3. After OK the login screen stays', async () => {
      await loginScreen.expectShown();
      await expect(homeScreen.roleAndCostCentre).toBeHidden();
      await loginScreen.username.clear();
    });
  });
});
