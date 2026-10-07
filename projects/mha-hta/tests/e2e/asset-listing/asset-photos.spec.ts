import { test, expect, PHOTO, unique } from '../../fixtures/pages.fixture';

// Photo and sensitivity changes on the first AVAILABLE asset (availableAsset fixture, no fixed ID).
// Every test puts the asset back: photos it added are deleted, sensitivity goes back to No.
test.describe('Asset photos and sensitivity (writes)', () => {
  test.use({ role: 'logs1' });

  let assetId = '';
  /** Photos uploaded by the running test, deleted in cleanup if the test stopped before deleting them. */
  let added: string[] = [];
  /** Set while HTA-034 has made the asset sensitive. */
  let madeSensitive = false;

  test.beforeEach(async ({ availableAsset, assetListingPage, assetDetailsPage }) => {
    test.slow();
    assetId = availableAsset.id;
    added = [];
    madeSensitive = false;
    await assetListingPage.find(assetId);
    await assetListingPage.openAsset(assetId);
    await assetDetailsPage.expectLoaded();
    test.skip(await assetDetailsPage.isSensitive(), `Asset ${assetId} is sensitive (photo upload disabled)`);
  });

  test.afterEach(async ({ assetListingPage, assetDetailsPage }) => {
    if (!added.length && !madeSensitive) return;
    await assetListingPage.find(assetId);
    await assetListingPage.openAsset(assetId);
    await assetDetailsPage.expectLoaded();
    if (madeSensitive && (await assetDetailsPage.isSensitive())) await assetDetailsPage.setSensitivity(false);
    if (added.length) {
      await assetDetailsPage.openPictures();
      const ids = await assetDetailsPage.photoIds();
      for (const id of added.filter((a) => ids.includes(a))) await assetDetailsPage.deletePhoto(id);
    }
  });

  // Test case: projects/mha-hta/cases/asset-listing/HTA-033-*.md
  test('HTA-033: logs1 uploads a photo to an asset and deletes it @regression @writes', async ({ assetDetailsPage }) => {
    let before: string[] = [];
    let photoId = '';

    await test.step('1. Edit Picture shows the photo slots', async () => {
      await assetDetailsPage.openPictures();
      before = await assetDetailsPage.photoIds();
      test.skip(before.length >= 5, `Asset ${assetId} already has 5 photos`);
    });

    await test.step('2. Upload without a file is refused', async () => {
      await assetDetailsPage.emptySlots.first().click();
      await assetDetailsPage.uploadButton.click();
      await expect(assetDetailsPage.pictureRequired).toBeVisible();
    });

    await test.step('3. Upload the photo into an empty slot', async () => {
      expect(await assetDetailsPage.uploadPhoto(PHOTO)).toBe('Uploaded successfully');
    });

    await test.step('4. After a reload the asset has one more photo', async () => {
      await assetDetailsPage.reload();
      await assetDetailsPage.openPictures();
      const after = await assetDetailsPage.photoIds();
      added = after.filter((id) => !before.includes(id));
      expect(added).toHaveLength(1);
      expect(after).toHaveLength(before.length + 1);
      photoId = added[0];
    });

    await test.step('5-6. Delete it: the asset is back to its photos', async () => {
      expect(await assetDetailsPage.deletePhoto(photoId)).toBe('Deleted successfully');
      await assetDetailsPage.reload();
      await assetDetailsPage.openPictures();
      expect(await assetDetailsPage.photoIds()).toEqual(before);
      added = [];
    });
  });

  // Test case: projects/mha-hta/cases/asset-listing/HTA-034-*.md
  test('HTA-034: a sensitive asset (asset sensitivity yes) cannot get new photos @regression @writes', async ({ assetDetailsPage }) => {
    const remarks = unique('sensitive');

    await test.step('1-2. Edit asset: Asset Sensitivity Yes with remarks', async () => {
      madeSensitive = true;
      await assetDetailsPage.setSensitivity(true, remarks);
      await expect(assetDetailsPage.field('Asset Sensitivity', assetDetailsPage.activePanel)).toHaveText('Yes');
      await expect(assetDetailsPage.field('Sensitivity Remarks', assetDetailsPage.activePanel)).toHaveText(remarks);
    });

    await test.step('3. Edit Picture offers no Upload', async () => {
      await assetDetailsPage.openPictures();
      await assetDetailsPage.emptySlots.first().click();
      await expect(assetDetailsPage.uploadButton).toBeHidden();
      await assetDetailsPage.closePictures();
    });

    await test.step('4. Back to No: Upload is offered again', async () => {
      await assetDetailsPage.setSensitivity(false);
      madeSensitive = false;
      await expect(assetDetailsPage.field('Asset Sensitivity', assetDetailsPage.activePanel)).toHaveText('No');
      await assetDetailsPage.openPictures();
      await assetDetailsPage.emptySlots.first().click();
      await expect(assetDetailsPage.uploadButton).toBeVisible();
    });
  });
});
