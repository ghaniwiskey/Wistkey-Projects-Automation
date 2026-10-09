import { test } from '../../fixtures/pages.fixture';

// MHA Mobile is a native Android app (com.iconsult.mhasgtwo), tested with mobilewright on the emulator; the
// staging URL is a placeholder. This web smoke test skips itself until a real web target is set.
test.describe('Home', () => {
  test('MHM-001: home page loads @smoke', async ({ homePage, baseURL }) => {
    test.skip(/\.invalid/.test(baseURL ?? ''), 'No web target for MHA Mobile (native app, tested with mobilewright on the emulator).');
    await test.step('1. Open the home page', async () => {
      await homePage.goto();
    });
    await test.step('2. Page has a title and visible content', async () => {
      await homePage.expectLoaded();
    });
  });
});
