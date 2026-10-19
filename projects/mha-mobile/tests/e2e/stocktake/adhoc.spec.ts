import { test, expect, MOBILE_ROLES, QA_PREFIX, sameName, unique } from '../../fixtures/pages.fixture';

// Test case: projects/mha-mobile/cases/stocktake/MHM-019-*.md
// Reuses the newest one-off "QA auto mobile adhoc ..." ad hoc stocktake (one-offs cannot be cancelled, so
// none is created per run): the test (re)assigns its stocktaker, resets its result to PENDING, sights the
// asset on the phone and resets the result to PENDING again afterwards.
// Needs the Stocktaker role's MOBILE function "Stocktake (Ad Hoc)" (User > Role Listing on MHA web); it was
// off on UAT until 2026-10-19 (BUG-003).
test.use({ webRole: 'logs1' });

test('MHM-019: ad hoc stocktake assigned on mha web is sighted on the stocktaker\'s mobile app @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  webAdHocPage,
  webAssetPage,
  stocktakeListScreen,
  faveScreen,
  stocktakeDetailScreen,
}) => {
  test.setTimeout(10 * 60_000);
  const prefix = `${QA_PREFIX} adhoc`;
  const remarks = `${QA_PREFIX} adhoc sighted ${unique()}`;
  let stocktakeNo = '';
  let asset = '';
  let costCentre = '';

  await test.step(`1. MHA web (LOGS1): the newest one-off "${prefix}" has ${mobileOfficer} as stocktaker`, async () => {
    const found = await webAdHocPage.findOneOff(prefix);
    test.skip(!found, `No one-off ad hoc stocktake named "${prefix} ..." on MHA web. Create one with one asset of a unit where the mobile officer is Stocktaker (Ad Hoc Setup > Create, One-Off, Manual).`);
    stocktakeNo = found as string;
    await webAdHocPage.open(stocktakeNo);
    const first = await webAdHocPage.firstAssignment();
    asset = first.asset;
    if (!sameName(first.stocktaker, mobileOfficer)) {
      expect(await webAdHocPage.assignStocktaker(asset, mobileOfficer)).toBe('The stocktaker has been assigned.');
    }
  });
  await test.step('2. MHA web: the asset is PENDING', async () => {
    await webAdHocPage.open(stocktakeNo);
    await webAdHocPage.ensurePending(asset);
    await webAssetPage.gotoListing();
    await webAssetPage.openAsset(asset);
    costCentre = (await webAssetPage.readAsset()).costCentre.split('/')[0].trim();
  });

  try {
    await test.step(`3. Phone: Stocktaker | ${costCentre} > Stocktake (Ad Hoc) lists ${stocktakeNo}`, async () => {
      await mobileHome.switchTo(MOBILE_ROLES.stocktaker, costCentre);
      await mobileHome.openTile('Stocktake (Ad Hoc)');
      await stocktakeListScreen.expectLoaded();
    });
    await test.step(`4. Open ${stocktakeNo} online; SELECT has ${asset}`, async () => {
      await stocktakeListScreen.openOnline(stocktakeNo);
      await faveScreen.expectLoaded();
      await faveScreen.findAsset(asset);
    });
    await test.step('5. Open the asset, turn on Sighted, type the remarks, SAVE > CONFIRM', async () => {
      await faveScreen.openAsset(asset);
      await stocktakeDetailScreen.expectLoaded(asset);
      await stocktakeDetailScreen.setSighted();
      await stocktakeDetailScreen.typeRemarks(remarks);
      await stocktakeDetailScreen.saveSighted();
      await expect(faveScreen.tabCount('REVIEW')).toHaveText('1', { timeout: 30_000 });
    });
    await test.step('6. REVIEW > Submit: REVIEW goes back to 0', async () => {
      await faveScreen.submitReview();
      await expect(faveScreen.tabCount('REVIEW')).toHaveText('0', { timeout: 60_000 });
    });
    await test.step(`7. MHA web: ${stocktakeNo} > Details shows ${asset} SIGHTED with the phone's remarks`, async () => {
      await webAdHocPage.open(stocktakeNo);
      expect(await webAdHocPage.resultOf(asset)).toBe('SIGHTED');
      expect(await webAdHocPage.readResult(asset)).toEqual({ result: 'SIGHTED', remarks });
    });
  } finally {
    // Cleanup: the next run needs the asset PENDING again.
    await webAdHocPage.open(stocktakeNo);
    await webAdHocPage.ensurePending(asset);
  }
});