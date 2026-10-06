import { test, expect, ADHOC, QA_PREFIX, unique } from '../../fixtures/pages.fixture';

// Ad hoc stocktake setups made by these tests are named "QA auto adhoc ...". One-off setups cannot be
// cancelled ("Can't cancel one-off stocktake type."), so SPF-022 leaves one per run; periodic ones
// that have not started (CREATED) are cancelled after each test.
test.describe('Stocktake Ad Hoc (writes)', () => {
  test.use({ role: 'logs1' });

  test.beforeEach(() => test.slow());

  test.afterEach(async ({ cancelCreatedAdHocs }) => {
    await cancelCreatedAdHocs(`${QA_PREFIX} adhoc`);
  });

  // Test case: projects/mha-spf/cases/stocktake-adhoc/SPF-022-*.md
  test('SPF-022: logs1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker @regression @writes', async ({
    adHocCreatePage,
    adHocSetupPage,
    adHocListingPage,
  }) => {
    const name = unique('adhoc');
    let stocktakeNo = '';

    await test.step('1. One-Off hides the periodic fields; the name is required', async () => {
      await adHocCreatePage.goto();
      await expect(adHocCreatePage.startDate).toBeVisible(); // Periodic is the default
      await adHocCreatePage.fillStart({ frequency: 'ONE-OFF', selection: 'MANUAL', name: '' });
      await expect(adHocCreatePage.startDate).toBeHidden();
      await adHocCreatePage.next();
      await expect(adHocCreatePage.nameRequired).toBeVisible();
    });

    await test.step('2. Name and remarks, Next', async () => {
      await adHocCreatePage.fillStart({ frequency: 'ONE-OFF', selection: 'MANUAL', name, remarks: 'QA test, please ignore' });
      await adHocCreatePage.nextToAssets();
    });

    await test.step('3. At least one asset is required', async () => {
      await adHocCreatePage.next();
      await adHocCreatePage.acknowledge('Please tick at least one asset to process.');
    });

    await test.step('4. Tick the asset, review, submit', async () => {
      await adHocCreatePage.tickAsset(ADHOC.asset);
      await adHocCreatePage.nextToReview();
      await expect(adHocCreatePage.reviewRows).toHaveCount(1);
      await expect(adHocCreatePage.reviewRows.first()).toContainText(`Asset ID: ${ADHOC.asset}`);
      const result = await adHocCreatePage.submitSetup();
      stocktakeNo = result.stocktakeNo;
      expect(result.message).toMatch(/^Ad Hoc Stocktake No\. ADST\d+ has been created$/);
    });

    await test.step('5. Ad Hoc Setup lists it as CREATED', async () => {
      await adHocSetupPage.find(stocktakeNo);
      await expect(adHocSetupPage.cell(stocktakeNo, 1)).toHaveText(name);
      await expect(adHocSetupPage.cell(stocktakeNo, 2)).toHaveText('MANUAL');
      await expect(adHocSetupPage.cell(stocktakeNo, 7)).toHaveText('ONE-OFF');
      await expect(adHocSetupPage.status(stocktakeNo)).toHaveText('CREATED');
    });

    await test.step('6. Ad Hoc Listing summary: 1 PENDING', async () => {
      await adHocListingPage.open(stocktakeNo);
      await expect(adHocListingPage.summaryCount('PENDING')).toHaveText('1');
    });

    await test.step('7. Update the result to SIGHTED', async () => {
      expect(await adHocListingPage.updateResult(ADHOC.asset, 'SIGHTED', unique('adhoc result'))).toBe('The stocktake has been updated.');
      await expect(adHocListingPage.summaryCount('SIGHTED')).toHaveText('1');
      await expect(adHocListingPage.summaryRow('PENDING')).toHaveCount(0);
    });

    await test.step(`8. Assign ${ADHOC.stocktaker} as ad hoc stocktaker (no confirmation)`, async () => {
      await adHocListingPage.searchAssignment(ADHOC.asset);
      const result = await adHocListingPage.assignStocktaker(ADHOC.asset, ADHOC.stocktaker);
      expect(result.confirmation).toBeUndefined();
      expect(result.message).toBe('The stocktaker has been assigned.');
      await expect(adHocListingPage.stocktakerOf(ADHOC.asset)).toHaveText(ADHOC.stocktaker);
    });

    await test.step('9. With a result recorded the setup is SUBMITTED', async () => {
      await adHocSetupPage.find(stocktakeNo);
      await expect(adHocSetupPage.status(stocktakeNo)).toHaveText('SUBMITTED');
    });
  });

  // Test case: projects/mha-spf/cases/stocktake-adhoc/SPF-023-*.md
  test('SPF-023: logs1 creates a periodic ad hoc stocktake and cancels it with a reason @regression @writes', async ({
    adHocCreatePage,
    adHocSetupPage,
  }) => {
    test.fail(true, 'BUG-001: the ad hoc Cancel dialog has no readable reason, so "Others" cannot be picked');
    const name = unique('adhoc periodic');
    let stocktakeNo = '';

    await test.step('1-2. Create a monthly setup that starts tomorrow', async () => {
      const result = await adHocCreatePage.create({ frequency: 'PERIODIC', selection: 'MANUAL', name, recurrence: 'MONTHLY', remarks: 'QA test, please ignore' }, ADHOC.asset);
      stocktakeNo = result.stocktakeNo;
      expect(result.message).toMatch(/^Ad Hoc Stocktake No\. ADST\d+ has been created$/);
      await adHocSetupPage.find(stocktakeNo);
      await expect(adHocSetupPage.cell(stocktakeNo, 3)).toHaveText('MONTHLY');
      await expect(adHocSetupPage.cell(stocktakeNo, 7)).toHaveText('PERIODIC');
      await expect(adHocSetupPage.status(stocktakeNo)).toHaveText('CREATED');
    });

    await test.step('3. The CREATED setup can be cancelled', async () => {
      await adHocSetupPage.open(stocktakeNo);
      await expect(adHocSetupPage.statusBadge).toHaveText('CREATED');
      await expect(adHocSetupPage.cancelButton).toBeVisible();
    });

    await test.step('4. The Reason dropdown offers Others (BUG-001)', async () => {
      await adHocSetupPage.openCancel();
      await expect(adHocSetupPage.cancelReason('Others')).toHaveCount(1);
    });

    await test.step('5. Cancel with reason Others', async () => {
      expect(await adHocSetupPage.cancel('Others', 'QA test, please ignore')).toBe('Stocktake Ad Hoc has been cancelled.');
      await adHocSetupPage.find(stocktakeNo);
      await expect(adHocSetupPage.status(stocktakeNo)).toHaveText('CANCELLED');
    });
  });
});
