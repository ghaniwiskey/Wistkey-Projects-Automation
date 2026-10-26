import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

export class OrdersPage extends AppPage {
  readonly pendingPaymentFilter: Locator;
  readonly orderCountLabel: Locator;
  readonly loadingIndicator: Locator;
  readonly pendingPaymentLabels: Locator;

  constructor(page: Page) {
    super(page);
    this.pendingPaymentFilter = page.getByRole('button', { name: /Pending payment/ });
    this.orderCountLabel = page.getByText(/No\. of Order:\s*[\d,]+/);
    this.loadingIndicator = page.getByRole('heading', { name: 'Please wait...', exact: true });
    this.pendingPaymentLabels = page.getByText('Pending payment', { exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate('/orders');
    await expect(this.page).toHaveURL(/\/orders(?:\?|$)/);
    await this.waitForList();
  }

  async filterToPendingPayment(): Promise<void> {
    await this.pendingPaymentFilter.click();
    await expect(this.page).toHaveURL(/isActive=true/);
    await this.waitForList();
  }

  async waitForList(): Promise<void> {
    await expect(this.loadingIndicator).toBeHidden({ timeout: 15_000 });
    await expect(this.orderCountLabel).toHaveText(/No\. of Order:\s*[\d,]+/, { timeout: 15_000 });
  }

  async orderCount(): Promise<number> {
    const text = await this.orderCountLabel.innerText();
    const count = Number(text.match(/[\d,]+/)?.[0].replace(/,/g, ''));
    if (!Number.isFinite(count)) throw new Error('The CRM order count was not readable.');
    return count;
  }

  async pendingPaymentLabelCount(): Promise<number> {
    return this.pendingPaymentLabels.count();
  }
}
