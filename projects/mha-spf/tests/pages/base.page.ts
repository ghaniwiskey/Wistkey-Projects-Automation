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
  }

  /** Pick an option in a select2 dropdown whose hidden <select> has this id or name (e.g. "Status"). */
  protected async pickSelect2(scope: Locator | Page, selectKey: string, option: string): Promise<void> {
    await scope.locator(`span[role="combobox"][aria-labelledby^="select2-${selectKey}"]`).click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
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
