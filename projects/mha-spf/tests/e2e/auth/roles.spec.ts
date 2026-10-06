import { test, expect, ROLES } from '../../fixtures/pages.fixture';

// Test case: projects/mha-spf/cases/auth/SPF-002-*.md
test.describe('Role switching', () => {
  test.use({ role: 'agency-admin' });

  test('SPF-002: switch the active role from the header role dropdown @smoke', async ({ dashboardPage }) => {
    await test.step('1. Dashboard as Agency Admin shows the User menu', async () => {
      await expect(dashboardPage.currentRole).toHaveText(ROLES['agency-admin']);
      await expect(dashboardPage.menuItem('User')).toBeVisible();
    });

    await test.step('2. Switch to Logistics Officer 1: User menu is gone', async () => {
      await dashboardPage.switchRole(ROLES.logs1);
      await dashboardPage.expectLoaded();
      await expect(dashboardPage.currentRole).toHaveText(ROLES.logs1);
      await expect(dashboardPage.menuItem('User')).toBeHidden();
      for (const item of ['Dashboard', 'Asset', 'Stocktake', 'Report', 'Settings']) {
        await expect(dashboardPage.menuItem(item), `side menu shows ${item}`).toBeVisible();
      }
    });

    await test.step('3. Switch back to Agency Admin: User menu is back', async () => {
      await dashboardPage.switchRole(ROLES['agency-admin']);
      await expect(dashboardPage.currentRole).toHaveText(ROLES['agency-admin']);
      await expect(dashboardPage.menuItem('User')).toBeVisible();
    });
  });
});
