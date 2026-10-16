import { test, expect, webExpect, MOBILE_ROLES, QA_PREFIX, unique } from '../../fixtures/pages.fixture';
import type { FaveResult } from '../../pages/web/web-fave.page';

// Test case: projects/mha-mobile/cases/stocktake/MHM-011-*.md
// Same data as MHM-005 (faveTarget, reset to PENDING afterwards); the network is switched with adb and
// always turned back on by the `network` fixture.
test.use({ webRole: 'vet-ic' });

test('MHM-011: fave sighting made offline is uploaded after reconnecting and shows on mha web @regression @writes', async ({
  mobileHome,
  faveTarget,
  network,
  webFavePage,
  stocktakeListScreen,
  faveScreen,
  stocktakeDetailScreen,
}) => {
  test.setTimeout(8 * 60_000);
  const { faveNo, costCentre, asset, stocktaker } = faveTarget;
  const remarks = `${QA_PREFIX} offline ${unique()}`;

  await test.step(`MHA web: ${asset} is assigned to ${stocktaker}`, async () => {
    await webFavePage.openAsset(costCentre, asset);
    if (faveTarget.needsAssignment) await webFavePage.assignStocktaker(asset, stocktaker);
  });
  await test.step(`1. Phone: Stocktaker | ${costCentre}, open ${faveNo} in OFFLINE MODE`, async () => {
    await mobileHome.switchTo(MOBILE_ROLES.stocktaker, costCentre);
    await mobileHome.openTile('Stocktake');
    await stocktakeListScreen.expectLoaded();
    await stocktakeListScreen.openOffline(faveNo);
    await faveScreen.expectLoaded();
  });
  await test.step('2. Network off', async () => {
    network.set(false);
  });
  await test.step('3. Sight the asset without network', async () => {
    await faveScreen.findAsset(asset);
    await faveScreen.openAsset(asset);
    await stocktakeDetailScreen.expectLoaded(asset);
    await stocktakeDetailScreen.setSighted();
    await stocktakeDetailScreen.typeRemarks(remarks);
    await stocktakeDetailScreen.saveSighted();
  });
  await test.step('The sighting is kept on the phone; no Submit while offline', async () => {
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('1', { timeout: 30_000 });
    await faveScreen.openTab('REVIEW');
    await expect(faveScreen.submitButton).toBeHidden();
  });
  await test.step('4. Network on, Submit', async () => {
    network.set(true);
    await faveScreen.waitForSubmit();
    await faveScreen.submitButton.tap();
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('0', { timeout: 60_000 });
  });

  let result: FaveResult | undefined;
  await test.step('5. MHA web: the offline result arrived', async () => {
    await webFavePage.openAsset(costCentre, asset);
    await webExpect(webFavePage.resultOf(asset)).toHaveText(/^\s*SIGHTED\s+WORKING\s*$/);
    await webExpect(webFavePage.stocktakerOf(asset)).toHaveText(stocktaker);
    await webFavePage.openUpdateResult(asset);
    result = await webFavePage.readResult();
    expect(result).toMatchObject({
      sighted: 'SIGHTED',
      condition: 'WORKING',
      followUp: 'No Further Action',
      remarks,
      fssc: 'Working condition',
      faveStatus: 'CLOSED',
    });
  });
  await test.step('6. Cleanup: result back to PENDING', async () => {
    expect(await webFavePage.submitPending()).toBe('The stocktake result is updated.');
  });
});
