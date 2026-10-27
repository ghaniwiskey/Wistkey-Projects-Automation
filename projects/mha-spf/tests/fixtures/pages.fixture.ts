import { test as base } from '@playwright/test';
import { forgetSession, resaveSession, savedSession } from '@shared/auth/session';
import { SessionEndedError } from '@shared/mha-ats/pages/base.page';
import { LoginPage } from '@shared/mha-ats/pages/login.page';
import { DashboardPage } from '@shared/mha-ats/pages/dashboard.page';
import { AssetListingPage } from '@shared/mha-ats/pages/asset-listing.page';
import { AssetDetailsPage } from '@shared/mha-ats/pages/asset-details.page';
import { AssignmentPage } from '@shared/mha-ats/pages/assignment.page';
import { AssignmentCreatePage } from '@shared/mha-ats/pages/assignment-create.page';
import { AssignmentFormPage } from '@shared/mha-ats/pages/assignment-form.page';
import { RegistrationPage } from '@shared/mha-ats/pages/registration.page';
import { RejectionPage } from '@shared/mha-ats/pages/rejection.page';
import { NewAssetCreatePage, NewAssetFormPage, NewAssetListPage } from '@shared/mha-ats/pages/new-asset.page';
import { FavePage } from '@shared/mha-ats/pages/fave.page';
import { AdHocCreatePage, AdHocListingPage, AdHocSetupPage } from '@shared/mha-ats/pages/adhoc.page';
import { AssetReportPage } from '@shared/mha-ats/pages/asset-report.page';
import { PrintTagPage } from '@shared/mha-ats/pages/print-tag.page';
import { RetirementPage } from '@shared/mha-ats/pages/retirement.page';
import { GroupPage } from '@shared/mha-ats/pages/group.page';
import { ReportPage } from '@shared/mha-ats/pages/report.page';
import { FollowUpPage } from '@shared/mha-ats/pages/follow-up.page';
import { FaveHqPage } from '@shared/mha-ats/pages/fave-hq.page';
import { RoleListingPage, UserListingPage } from '@shared/mha-ats/pages/user-admin.page';
import { AnnouncementPage, CostCentrePage, EmailTemplatePage } from '@shared/mha-ats/pages/settings-admin.page';
import { ACCOUNT_ENV, QA_USER_NAME, ROLES, RoleSlug, newQaUser, testAccount } from '../utils/test-data';
import type { ListedAsset } from '@shared/mha-ats/pages/asset-listing.page';

/** The assignment write tests share one asset per worker, so their cleanup always targets it. */
let writableAssetId: string | undefined;
/** The test account's officer name, read once per worker from the page header. */
let officerName: string | undefined;
/** Postal code of an existing asset of the account's unit, read once per worker. */
let unitPostal: string | undefined;

type Options = {
  /**
   * Start the test logged in with this role active: `test.use({ role: 'logs1' })`.
   * Logs in once per account and reuses the saved session (shared/auth/session.ts); the role is
   * switched on the dashboard before the test body runs. Leave unset for tests of the login itself.
   */
  role: RoleSlug | undefined;
};

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  assetListingPage: AssetListingPage;
  assetDetailsPage: AssetDetailsPage;
  assignmentPage: AssignmentPage;
  assignmentCreatePage: AssignmentCreatePage;
  assignmentFormPage: AssignmentFormPage;
  registrationPage: RegistrationPage;
  rejectionPage: RejectionPage;
  newAssetListPage: NewAssetListPage;
  newAssetCreatePage: NewAssetCreatePage;
  newAssetFormPage: NewAssetFormPage;
  favePage: FavePage;
  adHocSetupPage: AdHocSetupPage;
  adHocCreatePage: AdHocCreatePage;
  adHocListingPage: AdHocListingPage;
  assetReportPage: AssetReportPage;
  printTagPage: PrintTagPage;
  retirementPage: RetirementPage;
  groupPage: GroupPage;
  reportPage: ReportPage;
  followUpPage: FollowUpPage;
  faveHqPage: FaveHqPage;
  userListingPage: UserListingPage;
  roleListingPage: RoleListingPage;
  announcementPage: AnnouncementPage;
  costCentrePage: CostCentrePage;
  emailTemplatePage: EmailTemplatePage;
  /**
   * A second, logged-out browser session (own cookies) for logging in as another user or looking at the
   * login page without ending the test account's session. Closed after the test.
   */
  otherSession: { loginPage: LoginPage; dashboardPage: DashboardPage };
  /**
   * User admin tests (SPF-045/046, Agency Admin active): a "QA auto user" made ACTIVE, the first one User
   * Listing finds, created (first unit offered) when none exists. SPF has no user delete, so the tests
   * reuse these users instead of creating one per test.
   */
  qaUser: { loginId: string; name: string };
  /**
   * Cleanup for write tests: cancel every SUBMITTED assignment transaction on the asset (as owner,
   * reason Others), so the asset can be selected again. Returns the cancelled transaction numbers.
   */
  cancelOpenAssignments: (assetId: string) => Promise<string[]>;
  /** Cleanup for write tests: cancel OPEN new-asset reports whose description contains the text. */
  cancelOpenNewAssets: (descriptionText: string) => Promise<string[]>;
  /**
   * Cleanup for write tests: cancel CREATED (not yet started) ad hoc stocktakes whose name contains the
   * text. One-off setups are SUBMITTED at once and cannot be cancelled, so they stay.
   */
  cancelCreatedAdHocs: (nameText: string) => Promise<string[]>;
  /**
   * Setup/cleanup for FAVE approval tests: whatever level the cost centre's FAVE is at (UAO or URO),
   * reject it down until it is back with VET IC, then make VET IC the active role again.
   * Returns the roles that rejected. Never approves (UAO approval is final).
   */
  returnFaveToVetIc: (costCentre: string) => Promise<string[]>;
  /**
   * The FAVE cost centre the repeatable FAVE tests work on: the first cost centre of the current FAVE that
   * is not APPROVED, brought back to VET IC (VET IC active), with its first asset.
   * Skips the test when every listed cost centre is approved.
   */
  faveTarget: { costCentre: string; asset: string };
  /**
   * FAVE relocation test (SPF-039): the first cost centre of the current FAVE that is not APPROVED and has a
   * PENDING asset whose Assignee (LOGS1) is the test account, so the account can approve the relocation.
   * Brought back to VET IC (VET IC active). Skips when none is left: an approved FAVE relocation locks the
   * asset's result (accepted, BUG-009 wont-fix), so every run uses one asset up.
   */
  faveRelocateTarget: { costCentre: string; asset: string };
  /** Read-only tests: the first AVAILABLE asset in Asset Listing (as LOGS1), with what its row shows. Skips when none. */
  availableAsset: ListedAsset;
  /**
   * Assignment write tests: an asset in the Assign > Choose Asset list (selectable), preferably owned by
   * the test account as LOGS1. Found once per worker and shared by all assignment write tests.
   */
  writableAsset: string;
  /**
   * A real address of the account's unit for registration and new-asset reports: the Postal Code on the
   * Location tab of the first AVAILABLE asset (no fixed address, so it works for any agency/unit).
   * Skips when that asset has no postal code.
   */
  unitPostalCode: string;
  /** The test account's officer name, read from the page header (not fixed in the code). */
  officer: string;
  /** Log in through the UI with the test account and make the role active. Prefer `test.use({ role })`. */
  loginAs: (role: RoleSlug) => Promise<DashboardPage>;
  /** Internal: puts a test that set `role` on the dashboard with that role active. */
  activeRole: void;
};

/** Page objects as fixtures: specs ask for what they need instead of constructing it. */
export const test = base.extend<Options & PageFixtures>({
  role: [undefined, { option: true }],

  storageState: async ({ role, storageState, browser, baseURL, viewport }, use, testInfo) => {
    if (!role) return use(storageState);
    const account = testAccount();
    await use(
      await savedSession(browser, {
        project: 'mha-spf',
        env: String(testInfo.project.metadata.env || ''),
        account: account.username,
        contextOptions: { baseURL, viewport },
        login: async (page) => {
          const loginPage = new LoginPage(page);
          await loginPage.goto();
          await loginPage.login(account.username, account.password);
          await new DashboardPage(page).expectLoaded();
        },
        isLoggedIn: async (page) => {
          await page.goto('IndexBk');
          return /\/IndexBk/.test(page.url()) && (await new DashboardPage(page).heading.isVisible());
        },
      }),
    );
  },

  activeRole: [
    async ({ role, page }, use, testInfo) => {
      if (role) {
        const dashboard = new DashboardPage(page);
        const label = ROLES[role];
        try {
          await dashboard.goto();
          // Roles come from the account itself (header Role dropdown), not from a fixed list.
          const roles = await dashboard.availableRoles();
          testInfo.skip(!roles.includes(label), `The test account (${ACCOUNT_ENV.user}) has no role "${label}". It holds: ${roles.join(', ')}`);
          await dashboard.switchRole(label);
        } catch (e) {
          // ATS allows one session per account, so a newer login (SPF-001, a person, Aside) ends the
          // saved one. Log in again on this page, save the new session for later tests, and continue.
          if (!(e instanceof SessionEndedError) && !dashboard.isLoginUrl()) throw e;
          const account = testAccount();
          const loginPage = new LoginPage(page);
          await loginPage.goto();
          await loginPage.login(account.username, account.password);
          await dashboard.expectLoaded();
          await resaveSession(page, 'mha-spf', String(testInfo.project.metadata.env || ''), account.username);
          await dashboard.switchRole(label);
        }
      }
      await use();
    },
    { auto: true },
  ],

  loginPage: async ({ page }, use, testInfo) => {
    await use(new LoginPage(page));
    // A test that logs in or out through the UI ends the saved session (one session per account).
    // The dead session still loads pages and only fails on the next server action, so drop it now
    // and let the next test log in again.
    const env = String(testInfo.project.metadata.env || '');
    if (process.env[ACCOUNT_ENV.user]) forgetSession('mha-spf', env, testAccount().username);
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  assetListingPage: async ({ page }, use) => {
    await use(new AssetListingPage(page));
  },
  assetDetailsPage: async ({ page }, use) => {
    await use(new AssetDetailsPage(page));
  },
  assignmentPage: async ({ page }, use) => {
    await use(new AssignmentPage(page));
  },
  assignmentCreatePage: async ({ page }, use) => {
    await use(new AssignmentCreatePage(page));
  },
  assignmentFormPage: async ({ page }, use) => {
    await use(new AssignmentFormPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  rejectionPage: async ({ page }, use) => {
    await use(new RejectionPage(page));
  },
  newAssetListPage: async ({ page }, use) => {
    await use(new NewAssetListPage(page));
  },
  newAssetCreatePage: async ({ page }, use) => {
    await use(new NewAssetCreatePage(page));
  },
  newAssetFormPage: async ({ page }, use) => {
    await use(new NewAssetFormPage(page));
  },
  favePage: async ({ page }, use) => {
    await use(new FavePage(page));
  },
  adHocSetupPage: async ({ page }, use) => {
    await use(new AdHocSetupPage(page));
  },
  adHocCreatePage: async ({ page }, use) => {
    await use(new AdHocCreatePage(page));
  },
  adHocListingPage: async ({ page }, use) => {
    await use(new AdHocListingPage(page));
  },
  assetReportPage: async ({ page }, use) => {
    await use(new AssetReportPage(page));
  },
  printTagPage: async ({ page }, use) => {
    await use(new PrintTagPage(page));
  },
  retirementPage: async ({ page }, use) => {
    await use(new RetirementPage(page));
  },
  groupPage: async ({ page }, use) => {
    await use(new GroupPage(page));
  },
  reportPage: async ({ page }, use) => {
    await use(new ReportPage(page));
  },
  followUpPage: async ({ page }, use) => {
    await use(new FollowUpPage(page));
  },
  faveHqPage: async ({ page }, use) => {
    await use(new FaveHqPage(page));
  },
  userListingPage: async ({ page }, use) => {
    await use(new UserListingPage(page));
  },
  roleListingPage: async ({ page }, use) => {
    await use(new RoleListingPage(page));
  },
  announcementPage: async ({ page }, use) => {
    await use(new AnnouncementPage(page));
  },
  costCentrePage: async ({ page }, use) => {
    await use(new CostCentrePage(page));
  },
  emailTemplatePage: async ({ page }, use) => {
    await use(new EmailTemplatePage(page));
  },
  otherSession: async ({ browser, baseURL, viewport }, use) => {
    // Empty storageState: inside a test, newContext() would otherwise reuse the test's saved login.
    const context = await browser.newContext({ baseURL, viewport, storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await use({ loginPage: new LoginPage(page), dashboardPage: new DashboardPage(page) });
    await context.close();
  },
  qaUser: async ({ userListingPage }, use) => {
    let user = await userListingPage.firstMatching(QA_USER_NAME);
    if (!user) {
      const created = newQaUser();
      await userListingPage.goto();
      await userListingPage.openCreate();
      await userListingPage.fillNewUser({ ...created, unit: await userListingPage.firstUnit() });
      await userListingPage.save();
      user = await userListingPage.firstMatching(created.loginId);
    } else if (user.status !== 'ACTIVE') {
      await userListingPage.changeStatus(user.loginId, 'ACTIVE');
    }
    const { loginId, name } = user as { loginId: string; name: string };
    await use({ loginId, name });
  },
  cancelCreatedAdHocs: async ({ adHocSetupPage }, use) => {
    await use(async (nameText) => {
      const created = await adHocSetupPage.createdSetups(nameText);
      for (const no of created) {
        await adHocSetupPage.open(no);
        // Reason picked by value: BUG-001 (the reason has an empty label).
        await adHocSetupPage.cancelWithOtherReason('QA cleanup');
      }
      return created;
    });
  },
  returnFaveToVetIc: async ({ favePage }, use) => {
    await use(async (costCentre) => {
      const rejected: string[] = [];
      for (const role of ['uao', 'uro'] as const) {
        await favePage.reopenAs(ROLES[role], costCentre);
        if (await favePage.rejectButton.isVisible()) {
          await favePage.rejectFave('Others', 'QA cleanup');
          rejected.push(role);
        }
      }
      await favePage.switchRole(ROLES['vet-ic']);
      return rejected;
    });
  },
  availableAsset: async ({ assetListingPage }, use, testInfo) => {
    const asset = await assetListingPage.firstListedWithStatus('AVAILABLE');
    testInfo.skip(!asset, 'No AVAILABLE asset in Asset Listing for this unit');
    await use(asset as ListedAsset);
  },
  unitPostalCode: async ({ assetListingPage, assetDetailsPage }, use, testInfo) => {
    if (!unitPostal) {
      const asset = await assetListingPage.firstListedWithStatus('AVAILABLE');
      testInfo.skip(!asset, 'No AVAILABLE asset to take a unit address from');
      await assetListingPage.find((asset as ListedAsset).id);
      await assetListingPage.openAsset((asset as ListedAsset).id);
      await assetDetailsPage.openTab('Location');
      const postal = (await assetDetailsPage.field('Postal Code', assetDetailsPage.activePanel).innerText()).trim();
      testInfo.skip(!/^\d{4,}$/.test(postal), `The first AVAILABLE asset has no postal code ("${postal}")`);
      unitPostal = postal;
    }
    await use(unitPostal);
  },
  officer: async ({ dashboardPage }, use) => {
    if (!officerName) {
      if (!/\/IndexBk/.test(dashboardPage.page.url())) await dashboardPage.goto();
      officerName = await dashboardPage.currentOfficer();
    }
    await use(officerName);
  },
  writableAsset: async ({ assignmentCreatePage, officer }, use) => {
    writableAssetId ??= await assignmentCreatePage.findWritableAsset(officer);
    await use(writableAssetId);
  },
  faveTarget: async ({ favePage, returnFaveToVetIc }, use, testInfo) => {
    // The first cost centre of the current FAVE that is not approved (SPF-027 always leaves one).
    const requestedCostCentre = process.env.SPF_FAVE_COST_CENTRE;
    const openCostCentres = await favePage.notApprovedCostCentres();
    const costCentre = requestedCostCentre ?? openCostCentres[0];
    testInfo.skip(!costCentre, 'Every cost centre of the current FAVE is APPROVED. Give the test account another unit (User > User Listing, see context.md)');
    testInfo.skip(!openCostCentres.includes(costCentre as string), `Requested cost centre ${costCentre} is not an unapproved cost centre in the current FAVE`);
    await returnFaveToVetIc(costCentre as string);
    await favePage.openForCostCentre(costCentre as string);
    await use({ costCentre: costCentre as string, asset: await favePage.firstAssetId() });
  },
  faveRelocateTarget: async ({ favePage, officer, returnFaveToVetIc }, use, testInfo) => {
    let target: { costCentre: string; asset: string } | undefined;
    for (const costCentre of await favePage.notApprovedCostCentres()) {
      await favePage.openSummary(); // selectCostCentre waits for the approval panel on the Summary tab
      await favePage.selectCostCentre(costCentre);
      const asset = await favePage.firstPendingAssetOf(officer);
      if (asset) {
        target = { costCentre, asset };
        break;
      }
    }
    testInfo.skip(
      !target,
      `No cost centre of the current FAVE that is not APPROVED has a PENDING asset with ${officer} as Assignee (LOGS1). Each SPF-039 run uses one up; give the test account another unit (context.md > Test data)`,
    );
    const { costCentre, asset } = target as { costCentre: string; asset: string };
    await returnFaveToVetIc(costCentre);
    await use({ costCentre, asset });
  },
  cancelOpenAssignments: async ({ assignmentPage, assignmentFormPage }, use) => {
    await use(async (assetId) => {
      const open = await assignmentPage.openTransactions(assetId);
      for (const no of open) {
        await assignmentPage.open(no);
        await assignmentFormPage.cancel('Others', 'QA cleanup');
      }
      return open;
    });
  },
  cancelOpenNewAssets: async ({ newAssetListPage, newAssetFormPage }, use) => {
    await use(async (descriptionText) => {
      const open = await newAssetListPage.openRequests(descriptionText);
      for (const no of open) {
        await newAssetListPage.open(no);
        await newAssetFormPage.cancelItem('Others', 'QA cleanup');
      }
      return open;
    });
  },
  loginAs: async ({ loginPage, dashboardPage }, use) => {
    await use(async (role) => {
      const account = testAccount();
      await loginPage.goto();
      await loginPage.login(account.username, account.password);
      await dashboardPage.expectLoaded();
      await dashboardPage.switchRole(ROLES[role]);
      return dashboardPage;
    });
  },
});

export { expect } from '@playwright/test';
export { ROLES };
export { ASSIGN_ROLES, PHOTO, QA_PREFIX, QA_USER_NAME, newQaUser, testAccount, unique } from '../utils/test-data';
export { isoDate } from '@shared/mha-ats/pages/settings-admin.page';
export { periodFieldDate } from '@shared/mha-ats/pages/user-admin.page';
export { readXlsxDownload } from '@shared/utils/download';
export { writeXlsx } from '@shared/utils/xlsx';
export { TABLE_REPORTS } from '@shared/mha-ats/pages/report.page';
export type { TableReport } from '@shared/mha-ats/pages/report.page';
export { listDate, pickerDate } from '@shared/mha-ats/pages/retirement.page';
