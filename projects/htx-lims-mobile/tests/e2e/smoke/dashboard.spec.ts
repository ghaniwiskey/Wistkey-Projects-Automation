import { test, expect, DASHBOARD_TILES } from '../../fixtures/pages.fixture';

// Test case: projects/htx-lims-mobile/cases/smoke/HLM-001-*.md
test.describe('Dashboard', () => {
  test('HLM-001: app opens on the Dashboard with every task tile @smoke', async ({ appDashboard }) => {
    await test.step('1. Launch the app (signed in with the .env account when needed)', async () => {
      await appDashboard.expectLoaded();
    });
    await test.step('2. The Data update card and every task tile are shown', async () => {
      const texts = await appDashboard.textsOnScreen();
      expect(texts.some((t) => /^Last updated: /.test(t)), 'Last updated: ...').toBe(true);
      await appDashboard.expectTexts(Object.entries(DASHBOARD_TILES).flat());
    });
  });
});
