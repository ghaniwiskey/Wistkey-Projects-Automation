import { test, expect, MOBILE_ROLES, blankable, unique } from '../../fixtures/pages.fixture';
import type { HomeScreen } from '../../pages/mobile/home.screen';
import type { RegistrationForm } from '../../pages/mobile/registration.screen';
import type { WebAsset, WebAssetPage } from '../../pages/web/web-asset.page';

// Test cases: projects/mha-mobile/cases/registration/MHM-013-*.md, MHM-023-*.md
// Data: a PROGRESS (partially registered) asset on MHA web whose cost centre the phone offers to LOGS1.
// Completing a registration cannot be undone, so MHM-013 uses one asset up per run and skips when none is
// left (UAT 2026-10-16: the only one in the officer's units, 111000011323, was used by the exploration).
test.use({ webRole: 'logs1' });

const LOGS1 = MOBILE_ROLES.logs1;

/** The first PROGRESS asset of MHA web Asset Listing in a cost centre the phone offers to LOGS1; skips when none. */
async function progressAsset(mobileHome: HomeScreen, webAssetPage: WebAssetPage, opts: { withRemarks?: boolean } = {}): Promise<WebAsset> {
  await mobileHome.openSwitch();
  await mobileHome.pickRole(LOGS1);
  const offered = await mobileHome.costCentreOptions();
  await mobileHome.closeSwitch();
  for (const c of (await webAssetPage.listedWithStatus('PROGRESS')).filter((a) => offered.includes(a.costCentre))) {
    await webAssetPage.gotoListing();
    await webAssetPage.openAsset(c.id);
    const asset = await webAssetPage.readAsset();
    if (!opts.withRemarks || blankable(asset.remarks)) return asset;
  }
  test.skip(true, `No PROGRESS asset${opts.withRemarks ? ' with location remarks' : ''} on MHA web in a cost centre the phone offers to ${LOGS1} (${offered.join(', ')}). Half-register one on web (Registration > Register, leave Block/Level/Room/Remarks empty) or give the mobile account a unit that has some.`);
  throw new Error('unreachable');
}

test('MHM-013: asset registration completes a progress asset from the phone @regression @writes', async ({
  mobileHome,
  registrationScreen,
  webAssetPage,
}) => {
  test.setTimeout(10 * 60_000);
  let a: WebAsset | undefined;
  await test.step('MHA web: a PROGRESS asset of a unit the phone offers', async () => {
    a = await progressAsset(mobileHome, webAssetPage);
  });
  const asset = a as WebAsset;
  const costCentre = asset.costCentre.split('/')[0].trim();
  const newRoom = `R${unique().slice(-4).toUpperCase()}`; // Room No holds 5 characters
  // The form does not pre-fill the remarks and saving clears them (BUG-004), so they are typed as they are.
  const remarks = blankable(asset.remarks);

  await test.step(`1. Phone: ${LOGS1} | ${costCentre}, Asset Registration lists ${asset.id}`, async () => {
    await mobileHome.switchTo(LOGS1, costCentre);
    await mobileHome.openTile('Asset Registration');
    await registrationScreen.expectList();
    test.skip(!(await registrationScreen.listedAssets()).includes(asset.id), `The phone's Register Asset list for ${costCentre} does not offer ${asset.id}. The Switch Role panel lets any cost centre be picked, but the list only holds units where the officer really is LOGS1/FALO.`);
  });
  let form: RegistrationForm | undefined;
  await test.step('2. Open it: the form pre-fills the asset\'s postal code, block, level and room', async () => {
    await registrationScreen.open(asset.id);
    form = await registrationScreen.readForm();
    expect(form.postalCode).toBe(asset.postalCode);
    expect(blankable(form.block, 'Block')).toBe(blankable(asset.block));
    expect(blankable(form.level, 'Level')).toBe(blankable(asset.level));
    expect(blankable(form.room, 'Room')).toBe(blankable(asset.roomNo));
  });
  await test.step(`2. Room ${newRoom}, remarks as they are, one photo, Save`, async () => {
    await registrationScreen.setField(registrationScreen.room, newRoom);
    await registrationScreen.setField(registrationScreen.remarks, remarks);
    await registrationScreen.uploadNewestPhoto();
    await registrationScreen.save();
    expect(await registrationScreen.listedAssets()).not.toContain(asset.id);
  });

  await test.step('3. MHA web: the asset is AVAILABLE in the new room with the photo, the rest unchanged', async () => {
    await webAssetPage.gotoListing();
    await webAssetPage.openAsset(asset.id);
    expect(await webAssetPage.hasDefaultPhoto()).toBe(true);
    const after = await webAssetPage.readAsset();
    expect(after.status).toBe('AVAILABLE');
    expect(after.roomNo).toBe(newRoom);
    expect({ postalCode: after.postalCode, block: after.block, level: after.level, remarks: after.remarks }).toEqual({
      postalCode: asset.postalCode,
      block: asset.block,
      level: asset.level,
      remarks: asset.remarks,
    });
  });
});

test('MHM-023: asset registration form pre-fills the asset\'s location remarks @regression', async ({
  mobileHome,
  registrationScreen,
  webAssetPage,
}) => {
  test.fail(true, 'BUG-004: the Register Asset form shows Remarks empty ("(Optional)") and saving clears the asset\'s remarks');
  test.setTimeout(8 * 60_000);
  let a: WebAsset | undefined;
  await test.step('1. MHA web: a PROGRESS asset with location remarks', async () => {
    a = await progressAsset(mobileHome, webAssetPage, { withRemarks: true });
  });
  const asset = a as WebAsset;
  await test.step('2. Phone: Asset Registration > the asset (no Save)', async () => {
    await mobileHome.switchTo(LOGS1, asset.costCentre.split('/')[0].trim());
    await mobileHome.openTile('Asset Registration');
    await registrationScreen.expectList();
    test.skip(!(await registrationScreen.listedAssets()).includes(asset.id), `The phone's Register Asset list for ${asset.costCentre} does not offer ${asset.id}. The Switch Role panel lets any cost centre be picked, but the list only holds units where the officer really is LOGS1/FALO.`);
    await registrationScreen.open(asset.id);
  });
  await test.step(`Remarks shows "${asset.remarks}"`, async () => {
    const form = await registrationScreen.readForm();
    await registrationScreen.leaveForm();
    expect(form.remarks).toBe(asset.remarks);
  });
});
