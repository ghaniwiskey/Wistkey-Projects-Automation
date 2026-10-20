import { test, expect, MOBILE_ROLES } from '../../fixtures/pages.fixture';

// Test case: projects/mha-mobile/cases/role/MHM-024-*.md (read-only: only switches the app's role)
test('MHM-024: switch role offers only the cost centres of the role picked in the panel @regression', async ({
  mobileHome,
}) => {
  test.setTimeout(8 * 60_000);
  const role = MOBILE_ROLES.logs1;
  let before: string[] = [];
  let offered: string[] = [];
  let held: string[] = [];
  let started = '';
  await test.step(`1. After login, Switch > Select Role ${role}: the cost centres Select Cost Center offers`, async () => {
    const { role: active } = await mobileHome.active();
    started = active;
    test.skip(active === role, `The app started as ${role}; the check needs another active role`);
    await mobileHome.openSwitch();
    const roles = await mobileHome.roleOptions();
    test.skip(!roles.includes(role), `The mobile account has no ${role} role. It holds: ${roles.join(', ')}`);
    // The starting role's list first: the bug shows as the panel keeping it for the role picked next.
    before = await mobileHome.costCentreOptions();
    await mobileHome.pickRole(role);
    offered = await mobileHome.costCentreOptions();
    await mobileHome.closeSwitch();
  });
  await test.step(`2. Confirm ${role}, open Settings and go back, Switch: the cost centres ${role} holds`, async () => {
    held = await mobileHome.costCentresOf(role, { fresh: true }); // this test checks the panel itself: no remembered list
    expect(held.length).toBeGreaterThan(0);
  });
  // The bug can only show when the two roles hold different cost centres. HTA 2026-10-20: the test account holds
  // all 8 units in every role, so the lists are the same whatever the panel does.
  const sameSet = (a: string[], b: string[]) => [...a].sort().join('|') === [...b].sort().join('|');
  test.skip(sameSet(before, held), `The ${started} and ${role} roles hold the same cost centres (${held.join(', ')}): BUG-005 cannot show with this account`);
  // Marked only now, so a setup failure is reported as a failure, not as BUG-005.
  test.fail(true, 'BUG-005: Select Cost Center lists the previous role\'s cost centres (after login: all agency cost centres)');
  await test.step(`Step 1 offered exactly the cost centres ${role} holds`, async () => {
    expect(offered).toEqual(held);
  });
});
