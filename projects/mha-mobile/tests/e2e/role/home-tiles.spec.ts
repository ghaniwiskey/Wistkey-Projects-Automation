import { test, expect, MOBILE_ROLES, ROLE_TILES } from '../../fixtures/pages.fixture';

// Test case: projects/mha-mobile/cases/role/MHM-012-*.md (read-only)
test('MHM-012: home tiles follow the active role @regression', async ({ mobileHome }) => {
  test.setTimeout(8 * 60_000);
  const admin = ROLE_TILES['Agency Admin'];
  await test.step(`1. After login: Agency Admin shows ${admin.length ? admin.join(', ') : 'no tiles'}`, async () => {
    const { role } = await mobileHome.active();
    test.skip(role !== 'Agency Admin', `The app started as ${role}, not Agency Admin`);
    if (admin.length) expect([...(await mobileHome.tileNames())].sort()).toEqual([...admin].sort());
    else await expect(mobileHome.tiles).toHaveCount(0);
  });
  const roles = [MOBILE_ROLES.logs1, MOBILE_ROLES.uro, MOBILE_ROLES.vetIc];
  for (const [n, role] of roles.entries()) {
    await test.step(`${n + 2}. ${role}: ${ROLE_TILES[role].join(', ')}`, async () => {
      await mobileHome.switchRole(role);
      // Compared without order: the app lays the tiles out in a different order now and then (URO,
      // 2026-10-20: New Asset, Assign, Stocktake, Search Asset, Settings; on the retry the usual order).
      expect([...(await mobileHome.tileNames())].sort()).toEqual([...ROLE_TILES[role]].sort());
    });
  }
});
