import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

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
    await expect(this.currentRole).toHaveText(label);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\/Account\/Login/);
  }
}
