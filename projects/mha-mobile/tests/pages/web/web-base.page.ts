import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

/**
 * MHA web (ATS), used by the mobile tests to set up and check data. A slim version of the shared MHA web BasePage
 * (shared/mha-ats/pages/base.page.ts) with only what the cross-checks need. Quirks: shared/mha-ats/context.md.
 */

/** ATS allows one session per account; a newer login of the account ends this one. */
export class SessionEndedError extends Error {
  constructor() {
    super('MHA web logged out: the session was ended, most likely by a newer login of the same account (one session per account).');
    this.name = 'SessionEndedError';
  }
}

export abstract class WebBasePage extends AppPage {
  readonly roleDropdown: Locator;
  readonly currentRole: Locator;

  constructor(page: Page) {
    super(page);
    // select2 over a hidden <select name="role-selection">; its accessible name is the current role.
    this.roleDropdown = page.locator('span[role="combobox"][aria-labelledby^="select2-role-selection"]');
    this.currentRole = page.locator('[id^="select2-role-selection"][id$="-container"]');
  }

  /** Labels of the roles the account holds (options of the hidden header Role <select>). */
  async availableRoles(): Promise<string[]> {
    const options = this.page.locator('select[name="role-selection"] option');
    await expect(options.nth(1)).toBeAttached();
    return (await options.allTextContents()).map((t) => t.trim()).filter(Boolean);
  }

  /** Switch the active role from the header dropdown; the app reloads the page. */
  async switchRole(label: string): Promise<void> {
    if ((await this.currentRole.innerText()).trim() === label) return;
    await this.roleDropdown.click();
    await Promise.all([this.page.waitForEvent('load'), this.page.getByRole('option', { name: label, exact: true }).click()]);
    if (this.isLoginUrl()) throw new SessionEndedError();
    await expect(this.currentRole).toHaveText(label);
  }

  /** Go to the dashboard and make this role active (for tests that need a second web role). */
  async useRole(label: string): Promise<void> {
    await this.navigate('IndexBk');
    if (this.isLoginUrl()) throw new SessionEndedError();
    await this.switchRole(label);
  }

  /**
   * Select exactly one row of a DataTables table with row checkboxes. The checkbox state is not reliable
   * (it can show ticked while nothing is selected), so go by the table's counter ("Showing 1 to 1 of 1
   * records" + "1 row selected").
   */
  protected async tickOne(row: Locator, info: Locator): Promise<void> {
    const oneRow = /records\s*1 row selected/;
    await expect(async () => {
      if (!oneRow.test(await info.innerText())) await row.getByRole('checkbox').click();
      await expect(info).toContainText(oneRow, { timeout: 5_000 });
    }).toPass({ timeout: 30_000 });
  }

  isLoginUrl(): boolean {
    return /\/Account\/Login/.test(this.page.url());
  }

  /** Open a page of the app; a redirect to the login page means the server ended the session. */
  protected async openPage(path: string): Promise<void> {
    await this.navigate(path);
    if (this.isLoginUrl()) throw new SessionEndedError();
  }

  /** A page the server checks the session on (see sessionAlive). */
  static readonly sessionCheckPath = 'Asset/Asset';

  /**
   * Whether the server still accepts the session. The dashboard (IndexBk) is no check: it renders from the
   * login cookie even after the server ended the session (seen 2026-10-20: dashboard "Last Login" of the day
   * before, while Asset Listing and Ad Hoc Listing went to the login page). Asset/Asset goes to the login
   * page when the session is gone; a live session whose role has no Listing menu gets "Unauthorised
   * access." there instead, which still counts as alive.
   */
  async sessionAlive(): Promise<boolean> {
    await this.page.goto(WebBasePage.sessionCheckPath);
    if (this.isLoginUrl()) return false;
    // A role without Asset > Listing (VET IC on HTA, the role the previous test may have left active) gets the
    // popup "Unauthorised access.": the session is alive. Close the popup, it would block the role switch.
    await this.closeUnauthorisedPopup();
    return true;
  }

  /** Close the "Unauthorised access." popup if it shows up (it can appear shortly after the page loads). */
  async closeUnauthorisedPopup(): Promise<void> {
    const popup = this.alert.filter({ hasText: 'Unauthorised access.' });
    await popup.waitFor({ state: 'visible', timeout: 2_500 }).catch(() => undefined);
    if (await popup.isVisible()) {
      await popup.getByRole('button', { name: 'Ok', exact: true }).click();
      await expect(popup).toBeHidden();
    }
  }

  /**
   * Run an action that reloads a server-side DataTables table and wait for the new data: the table first
   * redraws empty, so wait for its `xhr` event, then the next `draw`, then for its last request to finish
   * (some keyword boxes also search while typing).
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
    await this.page.waitForFunction((sel) => {
      const $ = (window as unknown as { jQuery: (s: string) => { DataTable?: () => { settings: () => { jqXHR?: { readyState: number } }[] } } }).jQuery;
      const settings = $(sel).DataTable?.().settings()[0];
      return !settings?.jqXHR || settings.jqXHR.readyState === 4;
    }, tableSelector);
  }

  protected async reloadsTables(tableSelectors: string[], action: () => Promise<void>): Promise<void> {
    await this.reloadsTable(tableSelectors[0], () => (tableSelectors.length > 1 ? this.reloadsTables(tableSelectors.slice(1), action) : action()));
  }

  /** The visible select2 box of a hidden <select> with this id or name. */
  protected select2(scope: Locator | Page, selectKey: string): Locator {
    return scope.locator(`span[role="combobox"][aria-labelledby^="select2-${selectKey}" i]`).filter({ visible: true }).first();
  }

  /** Options of a hidden <select> (by id or name), loaded by XHR on many pages. */
  protected selectOptions(scope: Locator | Page, selectKey: string): Locator {
    return scope.locator(`select[id="${selectKey}" i] option, select[name="${selectKey}" i] option`);
  }

  /** Pick an option of a select2 dropdown; waits for the option in the hidden <select> first. */
  protected async pickSelect2(scope: Locator | Page, selectKey: string, option: string): Promise<void> {
    const exact = new RegExp(`^\\s*${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
    await expect(this.selectOptions(scope, selectKey).filter({ hasText: exact }).first()).toBeAttached({ timeout: 30_000 });
    await this.select2(scope, selectKey).click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  /** Total from "Showing 1 to 10 of 2,737 records" (0 for "Showing no records"). */
  protected async tableTotal(info: Locator): Promise<number> {
    await expect(info).toHaveText(/Showing/);
    const m = (await info.innerText()).match(/of ([\d,]+) records/);
    return m ? Number(m[1].replace(/,/g, '')) : 0;
  }

  // SweetAlert2 popups have no stable accessible name; the library's class names are the stable hook.
  get alert(): Locator {
    return this.page.locator('.swal2-popup');
  }

  get alertText(): Locator {
    return this.alert.locator('.swal2-html-container');
  }

  async confirm(question: RegExp): Promise<void> {
    await expect(this.alertText).toHaveText(question);
    await this.alert.getByRole('button', { name: 'Yes', exact: true }).click();
  }

  async acknowledge(message: string | RegExp): Promise<string> {
    await expect(this.alertText).toHaveText(message, { timeout: 30_000 });
    const text = (await this.alertText.innerText()).trim();
    await this.alert.getByRole('button', { name: 'Ok', exact: true }).click();
    await expect(this.alert).toBeHidden();
    return text;
  }
}
