import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly title: Locator;
  readonly sku: Locator;
  readonly addToCartButton: Locator;
  readonly addedMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { level: 1 });
    this.sku = page.getByText(/^SKU:/);
    // A second Add to Cart lives in a fixed "sticky-product" bar hidden behind the header.
    // Scope to the main checkout block so we click the real one.
    this.addToCartButton = page.locator('.pdp-checkout-block').getByRole('button', { name: 'Add to Cart' });
    this.addedMessage = page.getByText('Successfully Added to Cart');
  }

  async expectLoaded(productName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/product\//);
    await expect(this.title).toHaveText(productName);
    await this.waitForHydration(); // Add to Cart is inert until hydrated
  }

  async addToCart(): Promise<void> {
    const addRequest = this.page.waitForResponse(
      (r) => ['xhr', 'fetch'].includes(r.request().resourceType()) && r.request().method() !== 'GET' && /cart|basket/i.test(r.url()),
      { timeout: 15_000 },
    ).catch(() => null);
    await this.addToCartButton.click();
    const res = await addRequest;
    if (res && res.status() >= 400) {
      // The site fails silently in the UI (no error toast), so surface the API reason.
      const body = await res.json().catch(() => ({}));
      throw new Error(`Add to cart rejected (HTTP ${res.status()}): ${body.message ?? 'no message'}`);
    }
    await expect(this.addedMessage).toBeVisible({ timeout: 10_000 });
  }
}
