import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

export class CustomersPage extends AppPage {
  readonly customerCountLabel: Locator;
  readonly memberSearch: Locator;
  readonly remarkSearch: Locator;

  constructor(page: Page) {
    super(page);
    this.customerCountLabel = page.getByText(/No\. of Customer:\s*[\d,]+/);
    this.memberSearch = page.getByPlaceholder('Search by Member ID., Name, Mobile, Email', { exact: true });
    this.remarkSearch = page.getByPlaceholder('Search by Remark', { exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate('/customers');
    await expect(this.customerCountLabel).toHaveText(/No\. of Customer:\s*[\d,]+/, { timeout: 15_000 });
  }

  async expectSearchControls(): Promise<void> {
    await expect(this.memberSearch).toBeVisible();
    await expect(this.remarkSearch).toBeVisible();
  }

  async searchForNoMatch(query: string): Promise<void> {
    await this.memberSearch.fill(query);
    await this.memberSearch.press('Enter');
    await expect(this.customerCountLabel).toHaveText(/No\. of Customer:\s*0/, { timeout: 15_000 });
  }
}
