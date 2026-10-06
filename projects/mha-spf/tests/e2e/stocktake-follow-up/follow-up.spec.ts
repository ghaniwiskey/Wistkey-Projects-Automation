import { test, expect } from '../../fixtures/pages.fixture';

// Stocktake > Follow up: closing the open items raised in approved FAVEs.
test.describe('Stocktake Follow up', () => {
  test.use({ role: 'falo' });

  // Test case: projects/mha-spf/cases/stocktake-follow-up/SPF-041-*.md
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
