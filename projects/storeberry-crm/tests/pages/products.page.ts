import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

export class ProductsPage extends AppPage {
  readonly addProductLink: Locator;
  readonly productSearch: Locator;
  readonly nameInput: Locator;
  readonly finalPriceInput: Locator;
  readonly categoryPicker: Locator;
  readonly saveButton: Locator;
  readonly visibilityGroup: Locator;
  readonly hiddenProductChoice: Locator;
  readonly hiddenProductRadio: Locator;
  readonly actionsButton: Locator;
  readonly terminateAction: Locator;
  readonly terminatedProductsLink: Locator;
  readonly productCountLabel: Locator;
  readonly generalCategoryValue: Locator;

  constructor(page: Page) {
    super(page);
    this.addProductLink = page.getByRole('link', { name: /Add Product/ });
    this.productSearch = page.getByPlaceholder('Product ID, Name, Option, SKU, Barcode', { exact: true });
    this.nameInput = page.getByPlaceholder('Name', { exact: true });
    this.finalPriceInput = page.getByPlaceholder('Final Price', { exact: true });
    // The category control is a Vue tree-select whose textbox has no accessible name in the live form.
    this.categoryPicker = page.locator('.vue-treeselect__input').first();
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.visibilityGroup = page.getByRole('radiogroup');
    this.hiddenProductChoice = page.getByText(/Hidden Product\s+Everyone\s+CANNOT\s+view the product online,\s+but still\s+CAN\s+purchase it/).first();
    // The product-type radios are visually hidden; scope to their visible radio group and target the Hidden Product option.
    this.hiddenProductRadio = this.visibilityGroup.locator('input[type="radio"]').nth(2);
    this.actionsButton = page.getByRole('button', { name: /Actions/ });
    this.terminateAction = page.getByRole('menuitem', { name: /Make product terminated in all platforms/ });
    this.terminatedProductsLink = page.getByRole('link', { name: /Terminated Products/ });
    this.productCountLabel = page.getByText(/^No\. of Product\s*:\s*\d+$/);
    this.generalCategoryValue = page.getByText(/^General(?:\(\d+\))?$/);
  }

  productLink(name: string): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate('/products');
    await expect(this.addProductLink).toBeVisible();
  }

  /** Uses the existing General category documented for this staging scenario; callers skip if it is no longer configured. */
  async createHiddenProduct(name: string, price: string): Promise<boolean> {
    await this.addProductLink.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    await this.categoryPicker.click();
    const generalOption = this.page.getByText('General', { exact: true });
    if (!(await generalOption.count())) return false;
    await generalOption.first().click();
    await this.finalPriceInput.fill(price);
    await this.hiddenProductChoice.click();
    await expect(this.hiddenProductRadio).toBeChecked();
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
    await expect(this.page).toHaveURL(/\/products(?:\?.*)?$/);
    await expect(this.productLink(name)).toBeVisible();
    return true;
  }

  async openProduct(name: string): Promise<void> {
    await this.productLink(name).click();
    await expect(this.nameInput).toBeVisible();
  }

  async expectProductDetails(name: string, price: string): Promise<void> {
    await expect(this.nameInput).toHaveValue(name);
    await expect(this.finalPriceInput).toHaveValue(price);
    await expect(this.generalCategoryValue).toBeVisible();
    await expect(this.hiddenProductRadio).toBeChecked();
  }

  async updateProductName(name: string, updatedName: string): Promise<void> {
    await expect(this.nameInput).toHaveValue(name);
    await this.nameInput.fill(updatedName);
    await this.saveButton.click();
    await expect(this.page).toHaveURL(/\/products(?:\?.*)?$/);
    await expect(this.productLink(updatedName)).toBeVisible();
  }

  async terminateActiveProduct(name: string): Promise<void> {
    const link = this.productLink(name);
    await expect(link).toBeVisible();
    // Product rows have no semantic row role and an unnamed checkbox; use the nearest containing row as a last-resort selector.
    const row = link.locator('xpath=ancestor::*[.//input[@type="checkbox"]][1]');
    await row.locator('input[type="checkbox"]').first().check();
    await this.actionsButton.click();
    await this.terminateAction.click();
    await expect(link).toHaveCount(0);
  }

  async openTerminatedProducts(): Promise<void> {
    await this.terminatedProductsLink.click();
    await expect(this.productCountLabel).toHaveText(/^No\. of Product\s*:\s*\d+$/);
  }

  async expectProductInTerminatedList(name: string): Promise<void> {
    await expect(this.productLink(name)).toBeVisible();
  }

  async cleanupActiveTestProduct(names: string[]): Promise<void> {
    await this.navigate('/products');
    await expect(this.addProductLink).toBeVisible();
    for (const name of names) {
      await this.productSearch.fill(name);
      await this.productSearch.press('Enter');
      try {
        await expect(this.productLink(name)).toBeVisible({ timeout: 8_000 });
      } catch {
        continue;
      }
      await this.terminateActiveProduct(name);
      return;
    }
  }
}
