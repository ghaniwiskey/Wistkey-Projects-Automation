import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Asset > Listing (/Asset/Asset): keyword search, select2 filters (Cost Centre, Group / NPC / Base,
 * Asset Category, Status) and a server-side DataTables list (#tblist, data from ?handler=GetList).
 * Filters apply only when Search is clicked; Clear reloads the page. Use a unit role such as LOGS1: as Agency Admin the
 * list holds ~48k assets and searching hangs.
 */
export class AssetListingPage extends BasePage {
  static readonly path = 'Asset/Asset';

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Listing', level: 1 });
    this.searchInput = page.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.clearButton = page.getByRole('button', { name: 'Clear', exact: true });
    // DataTables markup has no row roles worth using; the table id is stable.
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
  }

  /** Open the page without checks (e.g. to test a redirect to login). */
  async open(): Promise<void> {
    await this.navigate(AssetListingPage.path);
  }

  async goto(): Promise<void> {
    await this.open();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/Asset/);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  /** Pick a status in the Status filter and apply it with Search. */
  async filterByStatus(status: string): Promise<void> {
    await this.pickSelect2(this.page, 'Status', status);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  /** Clear reloads the whole page (filters and keyword reset). */
  async clear(): Promise<void> {
    await Promise.all([this.page.waitForEvent('load'), this.clearButton.click()]);
    await this.expectLoaded();
  }

  /** Total from "Showing 1 to 10 of 2,737 records" (0 for "Showing no records"). */
  async totalRecords(): Promise<number> {
    const m = (await this.info.innerText()).match(/of ([\d,]+) records/);
    return m ? Number(m[1].replace(/,/g, '')) : 0;
  }

  row(assetId: string): Locator {
    return this.rows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  /** Status badge (last column) of each row on the current page. */
  statuses(): Locator {
    return this.rows.locator('td:last-child .badge');
  }

  /** Status badge of one asset row. */
  statusOf(assetId: string): Locator {
    return this.row(assetId).locator('td:last-child .badge');
  }

  /** Fresh search for one asset (use with statusOf / openAsset). */
  async find(assetId: string): Promise<void> {
    await this.goto();
    await this.search(assetId);
    await expect(this.row(assetId)).toHaveCount(1);
  }

  /** Asset ID of the first asset with this status, or undefined when there is none. */
  async firstAssetIdWithStatus(status: string): Promise<string | undefined> {
    await this.goto();
    await this.filterByStatus(status);
    if ((await this.totalRecords()) === 0) return undefined;
    return (await this.rows.first().innerText()).match(/Asset ID: (\d+)/)?.[1];
  }

  async openAsset(assetId: string): Promise<void> {
    await this.row(assetId).getByRole('link', { name: `Asset ID: ${assetId}` }).click();
    await expect(this.page).toHaveURL(/\/Asset\/AssetForm\?assetId=/);
  }
}
