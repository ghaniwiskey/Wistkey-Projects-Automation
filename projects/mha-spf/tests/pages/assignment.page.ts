import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import type { TransactionStatus } from './assignment-form.page';

/**
 * Asset > Assignment (/Asset/Assignment): transaction list (#tblist, ?handler=GetList), keyword search
 * (Transaction No / Asset ID / Asset ID2 / Serial No), select2 filters, Create button. Columns:
 * Transaction No., Cost Centre, Type, Created By, Approver Role, Create Date, Status, Actions (pencil).
 */
export class AssignmentPage extends BasePage {
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Assignment', level: 1 });
    this.createButton = page.getByRole('link', { name: 'Create', exact: true });
    this.searchInput = page.getByPlaceholder('Transaction No/Asset ID/Asset ID2/Serial No');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
  }

  async goto(): Promise<void> {
    await this.navigate('Asset/Assignment');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/Assignment$/);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  async create(): Promise<void> {
    await this.createButton.click();
    await expect(this.page).toHaveURL(/\/Asset\/AssignmentCreate/);
  }

  /** Search by transaction no. or asset id, optionally only one status. */
  async search(keyword: string, status?: TransactionStatus): Promise<void> {
    if (status) await this.pickSelect2(this.page, 'Status', status);
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  async totalRecords(): Promise<number> {
    return this.tableTotal(this.info);
  }

  row(transactionNo: string): Locator {
    return this.rows.filter({ hasText: transactionNo });
  }

  /** Cell of a row by column (0-based): 2 type, 4 approver role, 6 status. */
  cell(transactionNo: string, column: number): Locator {
    return this.row(transactionNo).locator('td').nth(column);
  }

  type(transactionNo: string): Locator {
    return this.cell(transactionNo, 2);
  }

  approverRole(transactionNo: string): Locator {
    return this.cell(transactionNo, 4);
  }

  status(transactionNo: string): Locator {
    return this.cell(transactionNo, 6);
  }

  /** Find a transaction in the list (fresh page) so its row can be checked. */
  async find(transactionNo: string): Promise<void> {
    await this.goto();
    await this.search(transactionNo);
    await expect(this.row(transactionNo)).toHaveCount(1);
  }

  /** Find a transaction and open its details (pencil icon in the Actions column). */
  async open(transactionNo: string): Promise<void> {
    await this.find(transactionNo);
    await this.row(transactionNo).locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Asset\/AssignmentForm\?assetAssId=/);
  }

  /** Transaction numbers of the SUBMITTED transactions for an asset. */
  async openTransactions(assetId: string): Promise<string[]> {
    await this.goto();
    await this.search(assetId, 'SUBMITTED');
    if ((await this.totalRecords()) === 0) return [];
    const firstCells = await this.rows.locator('td:first-child').allInnerTexts();
    return firstCells.map((t) => t.trim()).filter((t) => /^ASG\d+$/.test(t));
  }
}
