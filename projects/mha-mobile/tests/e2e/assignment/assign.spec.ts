import { test, expect, webExpect, MOBILE_ROLES, WEB_ROLES, sameName } from '../../fixtures/pages.fixture';
import type { AssignScreen } from '../../pages/mobile/assign.screen';
import type { WebAsset } from '../../pages/web/web-asset.page';
import type { AssignmentRow } from '../../pages/web/web-assignment.page';

// Test cases: projects/mha-mobile/cases/assignment/MHM-014-*.md, MHM-015-*.md, MHM-016-*.md
// Assign transactions made on the phone, checked (and approved) on MHA web. The asset is found at runtime:
// the first one the phone lists for Assignee (LOGS1) = the mobile officer, in the cost centre of the first
// AVAILABLE web asset the phone offers (phoneAsset). Approval rules (mha-spf context): LOGS1 > FALO is
// auto-approved, FALO > LOGS1 waits for LOGS1, LOGS1 > LOGS1 (recall) waits for the URO.
test.use({ webRole: 'logs1' });

const LOGS1 = MOBILE_ROLES.logs1;
const FALO = MOBILE_ROLES.falo;

/** Cost centre of the first AVAILABLE MHA web asset whose cost centre the phone offers to LOGS1. */
function costCentreOf(unit: WebAsset): string {
  return unit.costCentre.split('/')[0].trim();
}

/** Phone Select Asset: the first asset whose LOGS1 is the officer; skips the test when there is none. */
async function selectOwnedAsset(assignScreen: AssignScreen, officer: string, costCentre: string): Promise<string> {
  const id = await assignScreen.selectFirstAssetOf(officer);
  test.skip(!id, `The phone lists no selectable asset of ${costCentre} with Assignee (LOGS1) = ${officer}. Make the officer the LOGS1 of one (MHM-016 recall) or use another unit.`);
  return id as string;
}

test('MHM-014: assignment to a falo made on the mobile app is auto-approved on mha web @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  phoneAsset,
  assignScreen,
  webAssetPage,
  webAssignmentPage,
}) => {
  test.setTimeout(10 * 60_000);
  let unit: WebAsset | undefined;
  await test.step('MHA web: a cost centre of the phone', async () => {
    unit = await phoneAsset(LOGS1);
  });
  const costCentre = costCentreOf(unit as WebAsset);

  let asset = '';
  await test.step(`1-2. Phone: ${LOGS1} | ${costCentre}, Assign, select the first asset of ${mobileOfficer}`, async () => {
    await mobileHome.switchTo(LOGS1, costCentre);
    await mobileHome.openTile('Assign');
    await assignScreen.expectLoaded();
    asset = await selectOwnedAsset(assignScreen, mobileOfficer, costCentre);
  });

  let before = { logs1: '', falo: '' };
  await test.step(`3. MHA web: ownership of ${asset}`, async () => {
    before = await webAssetPage.ownership(asset);
    expect(sameName(before.logs1, mobileOfficer)).toBe(true);
  });

  let falo = '';
  await test.step('4. Phone: ASSIGN to Fixed Asset Liaison Officer = the first FALO who is not the current one, Complete', async () => {
    const users = await assignScreen.usersFor(FALO);
    falo = users.find((u) => !sameName(u, before.falo)) ?? '';
    expect(falo, 'a FALO other than the current one').not.toBe('');
    await assignScreen.chooseUserAndComplete(falo);
  });

  await test.step('5. MHA web: the newest transaction of the asset is an APPROVED ASSIGN by the mobile officer', async () => {
    const t = (await webAssignmentPage.newestFor(asset)) as AssignmentRow;
    expect(t, `a transaction for ${asset}`).toBeTruthy();
    expect(sameName(t.createdBy, mobileOfficer)).toBe(true);
    expect(t).toMatchObject({ type: 'ASSIGN', costCentre, approverRole: '-', status: 'APPROVED' });
  });
  await test.step(`5. MHA web: Current FALO is ${falo}, Current LOGS1 unchanged`, async () => {
    const after = await webAssetPage.ownership(asset);
    expect(sameName(after.falo, falo)).toBe(true);
    expect(after.logs1).toBe(before.logs1);
  });
});

test('MHM-016: recall made on the mobile app needs uro approval and clears the falo @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  phoneAsset,
  assignScreen,
  webAssetPage,
  webAssignmentPage,
}) => {
  test.setTimeout(10 * 60_000);
  let unit: WebAsset | undefined;
  await test.step('MHA web: a cost centre of the phone', async () => {
    unit = await phoneAsset(LOGS1);
  });
  const costCentre = costCentreOf(unit as WebAsset);

  let asset = '';
  await test.step(`Phone: ${LOGS1} | ${costCentre}, Assign, select the first asset of ${mobileOfficer}`, async () => {
    await mobileHome.switchTo(LOGS1, costCentre);
    await mobileHome.openTile('Assign');
    await assignScreen.expectLoaded();
    asset = await selectOwnedAsset(assignScreen, mobileOfficer, costCentre);
  });

  await test.step('1. Setup: the asset has a FALO (else assign it to the first FALO who is not the officer)', async () => {
    const before = await webAssetPage.ownership(asset);
    if (before.falo !== '-') return;
    const users = await assignScreen.usersFor(FALO);
    const falo = users.find((u) => !sameName(u, mobileOfficer)) ?? '';
    expect(falo, 'a FALO other than the officer').not.toBe('');
    await assignScreen.chooseUserAndComplete(falo);
    expect(sameName((await webAssetPage.ownership(asset)).falo, falo)).toBe(true);
    await assignScreen.selectAsset(asset);
  });

  let recall: AssignmentRow | undefined;
  await test.step(`2. Phone: ASSIGN to ${LOGS1} = ${mobileOfficer}, Complete`, async () => {
    await assignScreen.assignTo(LOGS1, mobileOfficer);
  });
  await test.step('3. MHA web: the recall is SUBMITTED for the Unit Resource Officer', async () => {
    recall = await webAssignmentPage.newestFor(asset);
    expect(recall, `a transaction for ${asset}`).toBeTruthy();
    expect(sameName(recall?.createdBy ?? '', mobileOfficer)).toBe(true);
    expect(recall).toMatchObject({ type: 'ASSIGN', costCentre, approverRole: WEB_ROLES.uro, status: 'SUBMITTED' });
  });
  await test.step('4. MHA web as Unit Resource Officer: Approve', async () => {
    await webAssignmentPage.useRole(WEB_ROLES.uro);
    await webAssignmentPage.open((recall as AssignmentRow).no);
    expect(await webAssignmentPage.approve()).toBe('Assignment has been approved');
    await webExpect(webAssignmentPage.detailStatus).toHaveText('APPROVED');
  });
  await test.step('5. MHA web: Current LOGS1 is the officer, Current FALO "-"', async () => {
    const after = await webAssetPage.ownership(asset);
    expect(sameName(after.logs1, mobileOfficer)).toBe(true);
    expect(after.falo).toBe('-');
  });
});

test('MHM-015: falo return made on the mobile app is approved by logs1 on mha web @regression @writes', async ({
  mobileHome,
  mobileOfficer,
  phoneAsset,
  assignScreen,
  webAssetPage,
  webAssignmentPage,
}) => {
  test.setTimeout(10 * 60_000);
  let unit: WebAsset | undefined;
  await test.step('MHA web: a cost centre of the phone', async () => {
    unit = await phoneAsset(LOGS1);
  });
  const costCentre = costCentreOf(unit as WebAsset);

  let asset = '';
  await test.step(`1. Setup, phone ${LOGS1} | ${costCentre}: assign the officer's first asset to ${FALO} = ${mobileOfficer}`, async () => {
    await mobileHome.switchTo(LOGS1, costCentre);
    await mobileHome.openTile('Assign');
    await assignScreen.expectLoaded();
    asset = await selectOwnedAsset(assignScreen, mobileOfficer, costCentre);
    await assignScreen.assignTo(FALO, mobileOfficer);
    const owner = await webAssetPage.ownership(asset);
    expect(sameName(owner.falo, mobileOfficer)).toBe(true);
    await assignScreen.close();
  });

  await test.step(`2-3. Phone: ${FALO} | ${costCentre}, Assign the asset to ${LOGS1} = ${mobileOfficer}`, async () => {
    await mobileHome.expectLoaded();
    await mobileHome.switchTo(FALO, costCentre);
    await mobileHome.openTile('Assign');
    await assignScreen.expectLoaded();
    await assignScreen.selectAsset(asset);
    await assignScreen.assignTo(LOGS1, mobileOfficer);
  });

  let ret: AssignmentRow | undefined;
  await test.step('4. MHA web: the return is SUBMITTED for Logistics Officer 1; LOGS1 approves', async () => {
    ret = await webAssignmentPage.newestFor(asset);
    expect(ret, `a transaction for ${asset}`).toBeTruthy();
    expect(sameName(ret?.createdBy ?? '', mobileOfficer)).toBe(true);
    expect(ret).toMatchObject({ type: 'ASSIGN', costCentre, approverRole: WEB_ROLES.logs1, status: 'SUBMITTED' });
    await webAssignmentPage.open((ret as AssignmentRow).no);
    expect(await webAssignmentPage.approve()).toBe('Assignment has been approved');
  });
  await test.step('5. MHA web: Current LOGS1 is the officer, Current FALO "-"', async () => {
    const after = await webAssetPage.ownership(asset);
    expect(sameName(after.logs1, mobileOfficer)).toBe(true);
    expect(after.falo).toBe('-');
  });
});
