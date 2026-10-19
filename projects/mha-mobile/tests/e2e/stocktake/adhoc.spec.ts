import { test, expect, MOBILE_ROLES, QA_PREFIX, sameName } from '../../fixtures/pages.fixture';

// Test case: projects/mha-mobile/cases/stocktake/MHM-019-*.md
// Reuses the newest one-off "QA auto mobile adhoc ..." ad hoc stocktake (one-offs cannot be cancelled, so
// none is created per run); the test only (re)assigns its stocktaker and resets its result to PENDING.
test.use({ webRole: 'logs1' });

test('MHM-019: ad hoc stocktake assigned on mha web reaches the stocktaker\'s mobile app @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  webAdHocPage,
  webAssetPage,
  stocktakeListScreen,
}) => {
  test.setTimeout(8 * 60_000);
  const prefix = `${QA_PREFIX} adhoc`;
  let stocktakeNo = '';
  let asset = '';
  let costCentre = '';

  await test.step(`1. MHA web (LOGS1): the newest one-off "${prefix}" has ${mobileOfficer} as stocktaker`, async () => {
    const found = await webAdHocPage.findOneOff(prefix);
    test.skip(!found, `No one-off ad hoc stocktake named "${prefix} ..." on MHA web. Create one with one asset of a unit the phone offers (Ad Hoc Setup > Create, One-Off, Manual).`);
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

  await test.step(`3. Phone: Stocktaker | ${costCentre} offers ${stocktakeNo} (Stocktake Adhoc tile or the Stocktake list)`, async () => {
    await mobileHome.switchTo(MOBILE_ROLES.stocktaker, costCentre);
    // Marked only now, so a setup failure is reported as a failure, not as BUG-003.
    test.fail(true, 'BUG-003: ad hoc stocktakes never reach the mobile app (no Stocktake Adhoc tile, Stocktake lists FAVEs only)');
    if ((await mobileHome.tileNames()).includes('Stocktake Adhoc')) return;
    await mobileHome.openTile('Stocktake');
    await stocktakeListScreen.expectLoaded();
    expect(await stocktakeListScreen.stocktakeNumbers()).toContain(stocktakeNo);
  });
});
