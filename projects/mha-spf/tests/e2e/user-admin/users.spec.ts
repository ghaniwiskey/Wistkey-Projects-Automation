import { test, expect, ROLES, newQaUser } from '../../fixtures/pages.fixture';

// User > User Listing and Role Listing as Agency Admin. SPF has no user delete (HTA only), so SPF-044
// leaves one INACTIVE "QA auto user" per run and SPF-045/046 reuse the first one (fixture qaUser).
// New users log in in a second browser session (fixture otherSession), so the test account's
// session stays alive (one session per account).

// End User has the fewest rights and no real users on UAT; any role would do for the check.
const ROLE = ROLES.enduser;

test.describe('User admin: users and roles (writes)', () => {
  test.use({ role: 'agency-admin' });

  // Test case: projects/mha-spf/cases/user-admin/SPF-044-*.md
  test('SPF-044: agency admin creates a user in user listing @regression @writes', async ({ userListingPage }) => {
    test.slow();
    const user = newQaUser();
    let created = false;

    try {
      await test.step('1. An empty Create form shows the required messages', async () => {
        await userListingPage.goto();
        await userListingPage.openCreate();
        await userListingPage.clickSubmit();
        await expect(userListingPage.loginIdRequired).toBeVisible();
        await expect(userListingPage.unitRequired).toBeVisible();
        await expect(userListingPage.nameRequired).toBeVisible();
        await expect(userListingPage.statusRequired).toBeVisible();
      });

      let unit = '';
      await test.step(`2. Create ${user.loginId} under the first unit offered`, async () => {
        unit = await userListingPage.firstUnit();
        await userListingPage.fillNewUser({ ...user, unit });
        expect(await userListingPage.save()).toBe('User has been successfully created.');
        created = true;
      });

      await test.step('3. User Listing shows the new user, ACTIVE, no role mapped', async () => {
        await userListingPage.find(user.loginId);
        await expect(userListingPage.row(user.loginId)).toHaveCount(1);
        expect(await userListingPage.rowOf(user.loginId)).toEqual({ loginId: user.loginId, name: user.name, role: '', unit, status: 'ACTIVE' });
      });

      await test.step('4. The same Web Login ID cannot be created again', async () => {
        await userListingPage.openCreate();
        await userListingPage.fillNewUser({ loginId: user.loginId, name: `${user.name} dup`, unit });
        expect(await userListingPage.saveRefused()).toBe('Login ID already exist!');
        await userListingPage.find(user.loginId);
        await expect(userListingPage.row(user.loginId)).toHaveCount(1);
      });
    } finally {
      if (created) {
        await test.step('5. Cleanup: set the user INACTIVE', async () => {
          expect(await userListingPage.changeStatus(user.loginId, 'INACTIVE')).toBe('User has been successfully updated.');
          await userListingPage.find(user.loginId);
          expect((await userListingPage.rowOf(user.loginId)).status).toBe('INACTIVE');
        });
      }
    }
  });

  test.describe('role assignment', () => {
    test.beforeEach(async ({ roleListingPage, qaUser }) => {
      test.slow();
      await roleListingPage.openRole(ROLE);
      await roleListingPage.removeUserIfListed(qaUser.name);
    });

    test.afterEach(async ({ roleListingPage, qaUser }) => {
      await roleListingPage.openRole(ROLE);
      await roleListingPage.removeUserIfListed(qaUser.name);
    });

    // Test case: projects/mha-spf/cases/user-admin/SPF-045-*.md
    test('SPF-045: agency admin assigns a user to a role, the user logs in with it, and the role is removed again @regression @writes', async ({
      roleListingPage,
      userListingPage,
      otherSession,
      qaUser,
    }) => {
      await test.step(`1. Add ${qaUser.name} to ${ROLE}`, async () => {
        expect(await roleListingPage.addUser(qaUser.loginId, qaUser.loginId)).toBe('User assign into role have been successfully updated.');
        await expect(roleListingPage.userRow(qaUser.name)).toHaveCount(1);
        await expect(roleListingPage.userRow(qaUser.name)).toContainText('ACTIVE');
      });

      await test.step('2. User Listing shows the role mapped', async () => {
        await userListingPage.find(qaUser.loginId);
        expect((await userListingPage.rowOf(qaUser.loginId)).role).toBe(ROLE);
      });

      await test.step('3. The user logs in (second session) with that role', async () => {
        await otherSession.loginPage.goto();
        await otherSession.loginPage.login(qaUser.loginId);
        await otherSession.dashboardPage.expectLoaded();
        await expect(otherSession.dashboardPage.currentRole).toHaveText(ROLE);
        expect(await otherSession.dashboardPage.currentOfficer()).toBe(qaUser.name);
      });

      await test.step('4. Remove the user from the role (no confirmation)', async () => {
        await roleListingPage.openRole(ROLE);
        await roleListingPage.openUsersTab();
        expect(await roleListingPage.removeUser(qaUser.name)).toBe(`${ROLE} role has been removed from User ${qaUser.name}.`);
        await expect(roleListingPage.userRow(qaUser.name)).toHaveCount(0);
      });

      await test.step('5. User Listing shows no role mapped', async () => {
        await userListingPage.find(qaUser.loginId);
        expect((await userListingPage.rowOf(qaUser.loginId)).role).toBe('');
      });
    });
  });

  // Test case: projects/mha-spf/cases/user-admin/SPF-046-*.md
  test('SPF-046: a user set to inactive in user listing can no longer log in @regression @writes', async ({ userListingPage, otherSession, qaUser }) => {
    test.slow();
    await test.step(`1-2. Set ${qaUser.loginId} INACTIVE`, async () => {
      expect(await userListingPage.changeStatus(qaUser.loginId, 'INACTIVE')).toBe('User has been successfully updated.');
      await userListingPage.find(qaUser.loginId);
      expect((await userListingPage.rowOf(qaUser.loginId)).status).toBe('INACTIVE');
    });

    await test.step('3. Its login is refused (second session)', async () => {
      await otherSession.loginPage.goto();
      expect(await otherSession.loginPage.attemptLogin(qaUser.loginId)).toBe('Invalid username/password.');
      await expect(otherSession.loginPage.page).toHaveURL(/\/Account\/Login/);
    });
  });
});
