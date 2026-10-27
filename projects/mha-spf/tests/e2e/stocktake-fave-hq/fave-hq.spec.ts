import { test, expect, readXlsxDownload, ROLES } from '../../fixtures/pages.fixture';
import type { FaveHqPage } from '@shared/mha-ats/pages/fave-hq.page';

/** Overview counts per FSSC outcome must add up to the non-PENDING rows of the Summary. */
async function expectOverviewMatchesSummary(faveHq: FaveHqPage): Promise<void> {
  const overview = await faveHq.overview();
  const summary = await faveHq.summary();
  for (const o of overview) {
    // Legend = "<Sighted|Not Sighted>( - |, )<FSSC Outcome>", e.g. "Sighted - Working condition".
    const m = o.legend.match(/^(Not Sighted|Sighted)(?: - |, )(.+)$/);
    expect(m, `legend "${o.legend}"`).toBeTruthy();
    const [, sighted, fssc] = m as RegExpMatchArray;
    const fromSummary = summary
      .filter((s) => s.result === sighted.toUpperCase() && s.fssc === fssc)
      .reduce((n, s) => n + s.count, 0);
    expect(o.count, `Overview "${o.letter} ${o.legend}" vs Summary`).toBe(fromSummary);
  }
}

// HQ view of the FAVE (Agency Admin). The result is recorded as VET IC on the first non-approved cost
// centre (fixture faveTarget) and reset to PENDING afterwards.
test.describe('Stocktake FAVE(HQ)', () => {
  test.use({ role: 'vet-ic' });

  test.afterEach(async ({ favePage, faveTarget }) => {
    await favePage.switchRole(ROLES['vet-ic']);
    await favePage.ensurePending(faveTarget.costCentre, faveTarget.asset);
  });

  // Test case: projects/mha-spf/cases/stocktake-fave-hq/SPF-043-*.md
  test('SPF-043: agency admin sees a unit fave result in fave(hq) overview, details and export @regression @writes', async ({
    favePage,
    faveHqPage,
    faveTarget: { costCentre, asset },
  }) => {
    test.slow();
    test.skip(!(await favePage.availableRoles()).includes(ROLES['agency-admin']), 'The test account has no Agency Admin role');
    let faveNo = '';
    let before = 0;

    await test.step(`Setup: ${asset} on ${costCentre} is PENDING`, async () => {
      await favePage.ensurePending(costCentre, asset);
      faveNo = await favePage.openForCostCentre(costCentre);
    });

    await test.step('1. Agency Admin opens the same FAVE in FAVE(HQ) with every cost centre', async () => {
      await favePage.switchRole(ROLES['agency-admin']);
      expect(await faveHqPage.openFirst()).toBe(faveNo);
      expect(await faveHqPage.costCentreTotal()).toBeGreaterThanOrEqual(1);
    });

    await test.step(`2. Cost centre ${costCentre}: Overview legend a..i matches the Summary`, async () => {
      await faveHqPage.selectCostCentre(costCentre);
      const overview = await faveHqPage.overview();
      expect(overview.map((o) => o.letter)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']);
      expect(overview[0].legend).toBe('Sighted - Working condition');
      before = overview[0].count;
      await expectOverviewMatchesSummary(faveHqPage);
    });

    await test.step('3. FAVE(HQ) is read-only: Details has only Search and Clear', async () => {
      await faveHqPage.searchDetails(asset);
      await expect(faveHqPage.detailRow(asset)).toContainText('PENDING');
      expect((await faveHqPage.detailButtons.allInnerTexts()).map((t) => t.trim())).toEqual(['Search', 'Clear']);
    });

    await test.step(`4. VET IC records ${asset} as SIGHTED / WORKING`, async () => {
      await favePage.reopenAs(ROLES['vet-ic'], costCentre);
      await favePage.searchDetails(asset);
      await favePage.openUpdateResult(asset);
      await favePage.fillResult({ sighted: 'SIGHTED', condition: 'WORKING' });
      expect(await favePage.submitResult()).toBe('The stocktake result is updated.');
    });

    await test.step('5. FAVE(HQ) Overview "a" goes up by one and still matches the Summary', async () => {
      await favePage.switchRole(ROLES['agency-admin']);
      await faveHqPage.openFirst();
      await faveHqPage.selectCostCentre(costCentre);
      expect(await faveHqPage.overviewCount('a')).toBe(before + 1);
      await expectOverviewMatchesSummary(faveHqPage);
    });

    await test.step('6. Details shows the result', async () => {
      await faveHqPage.searchDetails(asset);
      await expect(faveHqPage.detailRow(asset)).toContainText('SIGHTED');
      await expect(faveHqPage.detailRow(asset)).toContainText('WORKING');
    });

    await test.step('7. The cost centre export lists the asset under legend a', async () => {
      const { name, rows } = await readXlsxDownload(await faveHqPage.exportCostCentre(), test.info().outputPath());
      expect(name).toMatch(/^StktakeFAVEReport_\d{14}\.xlsx$/);
      const row = rows.find((r) => r.includes(asset));
      expect(row, `${asset} is in the export`).toBeTruthy();
      expect(row).toContain(costCentre);
      expect(row).toContain('a. Sighted - Working condition');
      expect(row).toContain('No Further Action');
    });
  });
});
