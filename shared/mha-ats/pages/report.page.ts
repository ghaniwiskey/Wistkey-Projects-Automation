import { Page, Locator, Download, expect } from '@playwright/test';
import { BasePage } from './base.page';

/** Report menu entries that are plain table reports: heading (= menu text) -> path. */
export const TABLE_REPORTS = {
  'Asset Listing (Summary)': 'Report/AssetSummary',
  'Asset Registration (Aging)': 'Report/AssetAging',
  'Asset Rejection': 'Report/AssetRejection',
  'Asset Retirement': 'Report/AssetRetirement',
  'New Asset': 'Report/AssetNew',
  'Asset Loan': 'Report/AssetLoan',
  'Asset Maintenance': 'Report/AssetMaintenance',
} as const;

export type TableReport = keyof typeof TABLE_REPORTS;

/**
 * The Report pages that share one layout: heading, filters, server-side DataTables (#tblist, info
 * #tblist_info) and Export (#exportBtn, an <a download> without href, so it has no link role).
 * Asset Listing (Detailed) has its own page object (AssetReportPage); FAVE Stocktake (Follow up) needs a FAVE.
 */
export class ReportPage extends BasePage {
  readonly rows: Locator;
  readonly info: Locator;
  readonly exportButton: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    this.exportButton = page.locator('#exportBtn');
  }

  heading(report: TableReport): Locator {
    return this.page.getByRole('heading', { name: report, exact: true, level: 1 });
  }

  /** Open a report and wait until its table has loaded (some reports are large). */
  async goto(report: TableReport): Promise<void> {
    await this.navigate(TABLE_REPORTS[report]);
    await expect(this.heading(report)).toBeVisible();
    await expect(this.info).toHaveText(/Showing/, { timeout: 60_000 });
  }

  async totalRecords(): Promise<number> {
    return this.tableTotal(this.info);
  }

  async export(): Promise<Download> {
    const [download] = await Promise.all([this.page.waitForEvent('download', { timeout: 120_000 }), this.exportButton.click()]);
    return download;
  }
}
