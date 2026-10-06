import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/** Asset > Assignment (/Asset/Assignment): transaction list (#tblist) and the Create button. */
export class AssignmentPage extends BasePage {
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Assignment', level: 1 });
    this.createButton = page.getByRole('link', { name: 'Create', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
  }

  async goto(): Promise<void> {
    await this.navigate('Asset/Assignment');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/Assignment$/);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  async create(): Promise<void> {
    await this.createButton.click();
    await expect(this.page).toHaveURL(/\/Asset\/AssignmentCreate/);
  }
}
