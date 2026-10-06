import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Asset details (/Asset/AssetForm?assetId=<encrypted id>), opened from Asset Listing.
 * Header fields (Asset ID, Asset Status, Serial No, ...) and tabs Main Data, Location, Ownership,
 * Loan, Maintenance, Retirement (+ Status). Fields are label/value div pairs.
 */
export class AssetDetailsPage extends BasePage {
  static readonly TABS = ['Main Data', 'Location', 'Ownership', 'Loan', 'Maintenance', 'Retirement'] as const;

  readonly breadcrumb: Locator;
  readonly activePanel: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumb = page.locator('.breadcrumb');
    this.activePanel = page.locator('.tab-content .tab-pane.active');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/AssetForm\?assetId=/);
    await expect(this.breadcrumb).toContainText('Details');
    await expect(this.field('Asset ID')).toBeVisible();
  }

  /**
   * Value next to a field label, e.g. field('Asset Status') -> "AVAILABLE". Searches the whole page
   * (header and the open tab); pass `scope` to look inside one tab panel.
   * The label and value are sibling divs without ids or roles, hence the XPath sibling step.
   */
  field(label: string, scope: Locator | Page = this.page): Locator {
    return scope
      .getByText(label, { exact: true })
      .filter({ visible: true })
      .first()
      .locator('xpath=following-sibling::*[1]');
  }

  tab(name: string): Locator {
    return this.page.getByRole('tab', { name, exact: true });
  }

  async openTab(name: string): Promise<void> {
    await this.tab(name).click();
    await expect(this.tab(name)).toHaveAttribute('aria-selected', 'true');
  }
}
