import { test, expect, ASSIGN_ROLES, ROLES, unique } from '../../fixtures/pages.fixture';

// HTA has no FALO role, so only LOGS1 flows are here (no assign to / return from FALO, no recall).
// Write tests on one asset found at runtime (writableAsset fixture: selectable in Assign, preferably
// owned by the test account as LOGS1), shared by all tests of the run. Every test starts and ends with no SUBMITTED transaction on it,
// so it stays selectable. Emails may be sent to the approvers (UAT).
test.describe('Asset Assignment (writes)', () => {
  test.use({ role: 'logs1' });

  let asset = { id: '' };
  /** The test account's officer (LOGS1), read from the page header. */
  let officer = '';

  test.beforeEach(async ({ cancelOpenAssignments, writableAsset, officer: name }) => {
    test.slow();
    asset = { id: writableAsset };
    officer = name;
    await cancelOpenAssignments(asset.id);
  });

  test.afterEach(async ({ assignmentPage, cancelOpenAssignments }) => {
    await assignmentPage.switchRole(ROLES.logs1);
    await cancelOpenAssignments(asset.id);
  });

  // Test case: projects/mha-hta/cases/asset-assignment/HTA-008-*.md
  test('HTA-008: logs1 relocates an asset and the relocation is auto-approved @regression @writes', async ({
    assignmentCreatePage,
    assignmentPage,
    assetListingPage,
    assetDetailsPage,
  }) => {
    const remarks = unique('relocate');
    let transactionNo = '';

    await test.step('1-3. Relocate with new remarks', async () => {
      const result = await assignmentCreatePage.create({ type: 'Relocate', assetId: asset.id, remarks });
      transactionNo = result.transactionNo;
      expect(result.message).toMatch(/^Relocation request #ASG\d+ is created/);
      await expect(assignmentCreatePage.endStep).toContainText('1 Asset is processed for Asset Relocation.');
    });

    await test.step('4. Transaction is RELOCATE and APPROVED', async () => {
      await assignmentPage.find(transactionNo);
      await expect(assignmentPage.type(transactionNo)).toHaveText('RELOCATE');
      await expect(assignmentPage.status(transactionNo)).toHaveText('APPROVED');
    });

    await test.step('5. Asset location shows the new remarks', async () => {
      await assetListingPage.find(asset.id);
      await assetListingPage.openAsset(asset.id);
      await assetDetailsPage.openTab('Location');
      await expect(assetDetailsPage.field('Remarks', assetDetailsPage.activePanel)).toHaveText(remarks);
    });
  });

  // Test case: projects/mha-hta/cases/asset-assignment/HTA-012-*.md
  test('HTA-012: owner cancels a submitted assignment with a reason @regression @writes', async ({
    assignmentCreatePage,
    assignmentPage,
    assignmentFormPage,
  }) => {
    let transactionNo = '';

    await test.step('1. Assign to LOGS1 (needs URO approval)', async () => {
      const result = await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.logs1, assignee: officer });
      transactionNo = result.transactionNo;
      expect(result.message).toMatch(/is created and pending approval\.$/);
      await assignmentPage.find(transactionNo);
      await expect(assignmentPage.status(transactionNo)).toHaveText('SUBMITTED');
      await expect(assignmentPage.approverRole(transactionNo)).toHaveText('Unit Resource Officer');
    });

    await test.step('2-3. Cancel with Others but no remarks is refused', async () => {
      await assignmentPage.open(transactionNo);
      await assignmentFormPage.startCancel('Others');
      await assignmentFormPage.modalSubmit(assignmentFormPage.cancelModal).click();
      await expect(assignmentFormPage.cancelModal).toContainText('Remarks is required');
      await expect(assignmentFormPage.cancelModal).toBeVisible();
    });

    await test.step('4. Cancel with remarks', async () => {
      await assignmentFormPage.modalRemarks(assignmentFormPage.cancelModal).fill(unique('cancel'));
      await assignmentFormPage.modalSubmit(assignmentFormPage.cancelModal).click();
      await assignmentFormPage.confirm(/Are you sure to cancel/);
      expect(await assignmentFormPage.acknowledge(/cancelled/)).toBe('Assignment has been cancelled.');
      await assignmentPage.find(transactionNo);
      await expect(assignmentPage.status(transactionNo)).toHaveText('CANCELLED');
    });
  });
});
