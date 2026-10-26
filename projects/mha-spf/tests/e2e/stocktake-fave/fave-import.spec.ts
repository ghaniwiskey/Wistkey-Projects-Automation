import fs from 'node:fs';
import { test, expect, readXlsxDownload, writeXlsx } from '../../fixtures/pages.fixture';

function assetIdsFromExport(rows: string[][]): string[] {
  const headerIndex = rows.findIndex((row) => row.some((cell) => /^(?:LMS\s*)?Asset\s*ID$/i.test(cell.trim())));
  let ids: string[] = [];
  if (headerIndex >= 0) {
    const idColumn = rows[headerIndex].findIndex((cell) => /^(?:LMS\s*)?Asset\s*ID$/i.test(cell.trim()));
    ids = rows.slice(headerIndex + 1).flatMap((row) => {
      const value = row[idColumn]?.trim();
      const match = value?.match(/^(?:Asset ID:\s*)?(\d+)$/i);
      return match ? [match[1]] : [];
    });
  } else {
    ids = rows.flatMap((row) => row.flatMap((cell) => {
      const match = cell.trim().match(/^Asset ID:\s*(\d+)$/i);
      return match ? [match[1]] : [];
    }));
  }
  return [...new Set(ids)];
}

// Import Working Result using runtime records from the chosen cost centre. Larger batches are gated
// to an all-PENDING FAVE with exactly that many assets, so the test can safely bulk-reset them afterward.
test.describe('Stocktake FAVE: Import Working Result', () => {
  test.use({ role: 'vet-ic' });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-036-*.md
  test('SPF-036: vet ic imports a working result file and the assets become sighted / working @regression @writes', async ({
    favePage,
    faveTarget: { costCentre, asset },
  }, testInfo) => {
    test.slow();
    const importCount = Number(process.env.SPF_FAVE_IMPORT_COUNT ?? '1');
    testInfo.skip(!Number.isSafeInteger(importCount) || importCount < 1, `Invalid SPF_FAVE_IMPORT_COUNT: ${process.env.SPF_FAVE_IMPORT_COUNT}`);

    let assetIds = [asset];
    let totalAssets = 0;
    if (importCount > 1) {
      totalAssets = await favePage.detailAssetCount();
      const pending = await favePage.resultCount('PENDING');
      testInfo.skip(
        totalAssets < importCount || pending !== totalAssets,
        `Safe batch import needs at least ${importCount} assets in ${costCentre}, with all assets PENDING; found ${totalAssets} total and ${pending} PENDING.`,
      );
      const { rows } = await readXlsxDownload(await favePage.export(), testInfo.outputPath('fave-export.xlsx'));
      const exportedAssetIds = assetIdsFromExport(rows);
      testInfo.skip(exportedAssetIds.length < importCount, `FAVE export yielded ${exportedAssetIds.length} unique asset IDs; need ${importCount}.`);
      assetIds = exportedAssetIds.slice(0, importCount);
      // Prove the bulk-reset UI works while all assets are still PENDING, before the import can change anything.
      await favePage.resetAllToPending(totalAssets);
    }

    // The manual's template: header A1 "LMSAssetID", one numeric asset ID per row.
    const file = testInfo.outputPath(`fave-working-result-${importCount}.xlsx`);
    fs.writeFileSync(file, writeXlsx([['LMSAssetID'], ...assetIds.map((id) => [Number(id)])]));
    let importStarted = false;

    try {
      await test.step(`1-2. Open the FAVE on ${costCentre} with ${importCount} PENDING asset(s), choose the import file`, async () => {
        if (importCount === 1) {
          // A result left by another test would make step 4 pass without the import doing anything.
          await favePage.ensurePending(costCentre, asset);
          await favePage.searchDetails(asset);
          await expect(favePage.resultOf(asset)).toHaveText(/^\s*PENDING\b/);
        }
        await favePage.openImport();
        await favePage.chooseImportFile(file);
        expect(await favePage.importPreviewCount()).toBe(importCount);
        await expect(favePage.importRow(assetIds[0])).toHaveCount(1);
      });

      await test.step('3. Import', async () => {
        importStarted = true;
        expect(await favePage.submitImport()).toBe('The import record(s) have been successful.');
      });

      // Steps 4-5 retest BUG-007: imported results must be uppercase SIGHTED, not "Sighted".
      await test.step(`4. All ${importCount} assets are SIGHTED / WORKING`, async () => {
        await favePage.openForCostCentre(costCentre);
        expect(await favePage.resultCount('SIGHTED')).toBe(importCount);
        await favePage.searchDetails(assetIds[0]);
        await expect(favePage.resultOf(assetIds[0])).toContainText('SIGHTED');
        await expect(favePage.resultOf(assetIds[0])).toContainText('WORKING');
        await expect(favePage.followUpOf(assetIds[0])).toHaveText('No Further Action');
        await expect(favePage.fsscOf(assetIds[0])).toHaveText('Working condition');
      });

      await test.step('5. Update Result is pre-loaded with the imported result', async () => {
        await favePage.openUpdateResult(assetIds[0]);
        await expect(favePage.sightedResult).toHaveText('SIGHTED');
        await expect(favePage.assetCondition).toHaveText('WORKING');
        await expect(favePage.followUp).toHaveText('No Further Action');
      });
    } finally {
      if (importStarted) {
        if (importCount === 1) await favePage.ensurePending(costCentre, asset);
        else await favePage.resetAllToPending(totalAssets);
      }
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
