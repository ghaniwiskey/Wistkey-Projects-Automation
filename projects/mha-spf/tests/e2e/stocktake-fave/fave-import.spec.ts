import fs from 'node:fs';
import { test, expect, writeXlsx } from '../../fixtures/pages.fixture';

// Import Working Result on the first non-approved cost centre of the current FAVE and its first asset
// (fixture faveTarget: brings the cost centre back to VET IC, VET IC active). The asset is set to PENDING
// before the import and again afterwards.
test.describe('Stocktake FAVE: Import Working Result', () => {
  test.use({ role: 'vet-ic' });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-036-*.md
  test('SPF-036: vet ic imports a working result file and the assets become sighted / working @regression @writes', async ({
    favePage,
    faveTarget: { costCentre, asset },
  }, testInfo) => {
    test.slow();
    // The manual's template: header A1 "LMSAssetID", one asset ID per row. Excel stores a typed ID as a number.
    const file = testInfo.outputPath('fave-working-result.xlsx');
    fs.writeFileSync(file, writeXlsx([['LMSAssetID'], [Number(asset)]]));

    try {
      await test.step(`1-2. Open the FAVE on ${costCentre} with ${asset} PENDING, choose a file with ${asset}`, async () => {
        // A result left by another test would make step 4 pass without the import doing anything.
        await favePage.ensurePending(costCentre, asset);
        await favePage.searchDetails(asset);
        await expect(favePage.resultOf(asset)).toHaveText(/^\s*PENDING\b/);
        await favePage.openImport();
        await favePage.chooseImportFile(file);
        await expect(favePage.importRows).toHaveCount(1);
        await expect(favePage.importRow(asset)).toContainText('1');
      });

      await test.step('3. Import', async () => {
        expect(await favePage.submitImport()).toBe('The import record(s) have been successful.');
      });

      // Steps 4-5 are the BUG-007 retest (the import cleared the result, later saved "Sighted" instead of SIGHTED).
      await test.step('4. The asset is SIGHTED / WORKING with the FSSC mapping', async () => {
        await favePage.openForCostCentre(costCentre);
        await favePage.searchDetails(asset);
        await expect(favePage.resultOf(asset)).toContainText('SIGHTED');
        await expect(favePage.resultOf(asset)).toContainText('WORKING');
        await expect(favePage.followUpOf(asset)).toHaveText('No Further Action');
        await expect(favePage.fsscOf(asset)).toHaveText('Working condition');
      });

      await test.step('5. Update Result is pre-loaded with the imported result, as for a result saved by hand', async () => {
        await favePage.openUpdateResult(asset);
        await expect(favePage.sightedResult).toHaveText('SIGHTED');
        await expect(favePage.assetCondition).toHaveText('WORKING');
        await expect(favePage.followUp).toHaveText('No Further Action');
      });
    } finally {
      await favePage.ensurePending(costCentre, asset);
    }
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-037-*.md
  test('SPF-037: fave import template downloads the lmsassetid template @regression @writes', async ({
    favePage,
    faveTarget: { costCentre },
  }, testInfo) => {
    test.fail(true, 'BUG-006: Import Template downloads the "Page Not Found" HTML page');

    await test.step(`1. Open Import Working Result on ${costCentre}`, async () => {
      await favePage.openForCostCentre(costCentre);
      await favePage.openImport();
    });

    await test.step('2. Import Template gives a real zip file (BUG-006)', async () => {
      const download = await favePage.downloadImportTemplate();
      expect(download.suggestedFilename()).toBe('StocktakeFAVEWorkTemplate.zip');
      const file = testInfo.outputPath(download.suggestedFilename());
      await download.saveAs(file);
      // A zip archive starts with "PK"; the broken download is an HTML page.
      expect(fs.readFileSync(file).subarray(0, 2).toString('latin1')).toBe('PK');
    });
  });
});
