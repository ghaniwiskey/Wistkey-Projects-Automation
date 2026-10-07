import { test, expect, ROLES, listDate } from '../../fixtures/pages.fixture';
import type { RoleListingPage } from '../../pages/user-admin.page';

// User > Role Listing > Periods (role validity) as Agency Admin, on Stocktaker: HTA has no End User, and
// Stocktaker has the fewest rights (FAVE only). The test deletes its period again. The dates are in next month (13th to 20th):
// a day above 12 cannot be read as a month, which shows the day/month mix-up of BUG-004 (mha-spf BUG-011).
const ROLE = ROLES.stocktaker;

function nextMonth(day: number): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, day);
}

test.describe('User admin: role periods', () => {
  test.use({ role: 'agency-admin' });

  // Test case: projects/mha-hta/cases/user-admin/HTA-047-*.md
  test('HTA-047: role period dialog checks required dates and the date order @regression', async ({ roleListingPage }) => {
    let before: string[] = [];

    await test.step(`1. ${ROLE} > Periods > Add Period, Submit with empty dates`, async () => {
      await roleListingPage.openRole(ROLE);
      await roleListingPage.openPeriodsTab();
      before = await roleListingPage.periods();
      await roleListingPage.openAddPeriod();
      await roleListingPage.clickSubmitPeriod();
      await expect(roleListingPage.startRequired).toBeVisible();
      await expect(roleListingPage.endRequired).toBeVisible();
    });

    await test.step('2. A start date after the end date is refused (BUG-010 / mha-spf BUG-015 spelling)', async () => {
      await roleListingPage.setPeriodDates(nextMonth(10), nextMonth(5));
      await roleListingPage.clickSubmitPeriod();
      await expect(roleListingPage.startAfterEnd).toBeVisible();
      await expect(roleListingPage.endBeforeStart).toBeVisible();
      await expect(roleListingPage.alert).toBeHidden();
    });

    await test.step('3. Cancel: the Periods table is unchanged', async () => {
      await roleListingPage.cancelPeriod();
      await roleListingPage.openRole(ROLE);
      await roleListingPage.openPeriodsTab();
      expect(await roleListingPage.periods()).toEqual(before);
    });
  });

  test.describe('saving (writes)', () => {
    const start = nextMonth(13);
    const end = nextMonth(20);

    /** Delete the period this test adds if it is there (only when the bug is fixed, or half-fixed). */
    async function deleteTestPeriod(roleListingPage: RoleListingPage): Promise<void> {
      await roleListingPage.openRole(ROLE);
      await roleListingPage.openPeriodsTab();
      if ((await roleListingPage.periodRow(listDate(start), listDate(end)).count()) > 0) {
        await roleListingPage.deletePeriod(listDate(start), listDate(end));
      }
    }

    test.beforeEach(async ({ roleListingPage }) => {
      await deleteTestPeriod(roleListingPage);
    });

    test.afterEach(async ({ roleListingPage }) => {
      await deleteTestPeriod(roleListingPage);
    });

    // Test case: projects/mha-hta/cases/user-admin/HTA-048-*.md
    test('HTA-048: role period is saved with the dates picked in the calendar @regression @writes', async ({ roleListingPage }) => {
      test.fail(true, 'BUG-004: the server reads the dd/mm/yyyy period dates as mm/dd/yyyy; a day above 12 fails with "SqlDateTime overflow" (also mha-spf BUG-011)');

      await test.step(`1-2. Add the period ${listDate(start)} to ${listDate(end)}`, async () => {
        await roleListingPage.openAddPeriod();
        await roleListingPage.setPeriodDates(start, end);
        expect(await roleListingPage.submitPeriod()).toBe('Period has been successfully saved.');
      });

      await test.step('The Periods table lists exactly the picked dates', async () => {
        await roleListingPage.openRole(ROLE);
        await roleListingPage.openPeriodsTab();
        await expect(roleListingPage.periodRow(listDate(start), listDate(end))).toHaveCount(1);
      });

      await test.step('3. Delete it again', async () => {
        expect(await roleListingPage.deletePeriod(listDate(start), listDate(end))).toBe(
          `Period ${listDate(start)} to ${listDate(end)} has been successfully deleted.`,
        );
        await expect(roleListingPage.periodRow(listDate(start), listDate(end))).toHaveCount(0);
      });
    });
  });
});
