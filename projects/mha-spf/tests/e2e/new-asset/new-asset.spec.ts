import { test, expect, LOCATION, PHOTO, QA_PREFIX, unique } from '../../fixtures/pages.fixture';

const report = (description: string) => ({
  costCentre: LOCATION.costCentre,
  description,
  remarks: 'QA test, please ignore',
  postalQuery: LOCATION.postalQuery,
  postalOption: LOCATION.postalOption,
  locationRemarks: 'QA location',
  photo: PHOTO,
});

// Each report emails all LOGS1 and VET IC on UAT. Leftover OPEN QA reports are cancelled after each test.
test.describe('New Asset (writes)', () => {
  test.use({ role: 'logs1' });

  test.beforeEach(() => test.slow());

  test.afterEach(async ({ cancelOpenNewAssets }) => {
    await cancelOpenNewAssets(QA_PREFIX);
  });

  // Test case: projects/mha-spf/cases/new-asset/SPF-016-*.md
  test('SPF-016: report a potential new asset and close it as logs1 @regression @writes', async ({
    newAssetCreatePage,
    newAssetListPage,
    newAssetFormPage,
  }) => {
    const description = unique('new asset');
    let requestNo = '';

    await test.step('1-4. Report with photo', async () => {
      const result = await newAssetCreatePage.report(report(description));
      requestNo = result.requestNo;
      expect(result.message).toMatch(/^New Asset #RNA\d+ has been created\.$/);
    });

    await test.step('5. Listed as OPEN with Close and Cancel actions', async () => {
      await newAssetListPage.find(requestNo);
      await expect(newAssetListPage.description(requestNo)).toHaveText(description);
      await expect(newAssetListPage.status(requestNo)).toHaveText('OPEN');
      await newAssetListPage.open(requestNo);
      await expect(newAssetFormPage.closeItemButton).toBeVisible();
      await expect(newAssetFormPage.cancelItemButton).toBeVisible();
      await expect(newAssetFormPage.description).toHaveValue(description);
    });

    await test.step('6. Close as Not an Asset', async () => {
      expect(await newAssetFormPage.closeItem('Not an Asset')).toBe('The reported new asset has been closed.');
      await newAssetListPage.find(requestNo);
      await expect(newAssetListPage.status(requestNo)).toHaveText('CLOSED');
    });
  });

  // Test case: projects/mha-spf/cases/new-asset/SPF-017-*.md
  test('SPF-017: report a potential new asset and cancel it @regression @writes', async ({
    newAssetCreatePage,
    newAssetListPage,
    newAssetFormPage,
  }) => {
    let requestNo = '';

    await test.step('1. Report with photo', async () => {
      ({ requestNo } = await newAssetCreatePage.report(report(unique('new asset'))));
    });

    await test.step('2. Cancel as Mistaken as Asset', async () => {
      await newAssetListPage.open(requestNo);
      expect(await newAssetFormPage.cancelItem('Mistaken as Asset')).toMatch(/cancel/i);
    });

    await test.step('Listed as CANCELLED', async () => {
      await newAssetListPage.find(requestNo);
      await expect(newAssetListPage.status(requestNo)).toHaveText('CANCELLED');
    });
  });
});
