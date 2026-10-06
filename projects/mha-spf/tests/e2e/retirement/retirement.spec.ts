import { test, expect, listDate } from '../../fixtures/pages.fixture';

/**
 * One year (plus `extraMonths`) from today, moved to the 20th: a future date (the asset stays RETIRED; a
 * past date would dispose it for good) whose day cannot be read as a month, so a day/month mix-up shows.
 */
function futureDisposalDate(extraMonths = 0): Date {
  const d = new Date();
  d.setDate(20);
  d.setFullYear(d.getFullYear() + 1);
  d.setMonth(d.getMonth() + extraMonths);
  return d;
}

// Works on the first RETIRED asset with no disposal date (found at runtime) and clears the date again.
test.describe('Retirement/Disposal (writes)', () => {
  test.use({ role: 'logs1' });

  let asset: string | undefined;

  test.beforeEach(async ({ retirementPage }) => {
    test.slow();
    asset = await retirementPage.firstRetiredWithoutDisposalDate();
    test.skip(!asset, 'No RETIRED asset without a disposal date on the first page of Retirement/Disposal');
  });

  test.afterEach(async ({ retirementPage }) => {
    if (!asset) return;
    await retirementPage.find(asset);
    if ((await retirementPage.disposalDate(asset).innerText()).trim() !== '-') await retirementPage.setDisposalDate(asset, null);
  });

  // Test case: projects/mha-spf/cases/retirement/SPF-031-*.md
  test('SPF-031: logs1 sets a future disposal date on a retired asset, which stays retired until that date @regression @writes', async ({
    retirementPage,
  }) => {
    const id = asset!;
    const date = futureDisposalDate();

    await test.step(`1-2. Set disposal date ${listDate(date)} on ${id}`, async () => {
      expect(await retirementPage.setDisposalDate(id, date)).toBe('Updating done');
    });

    await test.step('3. The date is saved and the asset is still RETIRED', async () => {
      await retirementPage.find(id);
      await expect(retirementPage.disposalDate(id)).toHaveText(listDate(date));
      await expect(retirementPage.status(id)).toHaveText('RETIRED');
    });

    await test.step('4. Clearing the date puts it back to "-"', async () => {
      expect(await retirementPage.setDisposalDate(id, null)).toBe('Updating done');
      await retirementPage.find(id);
      await expect(retirementPage.disposalDate(id)).toHaveText('-');
      await expect(retirementPage.status(id)).toHaveText('RETIRED');
    });
  });

  // Test case: projects/mha-spf/cases/retirement/SPF-032-*.md
  // The dialog pre-fills a different date when reopened (BUG-005, wont-fix: accepted), so the test never
  // relies on the pre-filled value: setDisposalDate always picks the date before submitting.
  test('SPF-032: logs1 changes an existing disposal date @regression @writes', async ({ retirementPage }) => {
    const id = asset!;
    const first = futureDisposalDate();
    const second = futureDisposalDate(1);

    await test.step(`1. Set disposal date ${listDate(first)} on ${id}`, async () => {
      expect(await retirementPage.setDisposalDate(id, first)).toBe('Updating done');
      await retirementPage.find(id);
      await expect(retirementPage.disposalDate(id)).toHaveText(listDate(first));
    });

    await test.step(`2. Change it to ${listDate(second)}`, async () => {
      expect(await retirementPage.setDisposalDate(id, second)).toBe('Updating done');
    });

    await test.step('3. The list shows the new date; the asset is still RETIRED', async () => {
      await retirementPage.find(id);
      await expect(retirementPage.disposalDate(id)).toHaveText(listDate(second));
      await expect(retirementPage.status(id)).toHaveText('RETIRED');
    });
  });
});
