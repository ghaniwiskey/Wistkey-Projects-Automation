import { test, expect, listDate, pickerDate } from '../../fixtures/pages.fixture';

/**
 * One year from today, moved to the 20th: a future date (the asset stays RETIRED; a past date would
 * dispose it for good) whose day cannot be read as a month, so a day/month mix-up shows (BUG-005).
 */
function futureDisposalDate(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(20);
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
  test('SPF-032: the disposal date dialog shows the saved disposal date @regression @writes', async ({ retirementPage }) => {
    test.fail(true, 'BUG-005: the Update dialog pre-fills a wrong date (day and month swapped, e.g. 31-Dec-2027 shows as 07/12/2029)');
    const id = asset!;
    const date = futureDisposalDate();

    await test.step(`1. Set disposal date ${listDate(date)} on ${id}`, async () => {
      await retirementPage.setDisposalDate(id, date);
      await retirementPage.find(id);
      await expect(retirementPage.disposalDate(id)).toHaveText(listDate(date));
    });

    await test.step('2. Reopening the pencil shows the saved date (BUG-005)', async () => {
      await retirementPage.openUpdate(id);
      await expect(retirementPage.disposalDateInput).toHaveValue(pickerDate(date));
      await retirementPage.closeUpdate();
    });
  });
});
