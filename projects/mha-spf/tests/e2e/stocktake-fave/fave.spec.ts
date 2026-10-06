import { test, expect, FAVE, readXlsxDownload, unique } from '../../fixtures/pages.fixture';

const APPROVAL_STAGES = ['Verification Team IC/2IC', 'Unit Resource Officer', 'Unit Approving Officer'];

test.describe('Stocktake FAVE', () => {
  test.use({ role: 'vet-ic' });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-019-*.md
  test('SPF-019: vet ic views the active fave for a unit and exports it @regression', async ({ favePage }) => {
    test.slow();

    await test.step('1. FAVE list shows numbers in the SPF format', async () => {
      await favePage.gotoList();
      const numbers = await favePage.faveNumbers();
      expect(numbers.length).toBeGreaterThan(0);
      for (const n of numbers) expect(n).toMatch(/^FAVE FY\d{2}-20\d{2}$/);
    });

    await test.step('1. Open the first FAVE', async () => {
      const faveNo = await favePage.openFirst();
      await expect(favePage.title).toContainText(`Stocktake FAVE #${faveNo}`);
    });

    await test.step('2-3. Cost centre 332600: approval panel, Submit and results summary', async () => {
      await favePage.selectCostCentre(FAVE.costCentre);
      for (const stage of APPROVAL_STAGES) await expect(favePage.approvalStage(stage)).toBeVisible();
      await expect(favePage.submitFaveButton).toBeVisible();
      await expect(favePage.summaryRows.first()).toContainText(/(PENDING|SIGHTED|NOT SIGHTED)/);
    });

    await test.step('4. Details search finds the asset with a sighting result', async () => {
      await favePage.searchDetails(FAVE.asset);
      await expect(favePage.resultOf(FAVE.asset)).toHaveText(/^\s*(PENDING|SIGHTED|NOT SIGHTED)\b/);
    });

    await test.step('5. Export downloads the FAVE report with the asset', async () => {
      const { name, rows } = await readXlsxDownload(await favePage.export(), test.info().outputPath());
      expect(name).toMatch(/^StocktakeFAVEReport_\d{14}\.xlsx$/);
      expect(rows.length).toBeGreaterThan(1);
      expect(rows.some((r) => r.includes(FAVE.asset)), `${FAVE.asset} is in the export`).toBe(true);
    });
  });

  // Writes the live FAVE result of one asset and puts it back to PENDING (also on failure).
  test.describe('writes', () => {
    test.afterEach(async ({ favePage }) => {
      await favePage.ensurePending(FAVE.costCentre, FAVE.asset);
    });

    // Test case: projects/mha-spf/cases/stocktake-fave/SPF-020-*.md
    test('SPF-020: vet ic updates a fave sighting result and htd follow-up is auto-mapped @regression @writes', async ({ favePage }) => {
      test.slow();
      const remarks = unique('fave');

      await test.step('1. Open the FAVE on 332600 and find the asset', async () => {
        await favePage.openForCostCentre(FAVE.costCentre);
        await favePage.searchDetails(FAVE.asset);
      });

      await test.step('2-3. SIGHTED + WORKING fill the FSSC mapping', async () => {
        await favePage.openUpdateResult(FAVE.asset);
        await favePage.fillResult({ sighted: 'SIGHTED', condition: 'WORKING', remarks });
        await expect(favePage.followUp).toHaveText('No Further Action');
        await expect(favePage.fsscOutcome).toHaveValue('Working condition');
        await expect(favePage.faveStatus).toHaveValue('CLOSED');
        await expect(favePage.correctLocation).toBeChecked();
        await expect(favePage.locationStatus).toHaveValue('CLOSED');
      });

      await test.step('3. Submit', async () => {
        expect(await favePage.submitResult()).toBe('The stocktake result is updated.');
      });

      await test.step('4. The row shows the result', async () => {
        await favePage.searchDetails(FAVE.asset);
        await expect(favePage.resultOf(FAVE.asset)).toContainText('SIGHTED');
        await expect(favePage.resultOf(FAVE.asset)).toContainText('WORKING');
        await expect(favePage.followUpOf(FAVE.asset)).toHaveText('No Further Action');
        await expect(favePage.fsscOf(FAVE.asset)).toHaveText('Working condition');
      });

      await test.step('5. Single selection pre-loads the saved values; PENDING resets the result', async () => {
        await favePage.openUpdateResult(FAVE.asset);
        await expect(favePage.sightedResult).toHaveText('SIGHTED');
        await expect(favePage.assetCondition).toHaveText('WORKING');
        await expect(favePage.remarks).toHaveValue(remarks);
        await favePage.fillResult({ sighted: 'PENDING' });
        expect(await favePage.submitResult()).toBe('The stocktake result is updated.');
        await favePage.searchDetails(FAVE.asset);
        await expect(favePage.resultOf(FAVE.asset)).toHaveText(/^\s*PENDING\s*$/);
      });
    });

    // Test case: projects/mha-spf/cases/stocktake-fave/SPF-021-*.md
    test('SPF-021: vet ic assigns a stocktaker to a fave asset @regression @writes', async ({ favePage }) => {
      test.slow();
      const [other, testAccount] = FAVE.stocktakers;

      await test.step('1. Open the FAVE on 332600, Assignment tab', async () => {
        await favePage.openForCostCentre(FAVE.costCentre);
        await favePage.searchAssignment(FAVE.asset);
      });

      await test.step('2. A stocktaker is required', async () => {
        await favePage.openAssign(FAVE.asset);
        await favePage.submitAssign();
        await expect(favePage.stocktakerRequired).toBeVisible();
        await expect(favePage.assignModal).toBeVisible();
        await favePage.closeAssign();
      });

      await test.step(`3. Assign ${other} after a confirmation`, async () => {
        const result = await favePage.assignStocktaker(FAVE.asset, other);
        expect(result.confirmation).toBe('Please confirm if you would like to proceed with assigning a stocktaker to this FAVE.');
        expect(result.message).toBe('The stocktaker has been assigned.');
        await expect(favePage.stocktakerOf(FAVE.asset)).toHaveText(other);
      });

      await test.step(`4. Reassign ${testAccount}`, async () => {
        await favePage.assignStocktaker(FAVE.asset, testAccount);
        await expect(favePage.stocktakerOf(FAVE.asset)).toHaveText(testAccount);
      });
    });
  });
});
