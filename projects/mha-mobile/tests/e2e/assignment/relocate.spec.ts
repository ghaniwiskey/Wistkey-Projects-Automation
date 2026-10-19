import { test, expect, MOBILE_ROLES, blankable, sameName, unique } from '../../fixtures/pages.fixture';
import type { RelocateForm } from '../../pages/mobile/assign.screen';
import type { WebAsset } from '../../pages/web/web-asset.page';

// Test cases: projects/mha-mobile/cases/assignment/MHM-008-*.md, MHM-009-*.md
test.use({ webRole: 'logs1' });

test('MHM-008: relocation made on the mobile app is approved and moves the asset on mha web @smoke @writes', async ({
  mobileHome,
  mobileOfficer,
  phoneAsset,
  assignScreen,
  webAssetPage,
  webAssignmentPage,
}) => {
  test.setTimeout(10 * 60_000);
  const role = MOBILE_ROLES.logs1;
  const newRoom = `Q${unique().slice(-4).toUpperCase()}`; // Room No holds 5 characters
  let a: WebAsset | undefined;

  await test.step('1. MHA web: read the asset\'s location', async () => {
    a = await phoneAsset(role);
  });
  const asset = a as WebAsset;
  const costCentre = asset.costCentre.split('/')[0].trim();
  // The phone does not pre-fill the location remarks (BUG-002), so they are typed as they are.
  const remarks = blankable(asset.remarks);

  await test.step(`2. Phone: ${role} | ${costCentre}, Assign`, async () => {
    await mobileHome.switchTo(role, costCentre);
    await mobileHome.openTile('Assign');
    await assignScreen.expectLoaded();
  });
  await test.step(`3. Select ${asset.id}`, async () => {
    await assignScreen.selectAsset(asset.id);
  });
  let form: RelocateForm | undefined;
  await test.step('4. RELOCATE pre-fills the asset\'s location', async () => {
    await assignScreen.pickType('RELOCATE');
    form = await assignScreen.readRelocateForm();
    expect(form.postalCode).toBe(asset.postalCode);
    expect(blankable(form.block, 'Block')).toBe(blankable(asset.block));
    expect(blankable(form.level, 'Level')).toBe(blankable(asset.level));
    expect(blankable(form.room, 'Room')).toBe(blankable(asset.roomNo));
  });
  await test.step(`4. Room ${newRoom}, remarks as they are, Complete`, async () => {
    await assignScreen.setField(assignScreen.room, newRoom);
    await assignScreen.setField(assignScreen.remarks, remarks);
    await assignScreen.complete();
  });

  await test.step('5. MHA web: an APPROVED RELOCATE by the mobile officer', async () => {
    const mine = (await webAssignmentPage.newest()).find((t) => t.type === 'RELOCATE' && sameName(t.createdBy, mobileOfficer));
    expect(mine, 'newest RELOCATE by the mobile officer').toBeTruthy();
    expect(mine).toMatchObject({ costCentre, status: 'APPROVED', approverRole: '-' });
  });
  await test.step('5. MHA web: the asset is in the new room, the rest unchanged', async () => {
    await webAssetPage.gotoListing();
    await webAssetPage.openAsset(asset.id);
    const after = await webAssetPage.readAsset();
    expect(after.roomNo).toBe(newRoom);
    expect({ postalCode: after.postalCode, block: after.block, level: after.level, remarks: after.remarks }).toEqual({
      postalCode: asset.postalCode,
      block: asset.block,
      level: asset.level,
      remarks: asset.remarks,
    });
  });

  await test.step('6. Cleanup: relocate it back from the phone', async () => {
    await assignScreen.relocate(asset.id, blankable(asset.roomNo), remarks);
    await webAssetPage.gotoListing();
    await webAssetPage.openAsset(asset.id);
    const restored = await webAssetPage.readAsset();
    expect({ roomNo: restored.roomNo, remarks: restored.remarks }).toEqual({ roomNo: asset.roomNo, remarks: asset.remarks });
  });
});

test('MHM-009: relocate form pre-fills the asset\'s location remarks @regression', async ({ mobileHome, phoneAsset, assignScreen }) => {
  test.setTimeout(8 * 60_000);
  const role = MOBILE_ROLES.logs1;
  let a: WebAsset | undefined;
  await test.step('1. MHA web: an asset with location remarks', async () => {
    a = await phoneAsset(role, { withRemarks: true });
  });
  const asset = a as WebAsset;
  await test.step('2. Phone: Assign > the asset > RELOCATE', async () => {
    await mobileHome.switchTo(role, asset.costCentre.split('/')[0].trim());
    await mobileHome.openTile('Assign');
    await assignScreen.expectLoaded();
    await assignScreen.selectAsset(asset.id);
    await assignScreen.pickType('RELOCATE');
  });
  // Marked only now, so a setup failure is reported as a failure, not as BUG-002.
  test.fail(true, 'BUG-002: the Relocate form always shows "No Remarks" instead of the asset\'s location remarks');
  await test.step(`Remarks shows "${asset.remarks}" (nothing is submitted)`, async () => {
    const form = await assignScreen.readRelocateForm();
    expect(form.remarks).toBe(asset.remarks);
  });
});
