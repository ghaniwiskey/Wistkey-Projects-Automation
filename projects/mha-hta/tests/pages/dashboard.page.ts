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

  /**
   * The number shown above a figure label, e.g. "Total Stocktake Report (Endorsed)". The same figures
   * also sit in the hidden overview tabs, so only the visible one counts.
   */
  figure(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('xpath=preceding-sibling::h5[1]').filter({ visible: true }).first();
  }

  /**
   * Value of a figure once it stops changing: the dashboard renders in two passes (first partial
   * values, then the full figures ~1-2 s later), so read until two reads 1.5 s apart agree.
   */
  async settledFigure(label: string): Promise<number> {
    const read = async () => Number((await this.figure(label).innerText()).replace(/[^\d]/g, ''));
    let last = Number.NaN;
    await expect(async () => {
      const now = await read();
      const same = now === last;
      last = now;
      expect(same, `${label} is stable`).toBe(true);
    }).toPass({ intervals: [1_500], timeout: 30_000 });
    return last;
  }
}
