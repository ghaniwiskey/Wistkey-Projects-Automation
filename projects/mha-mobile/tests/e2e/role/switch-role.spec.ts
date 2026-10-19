import { test, expect, MOBILE_ROLES } from '../../fixtures/pages.fixture';

// Test case: projects/mha-mobile/cases/role/MHM-004-*.md
test('MHM-004: switching to stocktaker and a cost centre shows only that cost centre\'s stocktakes @smoke', async ({
  mobileHome,
  stocktakeListScreen,
}) => {
  const role = MOBILE_ROLES.stocktaker;
  let costCentre = '';
  await test.step('1. Log in (fixture) and pick a cost centre other than the active one', async () => {
    const { costCentre: current } = await mobileHome.active();
    await mobileHome.openSwitch();
    const roles = await mobileHome.roleOptions();
    test.skip(!roles.includes(role), `The mobile account has no ${role} role. It holds: ${roles.join(', ')}`);
    await mobileHome.closeSwitch();
    // The panel lists the previous role's cost centres until home is shown again (BUG-005): read the
    // Stocktaker's own units, then take one other than where the app stands now.
    const held = await mobileHome.costCentresOf(role);
    const { costCentre: now } = await mobileHome.active();
    costCentre = held.find((c) => c !== current && c !== now) ?? held.find((c) => c !== now) ?? '';
    test.skip(!costCentre, `The ${role} role holds no cost centre other than ${now} (${held.join(', ')})`);
  });
  await test.step(`2. Switch to ${role} and the cost centre`, async () => {
    await mobileHome.switchTo(role, costCentre);
  });
  await test.step('Bottom bar shows the role and cost centre; the Stocktaker tiles show', async () => {
    await expect(mobileHome.roleAndCostCentre).toHaveText(`${role} | ${costCentre}`);
    expect(await mobileHome.tileNames()).toEqual(['Search Asset', 'Stocktake', 'New Asset', 'Settings']);
  });
  await test.step('3. Open Stocktake', async () => {
    await mobileHome.openTile('Stocktake');
    await stocktakeListScreen.expectLoaded();
  });
  await test.step('The list holds only stocktakes of that cost centre, and the count matches', async () => {
    const total = await stocktakeListScreen.total();
    const numbers = await stocktakeListScreen.stocktakeNumbers();
    const names = await stocktakeListScreen.stocktakeNames();
    expect(numbers.length).toBe(total);
    if (total === 0) await expect(stocktakeListScreen.empty).toBeVisible();
    for (const n of numbers) expect(n).toMatch(/^FAVE FY\d{2}-20\d{2}$/);
    for (const n of names) expect(n).toMatch(new RegExp(`^${costCentre} - \\S`));
  });
});
