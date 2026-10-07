import fs from 'node:fs';
import { test, expect, writeXlsx } from '../../fixtures/pages.fixture';

// Import Working Result on the first non-approved cost centre of the current FAVE and its first asset
// (fixture faveTarget: brings the cost centre back to VET IC, VET IC active). The asset is set back to
// PENDING afterwards.
test.describe('Stocktake FAVE: Import Working Result', () => {
  test.use({ role: 'vet-ic' });

  // Test case: projects/mha-hta/cases/stocktake-fave/HTA-036-*.md
  test('HTA-036: vet ic imports a working result file and the assets become sighted / working @regression @writes', async ({
    favePage,
    faveTarget: { costCentre, asset },
  }, testInfo) => {
    test.slow();
    // The manual's template: header A1 "LMSAssetID", one asset ID per row. Excel stores a typed ID as a number.
    const file = testInfo.outputPath('fave-working-result.xlsx');
    fs.writeFileSync(file, writeXlsx([['LMSAssetID'], [Number(asset)]]));

    try {
      await test.step(`1-2. Open the FAVE on ${costCentre}, choose a file with ${asset}`, async () => {
        await favePage.openForCostCentre(costCentre);
        await favePage.openImport();
        await favePage.chooseImportFile(file);
        await expect(favePage.importRows).toHaveCount(1);
        await expect(favePage.importRow(asset)).toContainText('1');
      });

      await test.step('3. Import', async () => {
        expect(await favePage.submitImport()).toBe('The import record(s) have been successful.');
      });

      await test.step('4. The asset is SIGHTED / WORKING with the FSSC mapping (mha-spf BUG-007 does not occur on HTA)', async () => {
        await favePage.openForCostCentre(costCentre);
        await favePage.searchDetails(asset);
        // HTA shows an imported result as "Sighted" (a manual update shows "SIGHTED"), so ignore case.
        await expect(favePage.resultOf(asset)).toContainText(/sighted/i);
        await expect(favePage.resultOf(asset)).toContainText('WORKING');
        await expect(favePage.followUpOf(asset)).toHaveText('No Further Action');
        await expect(favePage.fsscOf(asset)).toHaveText('Working condition');
      });
    } finally {
      await favePage.ensurePending(costCentre, asset);
    }
  });

  // Test case: projects/mha-hta/cases/stocktake-fave/HTA-037-*.md
  test('HTA-037: fave import template downloads the lmsassetid template @regression @writes', async ({
    favePage,
    faveTarget: { costCentre },
  }, testInfo) => {
    test.fail(true, 'BUG-003: Import Template downloads a page instead of the zip template (also mha-spf BUG-006)');

    await test.step(`1. Open Import Working Result on ${costCentre}`, async () => {
      await favePage.openForCostCentre(costCentre);
      await favePage.openImport();
    });

    await test.step('2. Import Template gives a real zip file (BUG-003)', async () => {
      const download = await favePage.downloadImportTemplate();
      expect(download.suggestedFilename()).toBe('StocktakeFAVEWorkTemplate.zip');
      const file = testInfo.outputPath(download.suggestedFilename());
      await download.saveAs(file);
      // A zip archive starts with "PK"; the broken download is an HTML page.
      expect(fs.readFileSync(file).subarray(0, 2).toString('latin1')).toBe('PK');
    });
  });
});
