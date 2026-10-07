import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

/**
 * ATS allows one session per account: a newer login of the same account (another test, a person,
 * Aside's browser) ends the older session. Pages still open, but the next server action (such as a
 * role switch) lands on the login page.
 */
export class SessionEndedError extends Error {
  constructor() {
    super('Logged out: the session was ended, most likely by a newer login of the same account (ATS allows one session per account).');
    this.name = 'SessionEndedError';
  }
}

/**
 * Logged-in layout shared by every ATS page: header (Role dropdown, officer name,
 * last login, Logout) and the side menu. The Role dropdown is a select2 widget over a
 * hidden <select name="role-selection">; its accessible name is the current role.
 */
export abstract class BasePage extends AppPage {
  readonly roleDropdown: Locator;
  readonly currentRole: Locator;
  readonly lastLogin: Locator;
  readonly logoutLink: Locator;
  readonly sideMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.roleDropdown = page.locator('span[role="combobox"][aria-labelledby^="select2-role-selection"]');
    this.currentRole = page.locator('[id^="select2-role-selection"][id$="-container"]');
    this.lastLogin = page.getByText(/Last Login\s+\d{2}-[A-Za-z]{3}-\d{4} \d{2}:\d{2}/);
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.sideMenu = page.locator('[data-kt-menu="true"]').first();
  }

  /** Header text that holds the officer's name. */
  officerName(name: string): Locator {
    return this.page.getByText(name, { exact: false }).filter({ visible: true }).first();
  }

  /**
   * The logged-in officer's name, read from the header: the block that holds the name and, below it,
   * "Last Login <date>" (the name is the block's first line). Needs the >= 1400px viewport.
   */
  async currentOfficer(): Promise<string> {
    await expect(this.lastLogin).toBeVisible();
    const block = this.lastLogin.locator('xpath=..');
    const name = (await block.innerText()).split('\n')[0].trim();
    if (!name || /Last Login/.test(name)) throw new Error(`Cannot read the officer name from the header: "${await block.innerText()}"`);
    return name;
  }

  /** Labels of the roles the logged-in account holds (options of the hidden header Role <select>). */
  async availableRoles(): Promise<string[]> {
    const options = this.page.locator('select[name="role-selection"] option');
    await expect(options.nth(1)).toBeAttached();
    return (await options.allTextContents()).map((t) => t.trim()).filter(Boolean);
  }

  /** A top-level side menu entry (Dashboard is a link, the others expand). */
  menuItem(title: string): Locator {
    return this.sideMenu.locator('.menu-title', { hasText: new RegExp(`^${title}$`) }).first();
  }

  /** Switch the active role from the header dropdown; the app reloads the page. */
  async switchRole(label: string): Promise<void> {
    if ((await this.currentRole.innerText()).trim() === label) return;
    await this.roleDropdown.click();
    await Promise.all([
      this.page.waitForEvent('load'),
      this.page.getByRole('option', { name: label, exact: true }).click(),
    ]);
    if (this.isLoginUrl()) throw new SessionEndedError();
    await expect(this.currentRole).toHaveText(label);
  }

  /**
   * Run an action that reloads a DataTables (server-side) table and wait until the new data is drawn.
   * The app first redraws the table empty, so waiting for any `draw` is not enough: wait for the
   * table's `xhr` event (response received) and then the next `draw`.
   */
  protected async reloadsTable(tableSelector: string, action: () => Promise<void>): Promise<void> {
    const drawn = this.page.evaluate(
      (sel) =>
        new Promise<void>((resolve) => {
          const $ = (window as unknown as { jQuery: (s: string) => { one: (e: string, f: () => void) => void } }).jQuery;
          $(sel).one('xhr.dt', () => $(sel).one('draw.dt', () => resolve()));
        }),
      tableSelector,
    );
    await action();
    await drawn;
    // Some keyword boxes also search while typing, so a Search click can leave a second, identical
    // request in flight; its redraw would replace the rows (and drop a tick) a moment later. Wait for
    // the table's last request (DataTables keeps it in settings.jqXHR) to finish.
    await this.page.waitForFunction((sel) => {
      const $ = (window as unknown as { jQuery: (s: string) => { DataTable?: () => { settings: () => { jqXHR?: { readyState: number } }[] } } }).jQuery;
      const settings = $(sel).DataTable?.().settings()[0];
      return !settings?.jqXHR || settings.jqXHR.readyState === 4;
    }, tableSelector);
  }

  /** Like reloadsTable, for an action that reloads several tables (e.g. picking a FAVE cost centre). */
  protected async reloadsTables(tableSelectors: string[], action: () => Promise<void>): Promise<void> {
    await this.reloadsTable(tableSelectors[0], () =>
      tableSelectors.length > 1 ? this.reloadsTables(tableSelectors.slice(1), action) : action(),
    );
  }

  /**
   * The visible select2 box of a hidden <select> with this id or name (e.g. "Status", "PostalCode").
   * select2 builds the container id from it ("select2-Status-ov-container"); some pages render the
   * same field in several wizard panels, so only the visible one counts.
   */
  protected select2(scope: Locator | Page, selectKey: string): Locator {
    return scope
      .locator(`span[role="combobox"][aria-labelledby^="select2-${selectKey}" i]`)
      .filter({ visible: true })
      .first();
  }

  /**
   * Pick an option in a select2 dropdown (only one dropdown is open at a time).
   * Many ATS dropdowns (Group, Assignee, ...) get their options by XHR after the step opens, and an
   * open select2 does not refresh its list, so first wait for the option in the hidden <select>.
   */
  protected async pickSelect2(scope: Locator | Page, selectKey: string, option: string): Promise<void> {
    const exact = new RegExp(`^\\s*${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
    const loaded = scope
      .locator(`select[id="${selectKey}" i] option, select[name="${selectKey}" i] option`)
      .filter({ hasText: exact });
    await expect(loaded.first()).toBeAttached({ timeout: 30_000 });
    await this.select2(scope, selectKey).click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  /**
   * select2 with server-side search (e.g. postal code): open, type the query, pick the option with this
   * exact text, or the first option matching a RegExp. Returns the picked option's text.
   */
  protected async searchSelect2(scope: Locator | Page, selectKey: string, query: string, option: string | RegExp): Promise<string> {
    await this.select2(scope, selectKey).click();
    // The search box of the open select2 (in the dropdown, or inline for multi-selects).
    const search = this.page.locator('.select2-container--open .select2-search__field').filter({ visible: true }).first();
    await search.pressSequentially(query, { delay: 30 });
    const target =
      typeof option === 'string'
        ? this.page.getByRole('option', { name: option, exact: true })
        : this.page.getByRole('option', { name: option }).first();
    await expect(target).toBeVisible({ timeout: 30_000 });
    const text = (await target.innerText()).trim();
    await target.click();
    return text;
  }

  /** Postal Code search results read "<postal code> - <address>": the first result for a code. */
  protected postalResult(postalCode: string): RegExp {
    return new RegExp(`^${postalCode.replace(/[^\d]/g, '')}\\s*-`);
  }

  /** Total from a DataTables info line "Showing 1 to 10 of 2,737 records" (0 for "Showing no records"). */
  protected async tableTotal(info: Locator): Promise<number> {
    await expect(info).toHaveText(/Showing/);
    const m = (await info.innerText()).match(/of ([\d,]+) records/);
    return m ? Number(m[1].replace(/,/g, '')) : 0;
  }

  // SweetAlert2 popups (confirmations and result messages). They have no stable accessible name,
  // so the library's class names are the most stable hook.
  get alert(): Locator {
    return this.page.locator('.swal2-popup');
  }

  get alertText(): Locator {
    return this.alert.locator('.swal2-html-container');
  }

  /** Answer a SweetAlert confirmation ("Are you sure ...?") with Yes. */
  async confirm(question: RegExp = /Are you sure/): Promise<void> {
    await expect(this.alertText).toHaveText(question);
    await this.alert.getByRole('button', { name: 'Yes', exact: true }).click();
  }

  /** Wait for a SweetAlert result message, then close it with Ok. Returns the message. */
  async acknowledge(message: string | RegExp): Promise<string> {
    await expect(this.alertText).toHaveText(message);
    const text = (await this.alertText.innerText()).trim();
    await this.alert.getByRole('button', { name: 'Ok', exact: true }).click();
    await expect(this.alert).toBeHidden();
    return text;
  }

  /** True when the app has sent the browser back to the login page. */
  isLoginUrl(): boolean {
    return /\/Account\/Login/.test(this.page.url());
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\/Account\/Login/);
  }
}
