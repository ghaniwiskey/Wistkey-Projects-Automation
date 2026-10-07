import { test, expect, readXlsxDownload, unique } from '../../fixtures/pages.fixture';

const APPROVAL_STAGES = ['Verification Team IC/2IC', 'Unit Resource Officer', 'Unit Approving Officer'] as const;

test.describe('Stocktake FAVE', () => {
  test.use({ role: 'vet-ic' });

  // Test case: projects/mha-hta/cases/stocktake-fave/HTA-019-*.md
  // Read-only, on the first cost centre of the current FAVE that is not APPROVED.
  test('HTA-019: vet ic views the active fave for a unit and exports it @regression', async ({ favePage }) => {
    test.slow();
    let costCentre = ''; // the first cost centre of the FAVE that is not APPROVED
    let asset = '';

    // FAVE FYaa-bbcc: bb is the agency code (manual), 90 for HTA (seen on HTA UAT, 2026-10-07; SPF uses 20).
    await test.step('1. FAVE list shows numbers in the HTA format', async () => {
      await favePage.gotoList();
      const numbers = await favePage.faveNumbers();
      expect(numbers.length).toBeGreaterThan(0);
      for (const n of numbers) expect(n).toMatch(/^FAVE FY\d{2}-90\d{2}$/);
    });

    await test.step('1. Open the first FAVE and take a cost centre that is not approved', async () => {
      const found = await favePage.firstNotApproved(); // opens the first FAVE
      test.skip(!found, 'Every cost centre of the current FAVE is APPROVED');
      costCentre = found as string;
      await expect(favePage.title).toContainText(/Stocktake FAVE #FAVE FY\d{2}-90\d{2}/);
    });

    await test.step('2-3. Non-approved cost centre: approval panel and results summary', async () => {
      await favePage.selectCostCentre(costCentre);
      for (const stage of APPROVAL_STAGES) await expect(favePage.stage(stage)).toBeVisible();
      await expect(favePage.summaryRows.first()).toContainText(/(PENDING|SIGHTED|NOT SIGHTED)/);
      asset = await favePage.firstAssetId();
    });

    await test.step('4. Details search finds the asset with a sighting result', async () => {
      await favePage.searchDetails(asset);
      await expect(favePage.resultOf(asset)).toHaveText(/^\s*(PENDING|SIGHTED|NOT SIGHTED)\b/);
    });

    await test.step('5. Export downloads the FAVE report with the asset', async () => {
      const { name, rows } = await readXlsxDownload(await favePage.export(), test.info().outputPath());
      expect(name).toMatch(/^StocktakeFAVEReport_\d{14}\.xlsx$/);
      expect(rows.length).toBeGreaterThan(1);
      expect(rows.some((r) => r.includes(asset)), `${asset} is in the export`).toBe(true);
    });
  });

  // Write tests on the first non-approved cost centre (faveTarget: back with VET IC, first asset).
  test.describe('writes', () => {
    test.afterEach(async ({ favePage, faveTarget }) => {
      await favePage.ensurePending(faveTarget.costCentre, faveTarget.asset);
    });

    // Test case: projects/mha-hta/cases/stocktake-fave/HTA-020-*.md
    test('HTA-020: vet ic updates a fave sighting result and htd follow-up is auto-mapped @regression @writes', async ({
      favePage,
      faveTarget: { costCentre, asset },
    }) => {
      test.slow();
      const remarks = unique('fave');

      await test.step(`1. Open the FAVE on ${costCentre} and find asset ${asset}`, async () => {
        await favePage.openForCostCentre(costCentre);
        await favePage.searchDetails(asset);
      });

      await test.step('2-3. SIGHTED + WORKING fill the FSSC mapping', async () => {
        await favePage.openUpdateResult(asset);
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

      await test.step('4. After reopening the FAVE the row shows the result', async () => {
        await favePage.openForCostCentre(costCentre); // fresh page: the result is really saved
        await favePage.searchDetails(asset);
        await expect(favePage.resultOf(asset)).toContainText('SIGHTED');
        await expect(favePage.resultOf(asset)).toContainText('WORKING');
        await expect(favePage.followUpOf(asset)).toHaveText('No Further Action');
        await expect(favePage.fsscOf(asset)).toHaveText('Working condition');
      });

      await test.step('5. Single selection pre-loads the saved values; PENDING resets the result', async () => {
        await favePage.openUpdateResult(asset);
        await expect(favePage.sightedResult).toHaveText('SIGHTED');
        await expect(favePage.assetCondition).toHaveText('WORKING');
        await expect(favePage.remarks).toHaveValue(remarks);
        await favePage.fillResult({ sighted: 'PENDING' });
        expect(await favePage.submitResult()).toBe('The stocktake result is updated.');
        await favePage.searchDetails(asset);
        await expect(favePage.resultOf(asset)).toHaveText(/^\s*PENDING\s*$/);
      });
    });

    // Test case: projects/mha-hta/cases/stocktake-fave/HTA-021-*.md
    test('HTA-021: vet ic assigns a stocktaker to a fave asset @regression @writes', async ({
      favePage,
      faveTarget: { costCentre, asset },
    }) => {
      test.slow();
      let stocktakers: string[] = [];

      await test.step(`1. Open the FAVE on ${costCentre}, Assignment tab, asset ${asset}`, async () => {
        await favePage.openForCostCentre(costCentre);
        await favePage.searchAssignment(asset);
      });

      await test.step('2. A stocktaker is required', async () => {
        await favePage.openAssign(asset);
        stocktakers = await favePage.stocktakerOptions();
        expect(stocktakers.length, 'the cost centre has stocktakers').toBeGreaterThan(0);
        await favePage.submitAssign();
        await expect(favePage.stocktakerRequired).toBeVisible();
        await expect(favePage.assignModal).toBeVisible();
        await favePage.closeAssign();
      });

      await test.step('3. Assign the first stocktaker after a confirmation', async () => {
        const result = await favePage.assignStocktaker(asset, stocktakers[0]);
        expect(result.confirmation).toBe('Please confirm if you would like to proceed with assigning a stocktaker to this FAVE.');
        expect(result.message).toBe('The stocktaker has been assigned.');
        await expect(favePage.stocktakerOf(asset)).toHaveText(stocktakers[0]);
      });

      // Reassigning needs a second stocktaker in the cost centre (skipped when there is only one).
      if (stocktakers.length > 1) {
        await test.step('4. Reassign another stocktaker', async () => {
          await favePage.assignStocktaker(asset, stocktakers[1]);
          await expect(favePage.stocktakerOf(asset)).toHaveText(stocktakers[1]);
        });
      }
    });
  });
});
