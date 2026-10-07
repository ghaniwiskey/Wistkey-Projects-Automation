import { Page, Locator, Download, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Report > Asset Listing (Detailed) (/Report/Asset): the unit's capitalised assets (retired, disposed and
 * uncapitalised assets are left out), keyword search, select2 filters (Cost Centre, Group / NPC / Base,
 * Asset Category, Status, Assignee LOGS1/FALO), capitalisation date range, server-side DataTables
 * (#tblist) and Export to .xlsx (the export follows the filters on screen).
 */
export class AssetReportPage extends BasePage {
  static readonly path = 'Report/Asset';

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;
  readonly statusOptions: Locator;
  readonly exportButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Asset Listing (Detailed)', level: 1 });
    this.searchInput = page.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    // Options of the Status filter's underlying <select> (the first one is the "Status" placeholder).
    this.statusOptions = page.locator('select[name="Status"] option:not([value=""])');
    // <a id="exportBtn" download> has no href, so it has no link role.
    this.exportButton = page.locator('#exportBtn');
  }

  async goto(): Promise<void> {
    await this.navigate(AssetReportPage.path);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 60_000 });
  }

  async totalRecords(): Promise<number> {
    return this.tableTotal(this.info);
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  /** Asset ID (first link) and cost centre (the 6-digit cell) of the first row. */
  async firstRow(): Promise<{ id: string; costCentre: string }> {
    const row = this.rows.first();
    const id = (await row.getByRole('link').first().innerText()).trim();
    const costCentre = (await row.innerText()).match(/(?<!\d)\d{6}(?!\d)/)?.[0];
    if (!/^\d+$/.test(id) || !costCentre) throw new Error(`Cannot read the first report row: ${await row.innerText()}`);
    return { id, costCentre };
  }

  row(assetId: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('link', { name: assetId, exact: true }) });
  }

  async export(): Promise<Download> {
    const [download] = await Promise.all([this.page.waitForEvent('download', { timeout: 120_000 }), this.exportButton.click()]);
    return download;
  }
}
