import { test, expect, FAVE, ROLES, unique } from '../../fixtures/pages.fixture';

const SUBMIT_Q = 'Please confirm that you want to submit this FAVE.';
const APPROVE_Q = 'Please confirm that you want to approve this FAVE.';
const ENDORSED = 'Total Stocktake Report (Endorsed)';
const REJECT_Q = 'Please confirm that you want to reject this FAVE.';

// Moves the live FAVE of the first non-approved cost centre (APD) through the approval chain and back. Emails the next level on UAT.
// Before and after each test the FAVE is rejected back down to VET IC. UAO Approve is final, so these
// tests never approve APD (SPF-027 below approves another cost centre).
test.describe('Stocktake FAVE approval (writes)', () => {
  test.use({ role: 'vet-ic' });

  // faveTarget takes the first non-approved cost centre of costCentres and brings it back to VET IC.
  test.beforeEach(async ({ faveTarget }) => {
    test.slow();
    expect(faveTarget.costCentre).toBeTruthy();
  });

  test.afterEach(async ({ returnFaveToVetIc, faveTarget }) => {
    await returnFaveToVetIc(faveTarget.costCentre);
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-025-*.md
  test('SPF-025: vet ic submits the unit fave and uro rejects it back with a reason @regression @writes', async ({ favePage, faveTarget: { costCentre } }) => {
    const remarks = unique('fave reject');

    await test.step('1. VET IC submits the FAVE', async () => {
      await favePage.openForCostCentre(costCentre);
      expect(await favePage.submitFave()).toEqual([SUBMIT_Q, 'Stocktake FAVE has been submitted.']);
      await expect(favePage.stageStatus('Verification Team IC/2IC')).toHaveText('SUBMITTED');
      await expect(favePage.submitFaveButton).toBeHidden();
    });

    await test.step('2. URO can submit or reject', async () => {
      await favePage.reopenAs(ROLES.uro, costCentre);
      await expect(favePage.submitFaveButton).toBeVisible();
      await expect(favePage.rejectButton).toBeVisible();
    });

    await test.step('3-4. Reason and remarks are required', async () => {
      await favePage.openReject();
      await favePage.submitReject();
      await expect(favePage.reasonRequired).toBeVisible();
      await favePage.pickRejectReason('Others');
      await favePage.submitReject();
      await expect(favePage.remarksRequired).toBeVisible();
    });

    await test.step('5. URO rejects with remarks', async () => {
      expect(await favePage.rejectFave('Others', remarks)).toEqual([REJECT_Q, 'Stocktake FAVE has been rejected.']);
    });

    await test.step('6. URO stage REJECTED with the remarks; the cost centre shows the last action', async () => {
      await favePage.openForCostCentre(costCentre);
      await expect(favePage.stageStatus('Unit Resource Officer')).toHaveText('REJECTED');
      await expect(favePage.stageRemarks('Unit Resource Officer')).toHaveText(`Remarks: ${remarks}`);
      await expect(favePage.costCentreStatus(costCentre)).toHaveText('REJECTED');
      await expect(favePage.costCentreRole(costCentre)).toHaveText('Unit Resource Officer');
      await expect(favePage.rejectButton).toBeHidden();
      await expect(favePage.submitFaveButton).toBeHidden();
    });

    await test.step('7. Back with VET IC: Submit is shown again', async () => {
      await favePage.reopenAs(ROLES['vet-ic'], costCentre);
      await expect(favePage.submitFaveButton).toBeVisible();
    });
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-026-*.md
  test('SPF-026: fave goes from vet ic through uro to uao, and uao rejects it back to uro @regression @writes', async ({ favePage, faveTarget: { costCentre } }) => {
    const remarks = unique('fave uao reject');

    await test.step('1. VET IC submits', async () => {
      await favePage.openForCostCentre(costCentre);
      expect((await favePage.submitFave())[1]).toBe('Stocktake FAVE has been submitted.');
    });

    await test.step('2. URO submits to UAO', async () => {
      await favePage.reopenAs(ROLES.uro, costCentre);
      expect(await favePage.submitFave()).toEqual([SUBMIT_Q, 'Stocktake FAVE has been submitted.']);
      await expect(favePage.stageStatus('Unit Resource Officer')).toHaveText('SUBMITTED');
      await expect(favePage.submitFaveButton).toBeHidden();
      await expect(favePage.rejectButton).toBeHidden();
    });

    await test.step('3. UAO can approve or reject', async () => {
      await favePage.reopenAs(ROLES.uao, costCentre);
      await expect(favePage.approveButton).toBeVisible();
      await expect(favePage.rejectButton).toBeVisible();
    });

    await test.step('4. UAO rejects', async () => {
      expect(await favePage.rejectFave('Others', remarks)).toEqual([REJECT_Q, 'Stocktake FAVE has been rejected.']);
      await favePage.openForCostCentre(costCentre);
      await expect(favePage.stageStatus('Unit Approving Officer')).toHaveText('REJECTED');
      await expect(favePage.stageRemarks('Unit Approving Officer')).toHaveText(`Remarks: ${remarks}`);
      await expect(favePage.approveButton).toBeHidden();
      await expect(favePage.rejectButton).toBeHidden();
    });

    await test.step('5. Back with URO: Submit and Reject again', async () => {
      await favePage.reopenAs(ROLES.uro, costCentre);
      await expect(favePage.submitFaveButton).toBeVisible();
      await expect(favePage.rejectButton).toBeVisible();
    });
  });
});

// UAO approval is the last level on SPF (no HQ AO role) and cannot be undone: the cost centre stays
// APPROVED for this FAVE. The test uses the first cost centre in FAVE.approvalCostCentres that is not
// approved yet (never APD) and skips when none is left; a new FAVE (next FY) makes it run again.
test.describe('Stocktake FAVE final approval (writes, irreversible)', () => {
  test.use({ role: 'vet-ic' });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-027-*.md
  test('SPF-027: uao approves a unit fave after vet ic and uro submit, and it becomes final @regression @writes', async ({
    favePage,
    dashboardPage,
    returnFaveToVetIc,
  }) => {
    test.slow();
    const found = await favePage.firstNotApproved(FAVE.approvalCostCentres);
    test.skip(!found, `Every cost centre in FAVE.approvalCostCentres (${FAVE.approvalCostCentres.join(', ')}) is already approved in the current FAVE`);
    const costCentre = found as string;
    let endorsedBefore = 0;

    await test.step(`Start: the FAVE of ${costCentre} is with VET IC`, async () => {
      await returnFaveToVetIc(costCentre);
    });

    await test.step('1. Agency Admin: endorsed stocktake reports before', async () => {
      await dashboardPage.switchRole(ROLES['agency-admin']);
      await dashboardPage.goto();
      endorsedBefore = await dashboardPage.settledFigure(ENDORSED);
    });

    await test.step('2. VET IC submits', async () => {
      await favePage.reopenAs(ROLES['vet-ic'], costCentre);
      expect(await favePage.submitFave()).toEqual([SUBMIT_Q, 'Stocktake FAVE has been submitted.']);
    });

    await test.step('3. URO submits', async () => {
      await favePage.reopenAs(ROLES.uro, costCentre);
      expect(await favePage.submitFave()).toEqual([SUBMIT_Q, 'Stocktake FAVE has been submitted.']);
    });

    await test.step('4. UAO approves', async () => {
      await favePage.reopenAs(ROLES.uao, costCentre);
      await expect(favePage.approveButton).toBeVisible();
      await expect(favePage.rejectButton).toBeVisible();
      expect(await favePage.approveFave()).toEqual([APPROVE_Q, 'Stocktake FAVE has been approved.']);
    });

    await test.step('4. UAO stage and cost centre show APPROVED', async () => {
      await favePage.openForCostCentre(costCentre);
      await expect(favePage.stageStatus('Unit Approving Officer')).toHaveText('APPROVED');
      await expect(favePage.costCentreStatus(costCentre)).toHaveText('APPROVED');
      await expect(favePage.costCentreRole(costCentre)).toHaveText('Unit Approving Officer');
    });

    for (const role of ['uao', 'uro', 'vet-ic'] as const) {
      await test.step(`5. ${ROLES[role]}: the approved FAVE is read-only`, async () => {
        await favePage.reopenAs(ROLES[role], costCentre);
        await expect(favePage.submitFaveButton).toBeHidden();
        await expect(favePage.approveButton).toBeHidden();
        await expect(favePage.rejectButton).toBeHidden();
        await favePage.openDetails();
        await expect(favePage.updateResultButton).toBeHidden();
        await favePage.openAssignment();
        await expect(favePage.assignStocktakerButton).toBeHidden();
      });
    }

    await test.step('6. Agency Admin: one more endorsed stocktake report', async () => {
      await dashboardPage.switchRole(ROLES['agency-admin']);
      await dashboardPage.goto();
      // Other UAT users may endorse at the same time, so at least one more.
      expect(await dashboardPage.settledFigure(ENDORSED)).toBeGreaterThanOrEqual(endorsedBefore + 1);
    });
  });
});
