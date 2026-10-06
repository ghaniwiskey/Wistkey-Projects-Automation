import { test, expect, ASSETS, ASSIGN_ROLES, OFFICER, OTHER_FALO, ROLES, unique } from '../../fixtures/pages.fixture';

const asset = ASSETS.writable;

// Write tests on one dedicated asset. Every test starts and ends with no SUBMITTED transaction on it,
// so it stays selectable. Emails may be sent to the approvers (UAT).
test.describe('Asset Assignment (writes)', () => {
  test.use({ role: 'logs1' });

  test.beforeEach(async ({ cancelOpenAssignments }) => {
    test.slow();
    await cancelOpenAssignments(asset.id);
  });

  test.afterEach(async ({ assignmentPage, cancelOpenAssignments }) => {
    await assignmentPage.switchRole(ROLES.logs1);
    await cancelOpenAssignments(asset.id);
  });

  // Test case: projects/mha-spf/cases/asset-assignment/SPF-008-*.md
  test('SPF-008: logs1 relocates an asset and the relocation is auto-approved @regression @writes', async ({
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

  // Test case: projects/mha-spf/cases/asset-assignment/SPF-009-*.md
  test('SPF-009: logs1 assigns an asset to a falo and it is auto-approved @regression @writes', async ({
    assignmentCreatePage,
    assignmentPage,
    assetListingPage,
    assetDetailsPage,
  }) => {
    let transactionNo = '';

    await test.step('1-3. Assign to FALO', async () => {
      const result = await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.falo, assignee: OFFICER });
      transactionNo = result.transactionNo;
      expect(result.message).toMatch(/^Asset Assignment #ASG\d+ is created and approved\.$/);
    });

    await test.step('Transaction is ASSIGN and APPROVED', async () => {
      await assignmentPage.find(transactionNo);
      await expect(assignmentPage.type(transactionNo)).toHaveText('ASSIGN');
      await expect(assignmentPage.status(transactionNo)).toHaveText('APPROVED');
    });

    await test.step('4. Ownership shows the FALO', async () => {
      await assetListingPage.find(asset.id);
      await assetListingPage.openAsset(asset.id);
      await assetDetailsPage.openTab('Ownership');
      await expect(assetDetailsPage.field('Current FALO', assetDetailsPage.activePanel)).toHaveText(OFFICER);
    });
  });

  test.describe('FALO return', () => {
    // Precondition for SPF-010/011: the asset belongs to the FALO (auto-approved LOGS1 > FALO).
    test.beforeEach(async ({ assignmentCreatePage }) => {
      await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.falo, assignee: OFFICER });
    });

    // Test case: projects/mha-spf/cases/asset-assignment/SPF-010-*.md
    test('SPF-010: falo returns an asset to logs1 and logs1 approves it @regression @writes', async ({
      assignmentCreatePage,
      assignmentPage,
      assignmentFormPage,
      assetListingPage,
      assetDetailsPage,
    }) => {
      let transactionNo = '';

      await test.step('1-2. As FALO, assign back to LOGS1', async () => {
        await assignmentCreatePage.switchRole(ROLES.falo);
        const result = await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.logs1, assignee: OFFICER });
        transactionNo = result.transactionNo;
        expect(result.message).toMatch(/^Asset Assignment #ASG\d+ is created and pending approval\.$/);
      });

      await test.step('3. As LOGS1 the transaction waits for LOGS1 approval', async () => {
        await assignmentPage.switchRole(ROLES.logs1);
        await assignmentPage.find(transactionNo);
        await expect(assignmentPage.status(transactionNo)).toHaveText('SUBMITTED');
        await expect(assignmentPage.approverRole(transactionNo)).toHaveText(ROLES.logs1);
        await assignmentPage.open(transactionNo);
        await assignmentFormPage.expectLoaded(transactionNo);
        await expect(assignmentFormPage.approveButton).toBeVisible();
        await expect(assignmentFormPage.rejectButton).toBeVisible();
        await expect(assignmentFormPage.cancelButton).toBeVisible();
      });

      await test.step('4. Approve', async () => {
        expect(await assignmentFormPage.approve()).toBe('Assignment has been approved');
        await assignmentPage.find(transactionNo);
        await expect(assignmentPage.status(transactionNo)).toHaveText('APPROVED');
      });

      await test.step('LOGS1 owns the asset', async () => {
        await assetListingPage.find(asset.id);
        await assetListingPage.openAsset(asset.id);
        await assetDetailsPage.openTab('Ownership');
        await expect(assetDetailsPage.field('Current LOGS1', assetDetailsPage.activePanel)).toHaveText(OFFICER);
      });
    });

    // Test case: projects/mha-spf/cases/asset-assignment/SPF-011-*.md
    test('SPF-011: logs1 rejects a falo return with a reason @regression @writes', async ({
      assignmentCreatePage,
      assignmentPage,
      assignmentFormPage,
    }) => {
      let transactionNo = '';

      await test.step('1. As FALO, assign back to LOGS1', async () => {
        await assignmentCreatePage.switchRole(ROLES.falo);
        ({ transactionNo } = await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.logs1, assignee: OFFICER }));
      });

      await test.step('2-3. As LOGS1, reject with Incorrect Assignee', async () => {
        await assignmentPage.switchRole(ROLES.logs1);
        await assignmentPage.open(transactionNo);
        expect(await assignmentFormPage.reject('Incorrect Assignee')).toBe('Assignment has been rejected.');
      });

      await test.step('Transaction is REJECTED with the reason', async () => {
        await assignmentPage.open(transactionNo);
        await expect(assignmentFormPage.status).toHaveText('REJECTED');
        await expect(assignmentFormPage.content).toContainText('Rejected By');
        await expect(assignmentFormPage.content).toContainText('Incorrect Assignee');
      });
    });
  });

  // Test case: projects/mha-spf/cases/asset-assignment/SPF-018-*.md
  test('SPF-018: logs1 recalls an asset from another falo and the uro approval clears the falo @regression @writes', async ({
    assignmentCreatePage,
    assignmentPage,
    assignmentFormPage,
    assetListingPage,
    assetDetailsPage,
  }) => {
    let transactionNo = '';

    await test.step(`1. Assign to another FALO (${OTHER_FALO})`, async () => {
      const result = await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.falo, assignee: OTHER_FALO });
      expect(result.message).toMatch(/is created and approved\.$/);
      await assetListingPage.find(asset.id);
      await assetListingPage.openAsset(asset.id);
      await assetDetailsPage.openTab('Ownership');
      await expect(assetDetailsPage.field('Current FALO', assetDetailsPage.activePanel)).toHaveText(OTHER_FALO);
    });

    await test.step('2. Recall to LOGS1 (needs URO approval)', async () => {
      const result = await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.logs1, assignee: OFFICER });
      transactionNo = result.transactionNo;
      expect(result.message).toMatch(/is created and pending approval\.$/);
      await assignmentPage.find(transactionNo);
      await expect(assignmentPage.status(transactionNo)).toHaveText('SUBMITTED');
      await expect(assignmentPage.approverRole(transactionNo)).toHaveText(ROLES.uro);
    });

    await test.step('3. As URO, approve', async () => {
      await assignmentPage.switchRole(ROLES.uro);
      await assignmentPage.open(transactionNo);
      await expect(assignmentFormPage.approveButton).toBeVisible();
      await expect(assignmentFormPage.rejectButton).toBeVisible();
      expect(await assignmentFormPage.approve()).toBe('Assignment has been approved');
      await expect(assignmentFormPage.status).toHaveText('APPROVED');
    });

    await test.step('4. LOGS1 owns the asset and the FALO is cleared', async () => {
      await assignmentPage.switchRole(ROLES.logs1);
      await assetListingPage.find(asset.id);
      await assetListingPage.openAsset(asset.id);
      await assetDetailsPage.openTab('Ownership');
      await expect(assetDetailsPage.field('Current LOGS1', assetDetailsPage.activePanel)).toHaveText(OFFICER);
      await expect(assetDetailsPage.field('Current FALO', assetDetailsPage.activePanel)).toHaveText('-');
    });
  });

  // Test case: projects/mha-spf/cases/asset-assignment/SPF-012-*.md
  test('SPF-012: owner cancels a submitted assignment with a reason @regression @writes', async ({
    assignmentCreatePage,
    assignmentPage,
    assignmentFormPage,
  }) => {
    let transactionNo = '';

    await test.step('1. Assign to LOGS1 (needs URO approval)', async () => {
      const result = await assignmentCreatePage.create({ type: 'Assign', assetId: asset.id, role: ASSIGN_ROLES.logs1, assignee: OFFICER });
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
