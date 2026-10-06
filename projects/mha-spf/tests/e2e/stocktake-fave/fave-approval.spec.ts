import { test, expect, FAVE, ROLES, unique } from '../../fixtures/pages.fixture';

const SUBMIT_Q = 'Please confirm that you want to submit this FAVE.';
const REJECT_Q = 'Please confirm that you want to reject this FAVE.';

// Moves the live FAVE of 332600 APD through the approval chain and back. Emails the next level on UAT.
// Before and after each test the FAVE is rejected back down to VET IC. UAO Approve is never used: it
// sends the FAVE to HQ AO, a role the test account does not have.
test.describe('Stocktake FAVE approval (writes)', () => {
  test.use({ role: 'vet-ic' });

  test.beforeEach(async ({ returnFaveToVetIc }) => {
    test.slow();
    await returnFaveToVetIc(FAVE.costCentre);
  });

  test.afterEach(async ({ returnFaveToVetIc }) => {
    await returnFaveToVetIc(FAVE.costCentre);
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-025-*.md
  test('SPF-025: vet ic submits the unit fave and uro rejects it back with a reason @regression @writes', async ({ favePage }) => {
    const remarks = unique('fave reject');

    await test.step('1. VET IC submits the FAVE', async () => {
      await favePage.openForCostCentre(FAVE.costCentre);
      expect(await favePage.submitFave()).toEqual([SUBMIT_Q, 'Stocktake FAVE has been submitted.']);
      await expect(favePage.stageStatus('Verification Team IC/2IC')).toHaveText('SUBMITTED');
      await expect(favePage.submitFaveButton).toBeHidden();
    });

    await test.step('2. URO can submit or reject', async () => {
      await favePage.reopenAs(ROLES.uro, FAVE.costCentre);
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
      await favePage.openForCostCentre(FAVE.costCentre);
      await expect(favePage.stageStatus('Unit Resource Officer')).toHaveText('REJECTED');
      await expect(favePage.stageRemarks('Unit Resource Officer')).toHaveText(`Remarks: ${remarks}`);
      await expect(favePage.costCentreStatus(FAVE.costCentre)).toHaveText('REJECTED');
      await expect(favePage.costCentreRole(FAVE.costCentre)).toHaveText('Unit Resource Officer');
      await expect(favePage.rejectButton).toBeHidden();
      await expect(favePage.submitFaveButton).toBeHidden();
    });

    await test.step('7. Back with VET IC: Submit is shown again', async () => {
      await favePage.reopenAs(ROLES['vet-ic'], FAVE.costCentre);
      await expect(favePage.submitFaveButton).toBeVisible();
    });
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-026-*.md
  test('SPF-026: fave goes from vet ic through uro to uao, and uao rejects it back to uro @regression @writes', async ({ favePage }) => {
    const remarks = unique('fave uao reject');

    await test.step('1. VET IC submits', async () => {
      await favePage.openForCostCentre(FAVE.costCentre);
      expect((await favePage.submitFave())[1]).toBe('Stocktake FAVE has been submitted.');
    });

    await test.step('2. URO submits to UAO', async () => {
      await favePage.reopenAs(ROLES.uro, FAVE.costCentre);
      expect(await favePage.submitFave()).toEqual([SUBMIT_Q, 'Stocktake FAVE has been submitted.']);
      await expect(favePage.stageStatus('Unit Resource Officer')).toHaveText('SUBMITTED');
      await expect(favePage.submitFaveButton).toBeHidden();
      await expect(favePage.rejectButton).toBeHidden();
    });

    await test.step('3. UAO can approve or reject', async () => {
      await favePage.reopenAs(ROLES.uao, FAVE.costCentre);
      await expect(favePage.approveButton).toBeVisible();
      await expect(favePage.rejectButton).toBeVisible();
    });

    await test.step('4. UAO rejects', async () => {
      expect(await favePage.rejectFave('Others', remarks)).toEqual([REJECT_Q, 'Stocktake FAVE has been rejected.']);
      await favePage.openForCostCentre(FAVE.costCentre);
      await expect(favePage.stageStatus('Unit Approving Officer')).toHaveText('REJECTED');
      await expect(favePage.stageRemarks('Unit Approving Officer')).toHaveText(`Remarks: ${remarks}`);
      await expect(favePage.approveButton).toBeHidden();
      await expect(favePage.rejectButton).toBeHidden();
    });

    await test.step('5. Back with URO: Submit and Reject again', async () => {
      await favePage.reopenAs(ROLES.uro, FAVE.costCentre);
      await expect(favePage.submitFaveButton).toBeVisible();
      await expect(favePage.rejectButton).toBeVisible();
    });
  });
});
