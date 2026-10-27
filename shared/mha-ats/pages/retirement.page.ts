import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "31-Dec-2027", the format of the Disposal Date column. */
export function listDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}

/** "12/31/2027", the format of the Update dialog's date field (flatpickr dateFormat m/d/Y). */
export function pickerDate(d: Date): string {
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * Asset > Retirement/Disposal (/Asset/Retirement): RETIRED and DISPOSED assets (#tblist) with keyword
 * search and filters (Cost Centre, Group, Category, Status). The pencil of a RETIRED asset opens the
 * Update dialog (#modal_update) with one Disposal Date field (flatpickr, read-only input). A future date
 * keeps the asset RETIRED until that day; a past date disposes it at once (cannot be undone: tests never
 * use one). Submitting an empty date clears it. Result: "Updating done".
 */
export class RetirementPage extends BasePage {
  static readonly path = 'Asset/Retirement';

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;
  readonly updateDialog: Locator;
  readonly disposalDateInput: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Retirement/Disposal', level: 1 });
    this.searchInput = page.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    this.updateDialog = page.locator('#modal_update');
    this.disposalDateInput = this.updateDialog.locator('input[name="DisposalOn"]');
  }

  async goto(): Promise<void> {
    await this.navigate(RetirementPage.path);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing/, { timeout: 30_000 });
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  async filterByStatus(status: 'RETIRED' | 'DISPOSED'): Promise<void> {
    await this.pickSelect2(this.page, 'Status', status);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  row(assetId: string): Locator {
    return this.rows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  /** A cell of an asset's row found by its column header (no fixed column positions). */
  cell(assetId: string, header: string): Locator {
    return this.row(assetId).locator(`xpath=td[count(ancestor::table[1]/thead//th[normalize-space()="${header}"]/preceding-sibling::th)+1]`);
  }

  disposalDate(assetId: string): Locator {
    return this.cell(assetId, 'Disposal Date');
  }

  status(assetId: string): Locator {
    return this.cell(assetId, 'Status');
  }

  /** Fresh page, search one asset. */
  async find(assetId: string): Promise<void> {
    await this.goto();
    await this.search(assetId);
    await expect(this.row(assetId)).toHaveCount(1);
  }

  /**
   * The first RETIRED asset on the first page of the RETIRED filter that has no disposal date ("-"),
   * or undefined. Found at runtime, so no asset is fixed in the tests.
   */
  async firstRetiredWithoutDisposalDate(): Promise<string | undefined> {
    await this.goto();
    await this.filterByStatus('RETIRED');
    for (const row of await this.rows.all()) {
      const id = (await row.innerText()).match(/Asset ID: (\d+)/)?.[1];
      if (id && (await this.disposalDate(id).innerText()).trim() === '-') return id;
    }
    return undefined;
  }

  /** Open the Update dialog of an asset already shown in the list. */
  async openUpdate(assetId: string): Promise<void> {
    await this.row(assetId).getByRole('button').click();
    await expect(this.updateDialog).toBeVisible();
    await expect(this.disposalDateInput).toBeVisible();
  }

  async closeUpdate(): Promise<void> {
    await this.updateDialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(this.updateDialog).toBeHidden();
  }

  /**
   * Set (or with null clear) the disposal date in the open dialog and submit. Returns the message.
   * The field is a read-only flatpickr input whose calendar only steps month by month, so the date is
   * set through flatpickr's own API (the same call the calendar makes), not by typing.
   */
  async submitDisposalDate(date: Date | null): Promise<string> {
    const value = date ? pickerDate(date) : null;
    await this.disposalDateInput.evaluate((el, v) => {
      const fp = (el as HTMLInputElement & { _flatpickr: { setDate: (d: string, fire: boolean) => void; clear: () => void; close: () => void } })._flatpickr;
      if (v) fp.setDate(v, true);
      else fp.clear();
      fp.close();
    }, value);
    await expect(this.disposalDateInput).toHaveValue(value ?? '');
    await this.updateDialog.getByRole('button', { name: 'Submit', exact: true }).click();
    return this.acknowledge(/Updating done/);
  }

  /** Find the asset, open its pencil and save the date (null clears it). */
  async setDisposalDate(assetId: string, date: Date | null): Promise<string> {
    await this.find(assetId);
    await this.openUpdate(assetId);
    return this.submitDisposalDate(date);
  }
}
