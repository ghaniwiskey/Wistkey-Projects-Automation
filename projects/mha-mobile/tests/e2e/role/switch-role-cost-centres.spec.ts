import { test, expect, MOBILE_ROLES } from '../../fixtures/pages.fixture';

// Test case: projects/mha-mobile/cases/role/MHM-024-*.md (read-only: only switches the app's role)
test('MHM-024: switch role offers only the cost centres of the role picked in the panel @regression', async ({
  mobileHome,
}) => {
  test.setTimeout(8 * 60_000);
  const role = MOBILE_ROLES.logs1;
  let offered: string[] = [];
  let held: string[] = [];
  await test.step(`1. After login, Switch > Select Role ${role}: the cost centres Select Cost Center offers`, async () => {
    const { role: active } = await mobileHome.active();
    test.skip(active === role, `The app started as ${role}; the check needs another active role`);
    await mobileHome.openSwitch();
    const roles = await mobileHome.roleOptions();
    test.skip(!roles.includes(role), `The mobile account has no ${role} role. It holds: ${roles.join(', ')}`);
    await mobileHome.pickRole(role);
    offered = await mobileHome.costCentreOptions();
    await mobileHome.closeSwitch();
  });
  await test.step(`2. Confirm ${role}, open Settings and go back, Switch: the cost centres ${role} holds`, async () => {
    held = await mobileHome.costCentresOf(role);
    expect(held.length).toBeGreaterThan(0);
  });
  // Marked only now, so a setup failure is reported as a failure, not as BUG-005.
  test.fail(true, 'BUG-005: Select Cost Center lists the previous role\'s cost centres (after login: all agency cost centres)');
  await test.step(`Step 1 offered exactly the cost centres ${role} holds`, async () => {
    expect(offered).toEqual(held);
  });
});
