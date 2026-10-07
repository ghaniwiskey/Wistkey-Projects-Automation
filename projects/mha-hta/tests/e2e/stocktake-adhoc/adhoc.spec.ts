import { test, expect, QA_PREFIX, unique } from '../../fixtures/pages.fixture';

// Ad hoc stocktake setups made by these tests are named "QA auto adhoc ...". One-off setups cannot be
// cancelled ("Can't cancel one-off stocktake type."), so HTA-022 leaves one per run; periodic ones
// that have not started (CREATED) are cancelled after each test.
test.describe('Stocktake Ad Hoc (writes)', () => {
  test.use({ role: 'logs1' });

  test.beforeEach(() => test.slow());

  test.afterEach(async ({ cancelCreatedAdHocs }) => {
    await cancelCreatedAdHocs(`${QA_PREFIX} adhoc`);
  });

  // Test case: projects/mha-hta/cases/stocktake-adhoc/HTA-022-*.md
  test('HTA-022: logs1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker @regression @writes', async ({
    adHocCreatePage,
    adHocSetupPage,
    adHocListingPage,
  }) => {
    const name = unique('adhoc');
    let stocktakeNo = '';
    let asset = ''; // the first asset in Choose Asset

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

    await test.step('4. Tick the first asset, review, submit', async () => {
      asset = await adHocCreatePage.firstAssetId();
      await adHocCreatePage.tickAsset(asset);
      await adHocCreatePage.nextToReview();
      await expect(adHocCreatePage.reviewRows).toHaveCount(1);
      await expect(adHocCreatePage.reviewRows.first()).toContainText(`Asset ID: ${asset}`);
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
      expect(await adHocListingPage.updateResult(asset, 'SIGHTED', unique('adhoc result'))).toBe('The stocktake has been updated.');
      await expect(adHocListingPage.summaryCount('SIGHTED')).toHaveText('1');
      await expect(adHocListingPage.summaryRow('PENDING')).toHaveCount(0);
    });

    await test.step('8. Assign another ad hoc stocktaker (no confirmation)', async () => {
      await adHocListingPage.searchAssignment(asset);
      // The creator is the default stocktaker; take the first other name from the dropdown.
      const current = (await adHocListingPage.stocktakerOf(asset).innerText()).trim();
      const stocktaker = (await adHocListingPage.stocktakerOptions()).find((n) => n !== current);
      expect(stocktaker, 'another stocktaker is offered').toBeTruthy();
      const result = await adHocListingPage.assignStocktaker(asset, stocktaker as string);
      expect(result.confirmation).toBeUndefined();
      expect(result.message).toBe('The stocktaker has been assigned.');
      await expect(adHocListingPage.stocktakerOf(asset)).toHaveText(stocktaker as string);
    });

    await test.step('9. With a result recorded the setup is SUBMITTED', async () => {
      await adHocSetupPage.find(stocktakeNo);
      await expect(adHocSetupPage.status(stocktakeNo)).toHaveText('SUBMITTED');
    });
  });

  // Test case: projects/mha-hta/cases/stocktake-adhoc/HTA-023-*.md
  test('HTA-023: logs1 creates a periodic ad hoc stocktake and cancels it with a reason @regression @writes', async ({
    adHocCreatePage,
    adHocSetupPage,
  }) => {
    const name = unique('adhoc periodic');
    let stocktakeNo = '';

    await test.step('1-2. Create a monthly setup that starts tomorrow', async () => {
      const result = await adHocCreatePage.create({ frequency: 'PERIODIC', selection: 'MANUAL', name, recurrence: 'MONTHLY', remarks: 'QA test, please ignore' });
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

    await test.step('4. The Reason dropdown offers Others (mha-spf BUG-001)', async () => {
      await adHocSetupPage.openCancel();
      await expect(adHocSetupPage.cancelReason('Others')).toHaveCount(1);
    });

    await test.step('5. Cancel with reason Others', async () => {
      expect(await adHocSetupPage.cancel('Others', 'QA test, please ignore')).toBe('Stocktake Ad Hoc has been cancelled.');
      await adHocSetupPage.find(stocktakeNo);
      await expect(adHocSetupPage.status(stocktakeNo)).toHaveText('CANCELLED');
    });
  });

  // Test case: projects/mha-hta/cases/stocktake-adhoc/HTA-053-*.md
  test('HTA-053: logs1 creates a periodic ad hoc stocktake with random selection limited by status and max asset @regression @writes', async ({
    adHocCreatePage,
    adHocSetupPage,
    adHocListingPage,
  }) => {
    const MAX = 3;
    const name = unique('adhoc random');
    let picked: string[] = [];
    let stocktakeNo = '';

    await test.step('1. Periodic, Random, monthly; Next', async () => {
      await adHocCreatePage.goto();
      await adHocCreatePage.fillStart({ frequency: 'PERIODIC', selection: 'RANDOM', name, recurrence: 'MONTHLY', remarks: 'QA test, please ignore' });
      await adHocCreatePage.nextToRandomAssets();
    });

    await test.step('2. Next without Search is refused', async () => {
      await adHocCreatePage.next();
      await adHocCreatePage.acknowledge('Please click Search button to ensure there is asset(s) based on filter(s) selected.');
      await expect(adHocCreatePage.maxAsset).toBeVisible(); // still on Choose Asset
    });

    await test.step(`3. Status AVAILABLE has more than ${MAX} assets`, async () => {
      await adHocCreatePage.filterStatus('AVAILABLE');
      const pool = await adHocCreatePage.randomSearch();
      test.skip(pool.assets <= MAX, `The unit has only ${pool.assets} AVAILABLE asset(s); Max Asset ${MAX} needs more to be checked`);
    });

    await test.step(`4. Max Asset ${MAX} draws ${MAX} assets`, async () => {
      const drawn = await adHocCreatePage.randomSearch({ maxAsset: MAX });
      expect(drawn.assets).toBe(MAX);
      expect(drawn.groups).toBeGreaterThanOrEqual(1);
      expect(drawn.groups).toBeLessThanOrEqual(MAX);
    });

    await test.step(`5. Review lists ${MAX} AVAILABLE assets`, async () => {
      await adHocCreatePage.nextToReview();
      const review = await adHocCreatePage.reviewAssets();
      expect(review).toHaveLength(MAX);
      expect(review.map((a) => a.status)).toEqual(Array(MAX).fill('AVAILABLE'));
      picked = review.map((a) => a.id).sort();
    });

    await test.step('6. Submit', async () => {
      const result = await adHocCreatePage.submitSetup();
      stocktakeNo = result.stocktakeNo;
      expect(result.message).toMatch(/^Ad Hoc Stocktake No\. ADST\d+ has been created$/);
    });

    await test.step('7. Ad Hoc Setup lists it as RANDOM, MONTHLY, PERIODIC, CREATED with Max Asset 3', async () => {
      await adHocSetupPage.find(stocktakeNo);
      await expect(adHocSetupPage.cell(stocktakeNo, 1)).toHaveText(name);
      await expect(adHocSetupPage.cell(stocktakeNo, 2)).toHaveText('RANDOM');
      await expect(adHocSetupPage.cell(stocktakeNo, 3)).toHaveText('MONTHLY');
      await expect(adHocSetupPage.cell(stocktakeNo, 7)).toHaveText('PERIODIC');
      await expect(adHocSetupPage.status(stocktakeNo)).toHaveText('CREATED');
      await adHocSetupPage.open(stocktakeNo);
      await expect(adHocSetupPage.detailValue('Asset Selection:')).toHaveText('RANDOM');
      await expect(adHocSetupPage.detailValue('Max Asset:')).toHaveText(String(MAX));
    });

    await test.step(`8. Ad Hoc Listing holds the same ${MAX} assets, all PENDING`, async () => {
      await adHocListingPage.open(stocktakeNo);
      await expect(adHocListingPage.summaryCount('PENDING')).toHaveText(String(MAX));
      expect((await adHocListingPage.detailAssetIds()).sort()).toEqual(picked);
    });
  });
});

// Read-only: searches in the Random step and leaves the wizard without submitting.
test.describe('Stocktake Ad Hoc random limits', () => {
  test.use({ role: 'logs1' });

  // Test case: projects/mha-hta/cases/stocktake-adhoc/HTA-054-*.md
  test('HTA-054: random ad hoc selection picks assets from at most max group / npc / base groups @regression', async ({ adHocCreatePage }) => {
    test.slow();
    // The draw is random and mha-spf BUG-016 shows up in about 1 search in 3, so each limit gets several tries.
    const TRIES = 5;

    await test.step('1. Periodic, Random, monthly; Next', async () => {
      await adHocCreatePage.goto();
      await adHocCreatePage.fillStart({ frequency: 'PERIODIC', selection: 'RANDOM', name: unique('adhoc random'), recurrence: 'MONTHLY' });
      await adHocCreatePage.nextToRandomAssets();
    });

    await test.step('2. Without limits the unit has assets in more than 2 groups', async () => {
      const all = await adHocCreatePage.randomSearch();
      test.skip(all.groups <= 2, `The unit's assets are in only ${all.groups} group(s); the limits 1 and 2 cannot be checked`);
    });

    for (const max of [1, 2]) {
      await test.step(`${max + 2}. Max Group / NPC / Base ${max}: at most ${max} group(s) in ${TRIES} searches (mha-spf BUG-016)`, async () => {
        for (let i = 1; i <= TRIES; i++) {
          const drawn = await adHocCreatePage.randomSearch({ maxGroup: max });
          expect(drawn.groups, `search ${i}: ${drawn.assets} assets from ${drawn.groups} groups`).toBeLessThanOrEqual(max);
        }
      });
    }
  });
});
