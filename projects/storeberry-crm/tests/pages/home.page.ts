import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

export class HomePage extends AppPage {
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    super(page);
    this.getStartedLink = page.getByRole('link', { name: /Get Started/ });
  }

  async goto(): Promise<void> {
    await this.navigate('./');
  }

  async isLoggedIn(): Promise<boolean> {
    await this.goto();
    return this.getStartedLink.isVisible();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Storeberry/);
    await expect(this.getStartedLink).toBeVisible();
  }
}
