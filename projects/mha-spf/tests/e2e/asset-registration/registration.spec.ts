import { test, expect, LOCATION, OFFICER, unique } from '../../fixtures/pages.fixture';

// Registration works on iLMS assets in status NEW. SPF-013 and SPF-014 consume one NEW asset per run
// (they end AVAILABLE; the UI cannot reset that). SPF-015 puts its asset back to NEW.
test.describe('Asset Registration (writes)', () => {
  test.use({ role: 'logs1' });

  let assetId: string | undefined;
  /** Set while SPF-015's asset is REJECTED, so cleanup can reinstate it if the test fails. */
  let rejected: string | undefined;

  test.beforeEach(async ({ assetListingPage }) => {
    test.slow();
    assetId = await assetListingPage.firstAssetIdWithStatus('NEW');
    test.skip(!assetId, 'No NEW asset left for this unit on UAT');
  });

  test.afterEach(async ({ rejectionPage }) => {
    if (rejected && (await rejectionPage.isRejected(rejected))) {
      await rejectionPage.reinstateSelected(rejected, 'Wrongly Rejected');
    }
    rejected = undefined;
  });

  // Test case: projects/mha-spf/cases/asset-registration/SPF-013-*.md
  test('SPF-013: logs1 registers a new asset with a complete location @regression @writes', async ({
    registrationPage,
    assetListingPage,
    assetDetailsPage,
  }) => {
    const id = assetId!;
    const remarks = unique('register');

    await test.step(`1-5. Register ${id} with remarks, no tag printing`, async () => {
      const message = await registrationPage.register(id, { ...LOCATION, remarks });
      expect(message).toBe('Asset Registration completed.');
      await expect(registrationPage.endStep).toContainText('1 Asset successfully registered.');
    });

    await test.step('Asset is AVAILABLE with the location remarks', async () => {
      await assetListingPage.find(id);
      await expect(assetListingPage.statusOf(id)).toHaveText('AVAILABLE');
      await assetListingPage.openAsset(id);
      await assetDetailsPage.openTab('Location');
      await expect(assetDetailsPage.field('Remarks', assetDetailsPage.activePanel)).toHaveText(remarks);
    });
  });

  // Test case: projects/mha-spf/cases/asset-registration/SPF-014-*.md
  test('SPF-014: partial registration sets progress and complete register finishes it @regression @writes', async ({
    registrationPage,
    assetListingPage,
  }) => {
    const id = assetId!;

    await test.step(`1. Register ${id} without block/level/room/remarks`, async () => {
      const message = await registrationPage.register(id, { ...LOCATION });
      expect(message).toBe('Asset Registration incomplete.');
      await expect(registrationPage.endStep).toContainText('Please fill in either the Block, Level, Room No or Remarks');
    });

    await test.step('2. Asset is PROGRESS', async () => {
      await assetListingPage.find(id);
      await expect(assetListingPage.statusOf(id)).toHaveText('PROGRESS');
    });

    await test.step('3-4. Complete Register with remarks', async () => {
      await registrationPage.openCompleteRegister(id);
      await expect(registrationPage.groupValue).toHaveText(LOCATION.group);
      await expect(registrationPage.postalCodeValue).toContainText(LOCATION.postalQuery);
      expect(await registrationPage.finishCompleteRegister(unique('complete'))).toBe('Asset Registration completed.');
    });

    await test.step('Asset is AVAILABLE', async () => {
      await assetListingPage.find(id);
      await expect(assetListingPage.statusOf(id)).toHaveText('AVAILABLE');
    });
  });

  // Test case: projects/mha-spf/cases/asset-registration/SPF-015-*.md
  test('SPF-015: reject a new asset from registration and reinstate it @regression @writes', async ({
    registrationPage,
    rejectionPage,
    assetListingPage,
  }) => {
    const id = assetId!;

    await test.step(`1-2. Reject ${id} as Wrongly Capitalised`, async () => {
      expect(await registrationPage.reject(id, 'Wrongly Capitalised')).toBe('Assets Rejected.');
      rejected = id;
      await expect(registrationPage.endStep).toContainText('1 Asset rejected from Registration.');
    });

    await test.step('3. Asset is in the Reinstate list, rejected by the officer', async () => {
      await rejectionPage.start();
      await rejectionPage.searchAsset(id);
      await expect(rejectionPage.rejectedRow(id)).toContainText(OFFICER);
    });

    await test.step('4. Reinstate as Wrongly Rejected', async () => {
      expect(await rejectionPage.reinstateSelected(id, 'Wrongly Rejected')).toBe('Reinstatement Completed');
      rejected = undefined;
      await expect(rejectionPage.endStep).toContainText('1 asset has been reinstated and is pending registration.');
    });

    await test.step('Asset is NEW again', async () => {
      await assetListingPage.find(id);
      await expect(assetListingPage.statusOf(id)).toHaveText('NEW');
    });
  });
});
