import { test, expect, MOBILE_ROLES, blankable, unique } from '../../fixtures/pages.fixture';
import type { HomeScreen } from '../../pages/mobile/home.screen';
import type { RegistrationForm, RegistrationScreen } from '../../pages/mobile/registration.screen';
import type { WebAsset, WebAssetPage } from '../../pages/web/web-asset.page';

// Test cases: projects/mha-mobile/cases/registration/MHM-013-*.md, MHM-023-*.md
// Data comes from the phone: the first PROGRESS asset its Register Asset list offers, trying the cost centres
// the officer holds as LOGS1 in order until one has a list (UAT 2026-10-16: 51 in 332140). MHA web
// is read as Agency Admin, the only web role of the test account that sees 332140.
// Completing a registration cannot be undone, so MHM-013 uses one asset up per run.
test.use({ webRole: 'agency-admin' });

const LOGS1 = MOBILE_ROLES.logs1;

type Found = { costCentre: string; asset: WebAsset };

/**
 * Phone: LOGS1 on each cost centre the officer holds as LOGS1, in order, until Asset Registration lists
 * some; the first listed asset that fits (with location remarks when asked) is read on MHA web. Leaves the
 * phone on the Register Asset list. Skips when none fits.
 */
async function phoneProgressAsset(
  mobileHome: HomeScreen,
  registrationScreen: RegistrationScreen,
  webAssetPage: WebAssetPage,
  opts: { withRemarks?: boolean } = {},
): Promise<Found> {
  const offered = await mobileHome.costCentresOf(LOGS1);
  const tried: string[] = [];
  // Each empty cost centre costs about a minute of the ~10-minute mobile session (BUG-001): try a few.
  for (const costCentre of offered.slice(0, 5)) {
    tried.push(costCentre);
    await mobileHome.switchTo(LOGS1, costCentre);
    await mobileHome.openTile('Asset Registration');
    await registrationScreen.expectList();
    // Only a few, to stay inside the ~10-minute mobile session (BUG-001).
    for (const id of (await registrationScreen.listedAssets()).slice(0, 3)) {
      await webAssetPage.openAnyAsset(id);
      const asset = await webAssetPage.readAsset();
      if (!opts.withRemarks || blankable(asset.remarks)) return { costCentre, asset };
    }
    await registrationScreen.close();
    await mobileHome.expectLoaded();
  }
  test.skip(
    true,
    `The phone's Asset Registration (${LOGS1}) lists no PROGRESS asset${opts.withRemarks ? ' with location remarks' : ''} in ${tried.join(', ') || 'any cost centre'}. Half-register an asset on web in a unit where the officer is LOGS1.`,
  );
  throw new Error('unreachable');
}

test('MHM-013: asset registration completes a progress asset from the phone @regression @writes', async ({
  mobileHome,
  registrationScreen,
  webAssetPage,
}) => {
  test.setTimeout(12 * 60_000);
  let found: Found | undefined;
  await test.step(`1. Phone: ${LOGS1}, Asset Registration lists a PROGRESS asset; MHA web: its location`, async () => {
    found = await phoneProgressAsset(mobileHome, registrationScreen, webAssetPage);
  });
  const { asset, costCentre } = found as Found;
  expect(asset.status).toBe('PROGRESS');
  const newRoom = `R${unique().slice(-4).toUpperCase()}`; // Room No holds 5 characters
  // The form does not pre-fill the remarks and saving clears them (BUG-004), so they are typed as they are.
  const remarks = blankable(asset.remarks);

  let form: RegistrationForm | undefined;
  await test.step(`2. Open ${asset.id} (${costCentre}): the form pre-fills the asset's postal code, block, level and room`, async () => {
    await registrationScreen.open(asset.id);
    form = await registrationScreen.readForm();
    expect(form.postalCode).toBe(asset.postalCode);
    expect(blankable(form.block, 'Block')).toBe(blankable(asset.block));
    expect(blankable(form.level, 'Level')).toBe(blankable(asset.level));
    expect(blankable(form.room, 'Room')).toBe(blankable(asset.roomNo));
  });
  let group = '';
  await test.step(`2. Room ${newRoom}, remarks as they are, Group/NPC/Base set, one photo, Save`, async () => {
    await registrationScreen.setField(registrationScreen.room, newRoom);
    // HTA PROGRESS assets can come without a group ("Select Location"; Save refuses): pick the asset's own or the first.
    group = await registrationScreen.ensureGroup(asset.group, asset.postalCode, asset.address);
    await registrationScreen.setField(registrationScreen.remarks, remarks);
    await registrationScreen.uploadNewestPhoto();
    await registrationScreen.save();
    expect(await registrationScreen.listedAssets()).not.toContain(asset.id);
  });

  await test.step('3. MHA web: the asset is AVAILABLE in the new room with the photo, the rest unchanged', async () => {
    await webAssetPage.openAnyAsset(asset.id);
    expect(await webAssetPage.hasDefaultPhoto()).toBe(true);
    const after = await webAssetPage.readAsset();
    expect(after.status).toBe('AVAILABLE');
    expect(after.roomNo).toBe(newRoom);
    // Web "Name (CODE)" or "CODE", phone "CODE" (as in MHM-006).
    const code = group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    expect(after.group).toMatch(new RegExp(`\\(${code}\\)$|^${code}$`));
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
  test.setTimeout(10 * 60_000);
  let found: Found | undefined;
  await test.step('1. Phone: Asset Registration lists a PROGRESS asset that has location remarks on MHA web', async () => {
    found = await phoneProgressAsset(mobileHome, registrationScreen, webAssetPage, { withRemarks: true });
  });
  const { asset } = found as Found;
  // Marked only once the data is found, so a setup failure is reported as a failure, not as BUG-004.
  test.fail(true, 'BUG-004: the Register Asset form shows Remarks empty ("(Optional)") and saving clears the asset\'s remarks');
  await test.step(`2. Open ${asset.id} (no Save): Remarks shows "${asset.remarks}"`, async () => {
    await registrationScreen.open(asset.id);
    const form = await registrationScreen.readForm();
    await registrationScreen.leaveForm();
    expect(form.remarks).toBe(asset.remarks);
  });
});
