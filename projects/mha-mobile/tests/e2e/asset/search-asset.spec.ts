import { test, expect, MOBILE_ROLES, amount, blankable } from '../../fixtures/pages.fixture';
import type { MobileAsset } from '../../pages/mobile/search-asset.screen';
import type { WebAsset } from '../../pages/web/web-asset.page';

// Test case: projects/mha-mobile/cases/asset/MHM-006-*.md (read-only)
test.use({ webRole: 'logs1' });

test('MHM-006: search asset shows the same asset data as mha web @regression', async ({
  mobileHome,
  webAssetPage,
  searchAssetScreen,
}) => {
  test.setTimeout(6 * 60_000);
  const role = MOBILE_ROLES.stocktaker;
  let web: WebAsset | undefined;

  await test.step('1. MHA web: first AVAILABLE asset whose cost centre the phone offers', async () => {
    const offered = await mobileHome.costCentresOf(role);
    const pick = (await webAssetPage.listedWithStatus('AVAILABLE')).find((a) => offered.includes(a.costCentre));
    test.skip(!pick, `No AVAILABLE asset on the first MHA web listing page belongs to a cost centre the phone offers (${offered.join(', ')})`);
    await webAssetPage.openAsset(pick!.id);
    web = await webAssetPage.readAsset();
  });
  const w = web as WebAsset;
  const costCentre = w.costCentre.split('/')[0].trim();

  await test.step(`2. Phone: Stocktaker | ${costCentre}, Search Asset`, async () => {
    await mobileHome.switchTo(role, costCentre);
    await mobileHome.openTile('Search Asset');
    await searchAssetScreen.expectLoaded();
  });
  await test.step(`3. Search ${w.id}`, async () => {
    await searchAssetScreen.search(w.id);
    await expect(searchAssetScreen.resultDescriptions).toHaveCount(1, { timeout: 30_000 });
    await expect(searchAssetScreen.resultDescriptions).toHaveText(`Asset Desc 1: ${w.description}`);
    await expect(searchAssetScreen.resultSerials).toHaveText(`Asset Serial No: ${w.serial}`);
    await expect(searchAssetScreen.resultIds2).toHaveText(`Asset ID 2: ${w.id2}`);
  });

  let m: MobileAsset | undefined;
  await test.step('4. Open the result', async () => {
    await searchAssetScreen.openFirstResult();
    m = await searchAssetScreen.readDetail();
  });
  const p = m as MobileAsset;
  await test.step('Main data equals MHA web (same values, app formats)', async () => {
    expect(p.assetNo).toBe(w.id);
    expect(p.assetId2).toBe(w.id2);
    expect(p.serial).toBe(w.serial);
    expect(w.category.split('/')[0].trim()).toBe(p.category); // web "1KZ0 / Mechanical & ...", phone "1KZ0"
    expect(p.capitalisationDate).toBe(w.capitalisedOn);
    expect(amount(p.acquisitionValue)).toBe(amount(w.acquisitionValue)); // "$26145.0" vs "$26,145.00"; "$1.36449E8" (BUG-006) is read too
    expect(p.description1).toBe(w.description);
    expect(p.status).toBe(w.status);
    expect(p.sensitive).toBe(w.sensitivity === 'Yes');
  });
  await test.step('Location equals MHA web', async () => {
    expect(w.group).toMatch(new RegExp(`\\(${p.group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)$|^${p.group}$`)); // web "Airport Police Division (APD)", phone "APD"
    expect(p.building).toBe(w.building);
    expect(p.address).toBe(w.address);
    expect(p.postalCode).toBe(w.postalCode);
    // Empty fields: web "-", phone "" or the field's hint (HTA 101000000323 has no block, level or room).
    expect(blankable(p.block, 'Block')).toBe(blankable(w.block));
    expect(blankable(p.level, 'Level')).toBe(blankable(w.level));
    expect(blankable(p.room, 'Room')).toBe(blankable(w.roomNo));
    expect(p.locationRemarks).toBe(w.remarks === '-' ? '' : w.remarks);
  });
  // BUG-006: amounts of $10 million and more show in scientific notation ("$1.36449E8"). Marked as expected to
  // fail only when this run's asset is one of them, so a smaller asset still checks the format.
  test.fail(/\dE\d/i.test(p.acquisitionValue), 'BUG-006: the phone shows amounts of $10 million and more in scientific notation');
  await test.step(`Acquisition Value "${p.acquisitionValue}" is a plain amount (no exponent)`, async () => {
    expect(p.acquisitionValue).not.toMatch(/\dE\d/i);
  });
});
