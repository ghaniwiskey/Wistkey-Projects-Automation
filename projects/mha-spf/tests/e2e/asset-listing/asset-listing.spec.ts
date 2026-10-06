import { test, expect } from '../../fixtures/pages.fixture';
import { AssetDetailsPage } from '../../pages/asset-details.page';

// The asset is the first AVAILABLE one in the listing (availableAsset fixture), not a fixed ID.

// LOGS1, not Agency Admin: the Agency Admin listing holds ~48k assets and search hangs.
test.describe('Asset Listing', () => {
  test.use({ role: 'logs1' });

  // Test case: projects/mha-spf/cases/asset-listing/SPF-004-*.md
  test('SPF-004: logs1 finds an asset by asset id in asset listing @smoke', async ({ assetListingPage, availableAsset: asset }) => {
    await test.step('1. Open Asset > Listing', async () => {
      await assetListingPage.goto();
      expect(await assetListingPage.totalRecords()).toBeGreaterThan(1);
    });

    await test.step(`2. Search for ${asset.id}`, async () => {
      await assetListingPage.search(asset.id);
    });

    await test.step('Exactly the matching asset is listed', async () => {
      await expect(assetListingPage.info).toHaveText('Showing 1 to 1 of 1 records');
      await expect(assetListingPage.rows).toHaveCount(1);
      const row = assetListingPage.row(asset.id);
      await expect(row).toContainText(`Asset ID: ${asset.id}`);
      await expect(row).toContainText(asset.description);
      await expect(row).toContainText(asset.costCentre);
      await expect(row).toContainText(asset.status);
    });
  });

  // Test case: projects/mha-spf/cases/asset-listing/SPF-005-*.md
  test('SPF-005: logs1 filters asset listing by status @regression', async ({ assetListingPage }) => {
    let total = 0;
    await test.step('1. Open Asset > Listing and note the total', async () => {
      await assetListingPage.goto();
      total = await assetListingPage.totalRecords();
      expect(total).toBeGreaterThan(0);
    });

    await test.step('2. Filter by status NEW', async () => {
      await assetListingPage.filterByStatus('NEW');
      const filtered = await assetListingPage.totalRecords();
      expect(filtered, 'filtered total is lower than the unfiltered total').toBeLessThan(total);
      expect(filtered, 'UAT has NEW assets for this unit').toBeGreaterThan(0);
      const statuses = await assetListingPage.statuses().allInnerTexts();
      expect(statuses.length).toBeGreaterThan(0);
      expect(statuses.map((s) => s.trim()), 'every row is NEW').toEqual(statuses.map(() => 'NEW'));
    });

    await test.step('3. Clear resets the filter', async () => {
      await assetListingPage.clear();
      expect(await assetListingPage.totalRecords()).toBe(total);
    });
  });

  // Test case: projects/mha-spf/cases/asset-listing/SPF-006-*.md
  test('SPF-006: asset details show the asset header and the data tabs @smoke', async ({ assetListingPage, assetDetailsPage, availableAsset: asset }) => {
    await test.step('1-2. Search the asset and open it', async () => {
      await assetListingPage.goto();
      await assetListingPage.search(asset.id);
      await assetListingPage.openAsset(asset.id);
      await assetDetailsPage.expectLoaded();
    });

    await test.step('Header shows the key fields', async () => {
      await expect(assetDetailsPage.field('Asset ID')).toHaveText(asset.id);
      await expect(assetDetailsPage.field('Asset Status')).toHaveText(asset.status);
      await expect(assetDetailsPage.field('Asset Category')).toHaveText(/\S/);
      await expect(assetDetailsPage.field('Cost Centre')).toContainText(asset.costCentre);
    });

    await test.step('Data tabs are shown, Main Data selected', async () => {
      for (const name of AssetDetailsPage.TABS) {
        await expect(assetDetailsPage.tab(name), `tab ${name}`).toBeVisible();
      }
      await expect(assetDetailsPage.tab('Main Data')).toHaveAttribute('aria-selected', 'true');
      await expect(assetDetailsPage.field('Acquisition Value', assetDetailsPage.activePanel)).toHaveText(asset.acquisitionValue);
    });

    await test.step('3. Location tab shows group and postal code', async () => {
      await assetDetailsPage.openTab('Location');
      await expect(assetDetailsPage.field('Group / NPC / Base', assetDetailsPage.activePanel)).toHaveText(/\S/);
      await expect(assetDetailsPage.field('Postal Code', assetDetailsPage.activePanel)).toHaveText(/\S/);
    });

    await test.step('4. Ownership tab shows current LOGS1 and FALO', async () => {
      await assetDetailsPage.openTab('Ownership');
      await expect(assetDetailsPage.field('Current LOGS1', assetDetailsPage.activePanel)).toBeVisible();
      await expect(assetDetailsPage.field('Current FALO', assetDetailsPage.activePanel)).toBeVisible();
    });
  });
});
