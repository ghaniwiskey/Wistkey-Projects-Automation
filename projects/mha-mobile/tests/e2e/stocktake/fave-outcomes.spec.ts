import { test, expect, webExpect, MOBILE_ROLES, QA_PREFIX, WEB_ROLES, sameName, unique } from '../../fixtures/pages.fixture';
import type { FaveTarget, WebFavePage } from '../../pages/web/web-fave.page';
import type { AssignmentRow } from '../../pages/web/web-assignment.page';

// Test cases: projects/mha-mobile/cases/stocktake/MHM-017-*.md, MHM-018-*.md
// Same data as MHM-005: faveTarget finds the asset at runtime (VET IC) and resets its result to PENDING
// afterwards, switching back to VET IC first.
test.use({ webRole: 'vet-ic' });

/** MHA web: the FAVE asset is PENDING with the officer as stocktaker (assigns it when needed). */
async function expectReadyOnWeb(webFavePage: WebFavePage, t: FaveTarget, officer: string): Promise<void> {
  expect(sameName(t.stocktaker, officer)).toBe(true);
  await webFavePage.openAsset(t.costCentre, t.asset);
  if (t.needsAssignment) {
    expect(await webFavePage.assignStocktaker(t.asset, t.stocktaker)).toBe('The stocktaker has been assigned.');
    await webFavePage.searchDetails(t.asset);
  }
  await webExpect(webFavePage.stocktakerOf(t.asset)).toHaveText(t.stocktaker);
  await webExpect(webFavePage.resultOf(t.asset)).toHaveText(/^\s*PENDING\s*$/);
}

test('MHM-017: fave not sighted result submitted on the mobile app opens an investigation on mha web @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  faveTarget,
  webFavePage,
  stocktakeListScreen,
  faveScreen,
  stocktakeDetailScreen,
}) => {
  test.setTimeout(8 * 60_000);
  const { faveNo, costCentre, asset, stocktaker } = faveTarget;
  const remarks = `${QA_PREFIX} not sighted ${unique()}`;

  await test.step(`1. MHA web: ${asset} (${faveNo}, ${costCentre}) is PENDING for ${stocktaker}`, async () => {
    await expectReadyOnWeb(webFavePage, faveTarget, mobileOfficer);
  });
  await test.step(`2. Phone: Stocktaker | ${costCentre}, ${faveNo} online, open the asset`, async () => {
    await mobileHome.switchTo(MOBILE_ROLES.stocktaker, costCentre);
    await mobileHome.openTile('Stocktake');
    await stocktakeListScreen.expectLoaded();
    await stocktakeListScreen.openOnline(faveNo);
    await faveScreen.expectLoaded();
    await faveScreen.findAsset(asset);
    await faveScreen.openAsset(asset);
    await stocktakeDetailScreen.expectLoaded(asset);
  });
  await test.step('3. Sighted stays off: Asset Condition offers nothing; type remarks, SAVE (no question)', async () => {
    await expect(stocktakeDetailScreen.sighted).not.toBeChecked();
    expect(await stocktakeDetailScreen.conditionOptions()).toEqual([]);
    await stocktakeDetailScreen.typeRemarks(remarks);
    await stocktakeDetailScreen.saveNotSighted();
    await faveScreen.expectLoaded();
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('1', { timeout: 30_000 });
  });
  await test.step('4. REVIEW > Submit; REVIEW goes back to 0', async () => {
    await faveScreen.submitReview();
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('0', { timeout: 60_000 });
  });

  await test.step('5. MHA web: NOT SIGHTED, Not Found, for Investigation, Under investigation', async () => {
    await webFavePage.openAsset(costCentre, asset);
    await webExpect(webFavePage.resultOf(asset)).toHaveText(/^\s*NOT SIGHTED\s*$/);
    await webExpect(webFavePage.followUpOf(asset)).toHaveText('Not Found, for Investigation');
    await webExpect(webFavePage.fsscOf(asset)).toHaveText('Under investigation');
    await webExpect(webFavePage.stocktakerOf(asset)).toHaveText(stocktaker);
  });
  await test.step('5. Update Result: FAVE Status OPEN, Location Status CLOSED, the phone\'s remarks', async () => {
    await webFavePage.openUpdateResult(asset);
    expect(await webFavePage.readResult()).toMatchObject({
      sighted: 'NOT SIGHTED',
      followUp: 'Not Found, for Investigation',
      remarks,
      fssc: 'Under investigation',
      faveStatus: 'OPEN',
      locationStatus: 'CLOSED',
    });
  });
  await test.step('6. Cleanup: result back to PENDING', async () => {
    expect(await webFavePage.submitPending()).toBe('The stocktake result is updated.');
  });
});

test('MHM-018: fave sighting at a wrong location on the mobile app raises a relocation for logs1 @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  faveTarget,
  webFavePage,
  webAssignmentPage,
  stocktakeListScreen,
  faveScreen,
  stocktakeDetailScreen,
}) => {
  test.setTimeout(10 * 60_000);
  const { faveNo, costCentre, asset, stocktaker } = faveTarget;
  const remarks = `${QA_PREFIX} wrong location ${unique()}`;
  const newRoom = `Q${unique().slice(-4).toUpperCase()}`; // Room No holds 5 characters
  const newRemarks = `${QA_PREFIX} new location`;
  let postalCode = '';
  let address = '';
  let group = '';

  await test.step(`MHA web: ${asset} (${faveNo}, ${costCentre}) is PENDING for ${stocktaker}`, async () => {
    await expectReadyOnWeb(webFavePage, faveTarget, mobileOfficer);
  });
  await test.step(`1. Phone: Stocktaker | ${costCentre}, ${faveNo} online, open the asset`, async () => {
    await mobileHome.switchTo(MOBILE_ROLES.stocktaker, costCentre);
    await mobileHome.openTile('Stocktake');
    await stocktakeListScreen.expectLoaded();
    await stocktakeListScreen.openOnline(faveNo);
    await faveScreen.expectLoaded();
    await faveScreen.findAsset(asset);
    await faveScreen.openAsset(asset);
    await stocktakeDetailScreen.expectLoaded(asset);
    ({ postalCode, address } = await stocktakeDetailScreen.currentLocation());
    expect(postalCode).toMatch(/^\d{6}$/);
  });
  await test.step(`2. Sighted on, Correct Location off; new location in Room ${newRoom}; SAVE > CONFIRM`, async () => {
    await stocktakeDetailScreen.setSighted();
    // Same postal code and address as now, another Room No: enough for the server to raise a relocation.
    group = await stocktakeDetailScreen.setNewLocation({ postalCode, address, room: newRoom, remarks: newRemarks });
    await stocktakeDetailScreen.typeRemarks(remarks);
    await stocktakeDetailScreen.saveSighted();
    await faveScreen.expectLoaded();
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('1', { timeout: 30_000 });
  });
  await test.step('3. REVIEW > Submit; REVIEW goes back to 0', async () => {
    await faveScreen.submitReview();
    await expect(faveScreen.tabCount('REVIEW')).toHaveText('0', { timeout: 60_000 });
  });

  await test.step('4. MHA web (VET IC): SIGHTED, Correct Location unticked, Location Status OPEN', async () => {
    await webFavePage.openAsset(costCentre, asset);
    await webExpect(webFavePage.resultOf(asset)).toHaveText(/^\s*SIGHTED\s+WORKING\s*$/);
    await webFavePage.openUpdateResult(asset);
    expect(await webFavePage.readResult()).toMatchObject({
      sighted: 'SIGHTED',
      condition: 'WORKING',
      remarks,
      faveStatus: 'CLOSED',
      locationStatus: 'OPEN',
      correctLocation: false,
    });
  });

  let relocation: AssignmentRow | undefined;
  try {
    await test.step('5. MHA web (LOGS1): a SUBMITTED RELOCATE by the officer with the phone\'s new location', async () => {
      await webAssignmentPage.useRole(WEB_ROLES.logs1);
      relocation = await webAssignmentPage.newestFor(asset);
      expect(relocation, `a transaction for ${asset}`).toBeTruthy();
      expect(sameName(relocation?.createdBy ?? '', mobileOfficer)).toBe(true);
      expect(relocation).toMatchObject({ type: 'RELOCATE', costCentre, approverRole: WEB_ROLES.logs1, status: 'SUBMITTED' });
      await webAssignmentPage.open((relocation as AssignmentRow).no);
      const loc = await webAssignmentPage.readNewLocation();
      expect(loc).toMatchObject({ postalCode, roomNo: newRoom, remarks: newRemarks });
      expect(loc.group).toContain(group);
    });
  } finally {
    // Reject it (an approved one would lock the FAVE result, mha-spf BUG-009), then the fixture resets PENDING.
    if (relocation?.status === 'SUBMITTED') {
      await test.step('6. Cleanup: reject the relocation', async () => {
        await webAssignmentPage.open((relocation as AssignmentRow).no);
        expect(await webAssignmentPage.reject('Others', `${QA_PREFIX} cleanup of a test relocation`)).toBe('Assignment has been rejected.');
      });
    }
  }
});
