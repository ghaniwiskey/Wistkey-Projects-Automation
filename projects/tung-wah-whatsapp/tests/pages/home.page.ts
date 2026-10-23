import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

export class HomePage extends AppPage {
  readonly body: Locator;

  constructor(page: Page) {
    super(page);
    this.body = page.locator('body');
  }

  async goto(): Promise<void> {
    await this.navigate('./'); // relative to baseURL, also works when it has a sub-path
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/\S/);
    await expect(this.body).toBeVisible();
  }
}
