import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/** Landing page after login (/IndexBk): Inbox plus the Summary / overview tabs. */
export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly inbox: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Dashboard', level: 1 });
    this.inbox = page.getByRole('heading', { name: 'Inbox' });
  }

  async goto(): Promise<void> {
    await this.navigate('IndexBk');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/IndexBk/);
    await expect(this.heading).toBeVisible();
    await expect(this.roleDropdown).toBeVisible();
  }
}
