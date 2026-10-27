import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Matches a table cell whose whole text is `text`. */
const exactCell = (text: string) => new RegExp(`^\\s*${escape(text)}\\s*$`);

export type UserRow = { loginId: string; name: string; role: string; unit: string; status: string };

/**
 * User > User Listing (/User/User, Agency Admin): one row per user and mapped role (#tblist: Login ID,
 * Name, Role Mapped, Unit, Status, pencil); keyword box "Login ID/Name"; Create.
 * Form (/User/UserForm[?userId=]): Web Login ID, Mobile Login ID (one of the two is required), Unit
 * (select2 multi-select), tabs User Details (Name, Email, Mobile, Status) and Roles (read-only, #tbRole).
 * The submit button says "Create" for a new user, "Update" for an existing one. HTA also has Delete on an
 * existing user's form (mha-spf has none): "Are you sure to delete this user?" Yes/Cancel -> "User has been
 * deleted." -> back to User Listing.
 */
export class UserListingPage extends BasePage {
  static readonly path = 'User/User';

  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly createLink: Locator;
  readonly rows: Locator;
  readonly info: Locator;
  readonly loginIdInput: Locator;
  readonly nameInput: Locator;
  readonly unitOptions: Locator;
  readonly selectedStatus: Locator;
  readonly submitButton: Locator;
  readonly rolesTab: Locator;
  readonly loginIdRequired: Locator;
  readonly unitRequired: Locator;
  readonly nameRequired: Locator;
  readonly statusRequired: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder('Login ID/Name');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.createLink = page.getByRole('link', { name: 'Create', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    // The form labels are not tied to their inputs (no for/id pairs), so the stable ids are used.
    this.loginIdInput = page.locator('#UserInfo_Username');
    this.nameInput = page.locator('#UserInfo_Name');
    this.unitOptions = page.locator('select[name="UnitId"] option:not([value=""])');
    this.selectedStatus = page.locator('[id^="select2-Status"][id$="-container"]');
    this.submitButton = page.locator('#user_form').getByRole('button', { name: /^(Create|Update)$/ });
    this.rolesTab = page.getByRole('tab', { name: /^Roles\(\d+\)$/ });
    this.loginIdRequired = page.getByText('Web Login ID or Mobile Login ID is required.', { exact: true }).first();
    this.unitRequired = page.getByText('Unit is required.', { exact: true });
    this.nameRequired = page.getByText('Name is required.', { exact: true });
    this.statusRequired = page.getByText('Status is required.', { exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate(UserListingPage.path);
    await expect(this.info).toHaveText(/Showing/, { timeout: 30_000 });
  }

  async search(text: string): Promise<void> {
    await this.searchInput.fill(text);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  /** Fresh list, search a login ID or name. */
  async find(text: string): Promise<void> {
    await this.goto();
    await this.search(text);
  }

  /** Rows of this login ID (one per mapped role). */
  row(loginId: string): Locator {
    return this.rows.filter({ has: this.page.locator('td:first-child', { hasText: exactCell(loginId) }) });
  }

  /** Cells of the first row of a login ID: Login ID, Name, Role Mapped, Unit, Status. */
  async rowOf(loginId: string): Promise<UserRow> {
    const cells = (await this.row(loginId).first().locator('td').allInnerTexts()).map((t) => t.trim());
    return { loginId: cells[0], name: cells[1], role: cells[2], unit: cells[3], status: cells[4] };
  }

  /** The first listed user whose login ID or name contains `text` (after a search), or undefined. */
  async firstMatching(text: string): Promise<UserRow | undefined> {
    await this.find(text);
    if ((await this.tableTotal(this.info)) === 0) return undefined;
    const loginId = (await this.rows.first().locator('td').first().innerText()).trim();
    return this.rowOf(loginId);
  }

  async openCreate(): Promise<void> {
    await this.createLink.click();
    await expect(this.page).toHaveURL(/\/User\/UserForm$/);
    await expect(this.loginIdInput).toBeVisible();
  }

  /** Open a user from a search result (pencil in the last column). */
  async open(loginId: string): Promise<void> {
    await this.row(loginId).first().locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/User\/UserForm\?userId=/);
    await expect(this.loginIdInput).toHaveValue(loginId);
  }

  /** The first unit the form offers (e.g. "A&F"); not fixed, so it works for any agency. */
  async firstUnit(): Promise<string> {
    await expect(this.unitOptions.first()).toBeAttached({ timeout: 30_000 });
    return (await this.unitOptions.first().innerText()).trim();
  }

  /** Add a unit in the Unit multi-select (select2 with an inline search box). */
  async addUnit(unit: string): Promise<void> {
    // The multi-select's select2 box has no aria-labelledby, so it is reached from its hidden <select>.
    const box = this.page.locator('select[name="UnitId"] + .select2-container');
    await box.locator('.select2-search__field').pressSequentially(unit, { delay: 20 });
    await this.page.getByRole('option', { name: unit, exact: true }).click();
    await expect(this.page.locator('select[name="UnitId"] option:checked').filter({ hasText: exactCell(unit) })).toHaveCount(1);
  }

  async setStatus(status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
    await this.pickSelect2(this.page, 'Status', status);
    await expect(this.selectedStatus).toHaveText(status);
  }

  /** Create-form fields of a new user. */
  async fillNewUser(user: { loginId: string; name: string; unit: string }): Promise<void> {
    await this.loginIdInput.fill(user.loginId);
    await this.nameInput.fill(user.name);
    await this.addUnit(user.unit);
    await this.setStatus('ACTIVE');
  }

  /** Click Create/Update without expecting a result (validation). */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Create/Update and close the result. Create goes back to the list, Update stays on the form. Returns the message. */
  async save(): Promise<string> {
    await this.submitButton.click();
    const message = await this.acknowledge(/successfully (created|updated)/);
    if (/created/.test(message)) await expect(this.page).toHaveURL(/\/User\/User(\?|$)/);
    return message;
  }

  /** Create/Update when the app refuses it (e.g. a duplicate login ID): returns the message, stays on the form. */
  async saveRefused(): Promise<string> {
    await this.submitButton.click();
    return this.acknowledge(/.+/);
  }

  /** Delete button of an open user's form (HTA only). */
  get deleteButton(): Locator {
    return this.page.getByRole('button', { name: 'Delete', exact: true });
  }

  /** Click Delete on the open user form; returns the confirmation question (left open). */
  async startDelete(): Promise<string> {
    await this.deleteButton.click();
    await expect(this.alertText).toHaveText(/\S/);
    return (await this.alertText.innerText()).trim();
  }

  /** Answer the delete confirmation with Cancel: the form stays open. */
  async cancelDelete(): Promise<void> {
    await this.alert.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(this.alert).toBeHidden();
  }

  /** Answer the delete confirmation with Yes; returns the result message (the app goes back to User Listing). */
  async confirmDelete(): Promise<string> {
    await this.confirm(/^Are you sure to delete this user\?$/);
    const message = await this.acknowledge(/deleted/);
    await expect(this.page).toHaveURL(/\/User\/User(\?|$)/);
    return message;
  }

  /** Find, open and delete a user. Returns the result message. */
  async deleteUser(loginId: string): Promise<string> {
    await this.find(loginId);
    await this.open(loginId);
    await this.startDelete();
    return this.confirmDelete();
  }

  /** Open a user, set its status and save. */
  async changeStatus(loginId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<string> {
    await this.find(loginId);
    await this.open(loginId);
    await this.setStatus(status);
    return this.save();
  }
}

/**
 * User > Role Listing (/User/Role, Agency Admin): roles (#tblist: Role Code, Role Name, Status, pencil).
 * Role page (/User/RoleForm?roleId=): Edit Role, tabs Functions (access rights), Users(n) (#tbuser: Name,
 * Status, trash; Add User opens #modal_user with a client-side filtered #tbusers; Import User) and Periods
 * (#tbperiod: Start Date, End Date, pencil, trash; Add Period opens #modal_period with flatpickr d/m/Y
 * fields). Removing a user or a period has no confirmation.
 */
export class RoleListingPage extends BasePage {
  static readonly path = 'User/Role';

  readonly rows: Locator;
  readonly info: Locator;
  readonly usersTab: Locator;
  readonly periodsTab: Locator;
  readonly userRows: Locator;
  readonly addUserButton: Locator;
  readonly userDialog: Locator;
  readonly periodRows: Locator;
  readonly addPeriodButton: Locator;
  readonly periodDialog: Locator;
  readonly periodStart: Locator;
  readonly periodEnd: Locator;
  readonly startRequired: Locator;
  readonly endRequired: Locator;
  readonly startAfterEnd: Locator;
  readonly endBeforeStart: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    this.usersTab = page.getByRole('tab', { name: /^Users\(\d+\)$/ });
    this.periodsTab = page.getByRole('tab', { name: 'Periods', exact: true });
    this.userRows = page.locator('#tbuser tbody tr');
    this.addUserButton = page.getByRole('button', { name: 'Add User', exact: true });
    this.userDialog = page.locator('#modal_user');
    this.periodRows = page.locator('#tbperiod tbody tr').filter({ hasText: /\d{2}-[A-Za-z]{3}-\d{4}/ });
    this.addPeriodButton = page.getByRole('button', { name: 'Add Period', exact: true });
    this.periodDialog = page.locator('#modal_period');
    this.periodStart = this.periodDialog.locator('input[name="StartOn"]');
    this.periodEnd = this.periodDialog.locator('input[name="EndOn"]');
    this.startRequired = this.periodDialog.getByText('Start date is required.', { exact: true });
    this.endRequired = this.periodDialog.getByText('End date is required.', { exact: true });
    // mha-spf BUG-015: "ealier" is the app's spelling.
    this.startAfterEnd = this.periodDialog.getByText('The start date must be ealier than the end date', { exact: true });
    this.endBeforeStart = this.periodDialog.getByText('The end date must be later than the start date', { exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate(RoleListingPage.path);
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  /** Open a role by its name ("Stocktaker") from the list. */
  async openRole(roleName: string): Promise<void> {
    await this.goto();
    const row = this.rows.filter({ has: this.page.locator('td', { hasText: exactCell(roleName) }) });
    await row.locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/User\/RoleForm\?roleId=/);
    await expect(this.usersTab).toBeVisible();
  }

  async openUsersTab(): Promise<void> {
    await this.usersTab.click();
    await expect(this.addUserButton).toBeVisible();
  }

  /** Row of a user (by name) in the Users tab. */
  userRow(name: string): Locator {
    return this.userRows.filter({ has: this.page.locator('td', { hasText: exactCell(name) }) });
  }

  /** Add User: filter the dialog by `search`, tick the user with this login ID, Submit. Returns the message. */
  async addUser(search: string, loginId: string): Promise<string> {
    await this.addUserButton.click();
    await expect(this.userDialog).toBeVisible();
    // The dialog's table filters in the browser while typing.
    await this.userDialog.getByPlaceholder('Search Users').pressSequentially(search, { delay: 20 });
    const row = this.userDialog.locator('#tbusers tbody tr').filter({ has: this.page.locator('td', { hasText: exactCell(loginId) }) });
    await expect(row).toHaveCount(1);
    await row.getByRole('checkbox').check();
    await this.userDialog.getByRole('button', { name: 'Submit', exact: true }).click();
    const message = await this.acknowledge(/.+/);
    await this.openUsersTab();
    return message;
  }

  /** Remove a user (by name) from the role with the trash icon (no confirmation). Returns the message. */
  async removeUser(name: string): Promise<string> {
    await this.userRow(name).getByRole('button', { name: 'Delete' }).click();
    const message = await this.acknowledge(/removed from User/);
    await this.openUsersTab();
    return message;
  }

  /** Cleanup: remove the user from the open role if listed. Returns true when it was. */
  async removeUserIfListed(name: string): Promise<boolean> {
    await this.openUsersTab();
    await expect(this.userRows.first()).toBeAttached();
    if ((await this.userRow(name).count()) === 0) return false;
    await this.removeUser(name);
    return true;
  }

  async openPeriodsTab(): Promise<void> {
    await this.periodsTab.click();
    await expect(this.addPeriodButton).toBeVisible();
  }

  /** Period rows as "dd-Mon-yyyy dd-Mon-yyyy". */
  async periods(): Promise<string[]> {
    await expect(this.page.locator('#tbperiod tbody tr').first()).toBeAttached();
    return (await this.periodRows.allInnerTexts()).map((t) => (t.match(/\d{2}-[A-Za-z]{3}-\d{4}/g) ?? []).join(' '));
  }

  periodRow(start: string, end: string): Locator {
    return this.periodRows.filter({ hasText: start }).filter({ hasText: end });
  }

  async openAddPeriod(): Promise<void> {
    await this.addPeriodButton.click();
    await expect(this.periodDialog).toBeVisible();
  }

  /**
   * Set the dialog's dates. The fields are read-only flatpickr inputs, so the date is set through
   * flatpickr's own API (what a calendar click calls); the field then shows dd/mm/yyyy.
   */
  async setPeriodDates(start: Date, end: Date): Promise<void> {
    for (const [field, d] of [[this.periodStart, start], [this.periodEnd, end]] as const) {
      await field.evaluate((el, [y, m, day]) => {
        const fp = (el as HTMLInputElement & { _flatpickr: { setDate: (d: Date, fire: boolean) => void; close: () => void } })._flatpickr;
        fp.setDate(new Date(y, m, day), true);
        fp.close();
      }, [d.getFullYear(), d.getMonth(), d.getDate()] as const);
      await expect(field).toHaveValue(periodFieldDate(d));
    }
    await this.closeCalendars();
  }

  /** Picking a date, or a refused Submit (it focuses the date field), opens a calendar over the dialog buttons. */
  private async closeCalendars(): Promise<void> {
    for (const field of [this.periodStart, this.periodEnd]) {
      await field.evaluate((el) => (el as HTMLInputElement & { _flatpickr: { close: () => void } })._flatpickr.close());
    }
    await expect(this.page.locator('.flatpickr-calendar.open')).toHaveCount(0);
  }

  async clickSubmitPeriod(): Promise<void> {
    await this.periodDialog.getByRole('button', { name: 'Submit', exact: true }).click();
  }

  /** Submit the period and close the result. Returns the message (success or the server's error). */
  async submitPeriod(): Promise<string> {
    await this.clickSubmitPeriod();
    return this.acknowledge(/.+/);
  }

  async cancelPeriod(): Promise<void> {
    await this.closeCalendars();
    await this.periodDialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(this.periodDialog).toBeHidden();
  }

  /** Delete a period row (trash, no confirmation). Returns the message. */
  async deletePeriod(start: string, end: string): Promise<string> {
    await this.periodRow(start, end).getByRole('button', { name: 'Delete' }).click();
    const message = await this.acknowledge(/successfully deleted/);
    await this.openPeriodsTab();
    return message;
  }
}

/** "13/11/2026": what the period date fields show (flatpickr d/m/Y). */
export function periodFieldDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
