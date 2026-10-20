import { test, expect, webExpect, MOBILE_ROLES, QA_PREFIX, sameName, unique } from '../../fixtures/pages.fixture';
import type { NewAssetReport } from '../../pages/mobile/new-asset.screen';
import type { WebAsset } from '../../pages/web/web-asset.page';
import type { WebNewAsset } from '../../pages/web/web-new-asset.page';

// Test case: projects/mha-mobile/cases/new-asset/MHM-010-*.md
// Emails the unit's LOGS1 and VET IC like a real report; the request is cancelled at the end (and by afterEach).
test.use({ webRole: 'logs1' });

test.afterEach(async ({ webNewAssetPage }) => {
  await webNewAssetPage.cancelOpen(QA_PREFIX);
});

test('MHM-010: new asset reported on the mobile app shows on mha web @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  phoneAsset,
  galleryPhoto,
  newAssetScreen,
  webNewAssetPage,
}) => {
  test.setTimeout(10 * 60_000);
  const role = MOBILE_ROLES.logs1;
  let a: WebAsset | undefined;
  await test.step('MHA web: cost centre and address from an asset of the unit', async () => {
    a = await phoneAsset(role);
  });
  const unit = a as WebAsset;
  const costCentre = unit.costCentre.split('/')[0].trim();
  const report: NewAssetReport = {
    condition: 'WORKING',
    description: `${QA_PREFIX} ${unique()}`,
    remarks: 'QA auto mobile test, please ignore',
    postalCode: unit.postalCode,
    address: unit.address,
    level: '1',
    locationRemarks: 'QA auto mobile location',
  };

  await test.step(`1. Phone: ${role} | ${costCentre}, New Asset`, async () => {
    await mobileHome.switchTo(role, costCentre);
    await mobileHome.openTile('New Asset');
    await newAssetScreen.expectLoaded();
  });
  await test.step('2. SAVE on the empty form keeps the form (toast "Please select asset condition")', async () => {
    await newAssetScreen.save();
    await expect(newAssetScreen.heading).toBeVisible();
  });
  // The address actually sent: the asset's own when the list has it, else the list's row of its postal code.
  let address = report.address;
  await test.step('3-4. Condition, description, remarks, address, level, location remarks', async () => {
    address = await newAssetScreen.fill(report);
  });
  await test.step(`5. Upload Image > the newest photo (${galleryPhoto})`, async () => {
    await newAssetScreen.uploadNewestPhoto();
    await expect(newAssetScreen.changeImage).toBeVisible();
  });
  await test.step('6. SAVE returns to the home screen', async () => {
    await newAssetScreen.save();
    await expect(mobileHome.roleAndCostCentre).toBeVisible({ timeout: 60_000 });
  });

  let requestNo = '';
  await test.step('7. MHA web: one OPEN request by the mobile officer', async () => {
    let rows: string[][] = [];
    await webExpect(async () => {
      rows = await webNewAssetPage.search(report.description);
      webExpect(rows).toHaveLength(1);
    }).toPass({ timeout: 60_000 });
    const [no, description, cc, createdBy, , status] = rows[0];
    requestNo = no;
    expect(no).toMatch(/^RNA\d+$/);
    expect({ description, cc, status }).toEqual({ description: report.description, cc: costCentre, status: 'OPEN' });
    expect(sameName(createdBy, mobileOfficer)).toBe(true);
  });
  let shown: WebNewAsset | undefined;
  await test.step('7. The request holds what the phone sent, with the photo', async () => {
    await webNewAssetPage.open(requestNo);
    shown = await webNewAssetPage.read();
    expect(shown).toMatchObject({
      costCentre,
      condition: report.condition,
      description: report.description,
      remarks: report.remarks,
      postalCode: report.postalCode,
      address,
      level: report.level,
      locationRemarks: report.locationRemarks,
    });
    expect((shown as WebNewAsset).photos).toBeGreaterThan(0);
  });
  await test.step('8. Cleanup: Cancel Item', async () => {
    expect(await webNewAssetPage.cancelItem('Others', 'QA cleanup')).toBe('The reported new asset has been cancelled.');
    const rows = await webNewAssetPage.search(requestNo);
    expect(rows[0]?.[5]).toBe('CANCELLED');
  });
});
