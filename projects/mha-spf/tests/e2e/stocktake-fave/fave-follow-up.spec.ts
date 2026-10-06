import { test, expect, unique } from '../../fixtures/pages.fixture';

// FAVE results other than SIGHTED + WORKING (they raise follow-up items), and closing follow-up items.
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
  test('SPF-042: sighted but not working maps to repair with a matching fssc outcome @regression', async ({
    favePage,
    faveTarget: { costCentre, asset },
  }) => {
    test.fail(true, 'BUG-010: SIGHTED + NOT WORKING (To Repair) shows FSSC Outcome "Working condition"');
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

    await test.step('3. The FSSC Outcome of To Repair is not "Working condition" (BUG-010)', async () => {
      await expect(favePage.fsscOutcome).not.toHaveValue('Working condition');
      await expect(favePage.fsscOutcome).not.toHaveValue('');
    });
  });
});

test.describe('FAVE follow-up close', () => {
  test.use({ role: 'falo' });

  // Test case: projects/mha-spf/cases/stocktake-fave/SPF-041-*.md
  // Closing cannot be undone: each run closes the first open item in the list.
  test('SPF-041: falo closes an open fave follow-up item @regression @writes', async ({ followUpPage }) => {
    test.slow();
    let before = 0;

    await test.step('1. Start > Choose Asset lists the open items', async () => {
      await followUpPage.start();
      before = await followUpPage.total();
      test.skip(before === 0, 'No open FAVE follow-up items to close');
    });

    await test.step('2. Next with nothing ticked is refused', async () => {
      await followUpPage.next();
      await followUpPage.acknowledge('Please tick at least one asset to process.');
    });

    const item = await followUpPage.firstItem();
    expect(item, 'an open item').toBeTruthy();
    const { fave, assetId } = item!;

    await test.step(`3. Tick ${assetId} (${fave}): it leaves the list`, async () => {
      await followUpPage.tickItem(item!);
      await expect(followUpPage.listInfo).toContainText(`of ${(before - 1).toLocaleString('en-US')} records`);
    });

    await test.step('4. Review shows the item', async () => {
      await followUpPage.nextToReview();
      await expect(followUpPage.reviewRows).toHaveCount(1);
      await expect(followUpPage.reviewRows.first()).toContainText(fave);
      await expect(followUpPage.reviewRows.first()).toContainText(`Asset ID: ${assetId}`);
    });

    await test.step('5. Submit closes it', async () => {
      expect(await followUpPage.submit()).toBe('Stocktake Follow-up Close');
      await expect(followUpPage.endSummary).toHaveText('1 Asset has been closed.');
    });

    await test.step('6. The item is no longer listed', async () => {
      await followUpPage.start();
      await expect(followUpPage.listInfo).toContainText(`of ${(before - 1).toLocaleString('en-US')} records`);
      await followUpPage.searchItem(item!);
      await expect(followUpPage.itemRows(item!)).toHaveCount(0);
    });
  });
});
