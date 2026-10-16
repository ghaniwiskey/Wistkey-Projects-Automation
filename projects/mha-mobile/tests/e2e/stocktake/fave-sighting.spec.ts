import { test, expect, webExpect, MOBILE_ROLES, QA_PREFIX, sameName, unique } from '../../fixtures/pages.fixture';
import type { StocktakeAsset } from '../../pages/mobile/stocktake.screen';
import type { FaveResult } from '../../pages/web/web-fave.page';

// Test case: projects/mha-mobile/cases/stocktake/MHM-005-*.md
// MHA web as VET IC sets up (stocktaker assignment) and checks the result; the fixture faveTarget finds the
// asset at runtime and resets its result to PENDING afterwards.
test.use({ webRole: 'vet-ic' });

test('MHM-005: fave sighting submitted on the mobile app shows in mha web @smoke @writes', async ({
  mobileHome,
  mobileOfficer,
  faveTarget,
  webFavePage,
  stocktakeListScreen,
  faveScreen,
  stocktakeDetailScreen,
}) => {
  // Web lookup + phone + web check; the phone part must finish within the ~10-minute mobile session (BUG-001).
  test.setTimeout(8 * 60_000);
  const { faveNo, costCentre, asset, stocktaker } = faveTarget;
  const remarks = `${QA_PREFIX} ${unique()}`;
  let webIds = { assetId2: '', serial: '' };

  await test.step(`1. MHA web: ${asset} (${faveNo}, ${costCentre}) has ${stocktaker} as stocktaker`, async () => {
    expect(sameName(stocktaker, mobileOfficer)).toBe(true);
    await webFavePage.openAsset(costCentre, asset);
    if (faveTarget.needsAssignment) {
      expect(await webFavePage.assignStocktaker(asset, stocktaker)).toBe('The stocktaker has been assigned.');
      await webFavePage.searchDetails(asset);
    }
    await webExpect(webFavePage.stocktakerOf(asset)).toHaveText(stocktaker);
    await webExpect(webFavePage.resultOf(asset)).toHaveText(/^\s*PENDING\s*$/);
    webIds = await webFavePage.idsOf(asset);
  });

  await test.step(`2. Phone: Stocktaker | ${costCentre}, open ${faveNo} online`, async () => {
    await mobileHome.switchTo(MOBILE_ROLES.stocktaker, costCentre);
    await mobileHome.openTile('Stocktake');
    await stocktakeListScreen.expectLoaded();
    await stocktakeListScreen.openOnline(faveNo);
    await faveScreen.expectLoaded();
  });
  await test.step('The FAVE shows SELECT / VERIFY / REVIEW with the asset in SELECT', async () => {
    await faveScreen.findAsset(asset);
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('0');
  });

  let shown: StocktakeAsset = { assetNo: '', assetId2: '', serial: '' };
  await test.step('3. Open the asset', async () => {
    await faveScreen.openAsset(asset);
    await stocktakeDetailScreen.expectLoaded(asset);
    shown = await stocktakeDetailScreen.readAsset();
  });
  await test.step('StockTake Detail shows the asset as MHA web does', async () => {
    expect(shown).toEqual({ assetNo: asset, assetId2: webIds.assetId2, serial: webIds.serial });
  });

  await test.step('4. Sighted on, condition WORKING, remarks, SAVE > CONFIRM', async () => {
    await stocktakeDetailScreen.setSighted();
    await expect(stocktakeDetailScreen.correctLocation).toBeChecked();
    await stocktakeDetailScreen.pickCondition('WORKING');
    await stocktakeDetailScreen.typeRemarks(remarks);
    await stocktakeDetailScreen.saveSighted();
  });
  await test.step('The sighting moves to REVIEW', async () => {
    await faveScreen.expectLoaded();
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('1', { timeout: 30_000 });
  });

  await test.step('5. REVIEW > Submit', async () => {
    await faveScreen.submitReview();
  });
  await test.step('REVIEW goes back to 0', async () => {
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('0', { timeout: 60_000 });
  });

  await test.step('6. MHA web: the Details row shows the mobile result', async () => {
    await webFavePage.openAsset(costCentre, asset);
    await webExpect(webFavePage.resultOf(asset)).toHaveText(/^\s*SIGHTED\s+WORKING\s*$/);
    await webExpect(webFavePage.followUpOf(asset)).toHaveText('No Further Action');
    await webExpect(webFavePage.fsscOf(asset)).toHaveText('Working condition');
    await webExpect(webFavePage.stocktakerOf(asset)).toHaveText(stocktaker);
  });
  let result: FaveResult | undefined;
  await test.step('6. Update Result shows everything the phone sent', async () => {
    await webFavePage.openUpdateResult(asset);
    result = await webFavePage.readResult();
    expect(result).toEqual({
      sighted: 'SIGHTED',
      condition: 'WORKING',
      followUp: 'No Further Action',
      remarks,
      fssc: 'Working condition',
      faveStatus: 'CLOSED',
      locationStatus: 'CLOSED',
      correctLocation: true,
    });
  });

  await test.step('7. Cleanup: result back to PENDING', async () => {
    expect(await webFavePage.submitPending()).toBe('The stocktake result is updated.');
    await webFavePage.searchDetails(asset);
    await webExpect(webFavePage.resultOf(asset)).toHaveText(/^\s*PENDING\s*$/);
  });
});
