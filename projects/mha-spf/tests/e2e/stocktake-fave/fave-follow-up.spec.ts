import { test, expect, unique } from '../../fixtures/pages.fixture';

// FAVE results other than SIGHTED + WORKING (they raise follow-up items). Closing them: stocktake-follow-up/follow-up.spec.ts.
test.describe('FAVE follow-up results', () => {
  test.use({ role: 'vet-ic' });

  test.afterEach(async ({ favePage, faveTarget }) => {
    await favePage.ensurePending(faveTarget.costCentre, faveTarget.asset);
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-040-*.md
  test('SPF-040: vet ic records a not sighted result that stays open for investigation @regression @writes', async ({
    favePage,
    faveTarget: { costCentre, asset },
  }) => {
    test.slow();
    const remarks = unique('fave not sighted');

    await test.step(`1-2. Open the FAVE on ${costCentre}, Update Result for ${asset}, pick NOT SIGHTED`, async () => {
      await favePage.openForCostCentre(costCentre);
      await favePage.searchDetails(asset);
      await favePage.openUpdateResult(asset);
      await favePage.fillResult({ sighted: 'NOT SIGHTED' });
    });

    await test.step('2. NOT SIGHTED: for investigation, FAVE Status OPEN, location not editable', async () => {
      await expect(favePage.followUp).toHaveText('Not Found, for Investigation');
      await expect(favePage.fsscOutcome).toHaveValue('Under investigation');
      await expect(favePage.faveStatus).toHaveValue('OPEN');
      await expect(favePage.correctLocation).toBeDisabled();
      await expect.poll(() => favePage.followUpOptions()).toEqual([
        'Asset Physically Disposed (To Dispose - D2)',
        'Not Found, for Investigation',
        'Cannot be found after investigation',
      ]);
    });

    await test.step('3. Each HTD Follow-up sets its FSSC Outcome', async () => {
      await favePage.pickFollowUp('Asset Physically Disposed (To Dispose - D2)');
      await expect(favePage.fsscOutcome).toHaveValue('Asset has been physically disposed');
      await favePage.pickFollowUp('Cannot be found after investigation');
      await expect(favePage.fsscOutcome).toHaveValue('Cannot be found after investigation, FA record to be disposed');
      await expect(favePage.faveStatus).toHaveValue('OPEN');
    });

    await test.step('4. Submit', async () => {
      await favePage.remarks.fill(remarks);
      expect(await favePage.submitResult()).toBe('The stocktake result is updated.');
    });

    await test.step('5. After reopening the FAVE the row shows the result', async () => {
      await favePage.openForCostCentre(costCentre);
      await favePage.searchDetails(asset);
      await expect(favePage.resultOf(asset)).toContainText('NOT SIGHTED');
      await expect(favePage.followUpOf(asset)).toHaveText('Cannot be found after investigation');
      await expect(favePage.fsscOf(asset)).toHaveText('Cannot be found after investigation, FA record to be disposed');
    });

    await test.step('6. PENDING resets it', async () => {
      await favePage.openUpdateResult(asset);
      await expect(favePage.sightedResult).toHaveText('NOT SIGHTED');
      await favePage.fillResult({ sighted: 'PENDING' });
      expect(await favePage.submitResult()).toBe('The stocktake result is updated.');
      await favePage.searchDetails(asset);
      await expect(favePage.resultOf(asset)).toHaveText(/^\s*PENDING\s*$/);
    });
  });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-042-*.md
  // Read-only: the dialog is closed without saving.
  test('SPF-042: sighted but not working maps to repair, obsolete to dispose @regression', async ({
    favePage,
    faveTarget: { costCentre, asset },
  }) => {
    await favePage.openForCostCentre(costCentre);
    await favePage.searchDetails(asset);
    await favePage.openUpdateResult(asset);

    await test.step('1. NOT IN USE/OBSOLETE: only To Dispose (FA5)', async () => {
      await favePage.fillResult({ sighted: 'SIGHTED', condition: 'NOT IN USE/OBSOLETE' });
      await expect.poll(() => favePage.followUpOptions()).toEqual(['To Dispose (FA5)']);
      await expect(favePage.followUp).toHaveText('To Dispose (FA5)');
      await expect(favePage.fsscOutcome).toHaveValue(/^Asset is obsolete/);
      await expect(favePage.faveStatus).toHaveValue('CLOSED');
    });

    await test.step('2. NOT WORKING: only To Repair', async () => {
      await favePage.fillResult({ sighted: 'SIGHTED', condition: 'NOT WORKING' });
      await expect.poll(() => favePage.followUpOptions()).toEqual(['To Repair']);
      await expect(favePage.followUp).toHaveText('To Repair');
    });

    await test.step('3. To Repair keeps FSSC Outcome "Working condition" (intended, BUG-010 is not a bug)', async () => {
      await expect(favePage.fsscOutcome).toHaveValue('Working condition');
      await expect(favePage.faveStatus).toHaveValue('CLOSED');
    });
  });
});
