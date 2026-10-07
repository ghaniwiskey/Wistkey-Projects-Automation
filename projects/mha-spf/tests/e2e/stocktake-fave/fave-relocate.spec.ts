import { test, expect, ROLES, unique } from '../../fixtures/pages.fixture';

// FAVE "incorrect location" -> RELOCATE assignment for the asset's LOGS1 -> approval moves the asset.
// Cannot be undone: once the relocation is approved the FAVE result is locked (accepted, BUG-009 wont-fix), so each run
// uses one PENDING asset owned by the test account (fixture faveRelocateTarget skips when none is left).
test.describe('Stocktake FAVE relocation', () => {
  test.use({ role: 'vet-ic' });

  let target: { costCentre: string; asset: string } | undefined;
  let approved = false;

  test.afterEach(async ({ favePage, cancelOpenAssignments }) => {
    if (!target) return;
    // A relocation left SUBMITTED would keep the asset out of every other assignment.
    await favePage.switchRole(ROLES.logs1);
    await cancelOpenAssignments(target.asset);
    // Before approval the result can still be reset (afterwards it is locked; accepted, BUG-009 wont-fix).
    if (!approved) {
      await favePage.switchRole(ROLES['vet-ic']);
      await favePage.ensurePending(target.costCentre, target.asset);
    }
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-039-*.md
  test('SPF-039: fave incorrect location raises a relocation that logs1 approves and the asset location changes @regression @writes', async ({
    faveRelocateTarget,
    favePage,
    assetListingPage,
    assetDetailsPage,
    assignmentPage,
    assignmentFormPage,
    cancelOpenAssignments,
    officer,
  }) => {
    test.slow();
    target = faveRelocateTarget;
    approved = false;
    const { costCentre, asset } = faveRelocateTarget;
    const stamp = Date.now().toString(36);
    let before = { postalCode: '', block: '', level: '', roomNo: '', remarks: '' };
    // Unique values within the field limits (Block 10, Level 3, Room No 5).
    const level = String(100 + (Date.now() % 900));
    const newLocation = { block: `Q${stamp.slice(-9)}`, level, roomNo: `Q${stamp.slice(-4)}`, remarks: unique('fave relocate') };
    let transactionNo = '';

    await test.step(`1. As LOGS1, no open transaction on ${asset}; note its location`, async () => {
      await favePage.switchRole(ROLES.logs1);
      await cancelOpenAssignments(asset);
      await assetListingPage.find(asset);
      await assetListingPage.openAsset(asset);
      before = await assetDetailsPage.readAssetLocation();
      test.skip(!/^\d{4,}$/.test(before.postalCode), `Asset ${asset} has no postal code ("${before.postalCode}") to search`);
      expect(newLocation.level).not.toBe(before.level);
    });

    await test.step(`2-3. As VET IC, ${costCentre} / ${asset}: SIGHTED, WORKING, Correct Location unticked`, async () => {
      await favePage.switchRole(ROLES['vet-ic']);
      await favePage.openForCostCentre(costCentre);
      await favePage.searchDetails(asset);
      await favePage.openUpdateResult(asset);
      await favePage.fillResult({ sighted: 'SIGHTED', condition: 'WORKING' });
      await favePage.setCorrectLocation(false);
      await expect(favePage.followUp).toHaveText('No Further Action');
      await expect(favePage.faveStatus).toHaveValue('CLOSED');
      await expect(favePage.locationStatus).toHaveValue('OPEN');
      await expect(favePage.newLocationHeading).toBeVisible();
    });

    await test.step('4-5. New Asset Location is validated field by field', async () => {
      expect(await favePage.submitResultRejected(/Group \/ NPC \/ Base selection cannot be empty/)).toBe(
        'Group / NPC / Base selection cannot be empty.',
      );
      await favePage.pickFirstNewGroup();
      expect(await favePage.submitResultRejected(/Asset location cannot be empty/)).toBe('Asset location cannot be empty.');
      await favePage.pickNewPostalCode(before.postalCode);
      expect(await favePage.submitResultRejected(/at least one field/)).toBe(
        'You must enter at least one field of Block / Level / Room No / Location Remarks.',
      );
    });

    await test.step('6. Submit with Block, Level, Room No and remarks', async () => {
      await favePage.fillNewLocation(newLocation);
      expect(await favePage.submitResult()).toBe('The stocktake result is updated.');
      await favePage.searchDetails(asset);
      await expect(favePage.resultOf(asset)).toContainText('SIGHTED');
      await expect(favePage.resultOf(asset)).toContainText('WORKING');
    });

    await test.step('7. As LOGS1, Assignment lists one SUBMITTED RELOCATE for the asset', async () => {
      await favePage.switchRole(ROLES.logs1);
      const open = await assignmentPage.openTransactions(asset);
      expect(open, `SUBMITTED transactions of ${asset}`).toHaveLength(1);
      transactionNo = open[0];
      await expect(assignmentPage.type(transactionNo)).toHaveText('RELOCATE');
      await expect(assignmentPage.createdBy(transactionNo)).toHaveText(officer);
      await expect(assignmentPage.approverRole(transactionNo)).toHaveText('Logistics Officer 1');
    });

    await test.step(`8. ${transactionNo || 'The transaction'} carries the FAVE location`, async () => {
      await assignmentPage.open(transactionNo);
      await assignmentFormPage.expectLoaded(transactionNo);
      await expect(assignmentFormPage.value('Transaction Type:')).toHaveText('RELOCATE');
      await expect(assignmentFormPage.status).toHaveText('SUBMITTED');
      await expect(assignmentFormPage.assetRow(asset)).toHaveCount(1);
      const loc = assignmentFormPage.assetLocation;
      await expect(assignmentFormPage.value('Postal Code:', loc)).toHaveText(before.postalCode);
      await expect(assignmentFormPage.value('Block:', loc)).toHaveText(newLocation.block);
      await expect(assignmentFormPage.value('Level:', loc)).toHaveText(newLocation.level);
      await expect(assignmentFormPage.value('Room No.:', loc)).toHaveText(newLocation.roomNo);
      await expect(assignmentFormPage.value('Remarks:', loc)).toHaveText(newLocation.remarks);
      await expect(assignmentFormPage.approveButton).toBeVisible();
    });

    await test.step('9. Approve', async () => {
      expect(await assignmentFormPage.approve()).toBe('Assignment has been approved');
      approved = true;
      await assignmentPage.find(transactionNo);
      await expect(assignmentPage.status(transactionNo)).toHaveText('APPROVED');
    });

    await test.step('10. The asset is at the new location', async () => {
      await assetListingPage.find(asset);
      await assetListingPage.openAsset(asset);
      const after = await assetDetailsPage.readAssetLocation();
      expect(after).toEqual({ postalCode: before.postalCode, ...newLocation });
      expect(after.remarks).not.toBe(before.remarks);
    });
  });
});
