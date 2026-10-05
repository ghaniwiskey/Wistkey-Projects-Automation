import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly emptyMessage: Locator;
  readonly confirmDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.emptyMessage = page.getByText('You have no items in your shopping cart.');
    this.confirmDialog = page.getByRole('dialog').filter({ hasText: 'remove this product from the shopping cart' });
  }

  async goto(): Promise<void> {
    await this.navigate('/checkout');
  }

  row(productName: string): Locator {
    return this.page.locator('.store-checkout-product-row').filter({ hasText: productName });
  }

  productLink(productName: string): Locator {
    return this.row(productName).getByRole('link', { name: productName, exact: true }).filter({ visible: true }).first();
  }

  async expectContains(productName: string): Promise<void> {
    await expect(this.productLink(productName)).toBeVisible();
  }

  /** Remove a product from the cart if present (trash icon -> Confirm). */
  async removeProduct(productName: string): Promise<void> {
    await this.goto();
    const row = this.row(productName);
    if ((await row.count()) === 0) return;
    await row.locator('button:has(svg.tabler-icon-trash)').filter({ visible: true }).first().click();
    await this.confirmDialog.getByRole('button', { name: 'Confirm' }).click();
    await expect(row).toHaveCount(0);
  }
}
