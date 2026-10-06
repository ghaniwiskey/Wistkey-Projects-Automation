import { Page, Locator, Download, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type SightedResult = 'SIGHTED' | 'NOT SIGHTED' | 'PENDING';
export type AssetCondition = 'WORKING' | 'NOT WORKING' | 'NOT IN USE/OBSOLETE';

/**
 * Stocktake details pages: FAVE (/Stocktake/FaveForm) and Ad Hoc Listing (/Stocktake/StocktakeListingForm).
 * Both have tabs Summary (#summary_tab, results per Sighted Result + Export), Details (#detail_tab,
 * #tbdetail, Update Result) and Assignment (#assign_tab, #tbassign, Assign Stocktaker), plus the
 * Update Result (#modal_result) and Assign (#modal_assign) dialogs. Tables are server-side DataTables;
 * each tab has its own keyword box with the same placeholder, so locators are scoped to the tab pane.
 */
export abstract class StocktakeFormPage extends BasePage {
  readonly title: Locator;
  readonly summaryTab: Locator;
  readonly detailsTab: Locator;
  readonly assignmentTab: Locator;
  readonly summaryPane: Locator;
  readonly summaryRows: Locator;
  readonly detailRows: Locator;
  readonly assignRows: Locator;
  readonly exportLink: Locator;
  readonly updateResultButton: Locator;
  readonly assignStocktakerButton: Locator;
  readonly resultModal: Locator;
  readonly assignModal: Locator;
  readonly remarks: Locator;
  readonly stocktakerRequired: Locator;

  /** select2 key (id or name) of the stocktaker dropdown in the Assign dialog. */
  protected abstract readonly stocktakerKey: string;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { level: 1, name: /^Stocktake (FAVE|No) #/ });
    this.summaryTab = page.getByRole('tab', { name: 'Summary', exact: true });
    this.detailsTab = page.getByRole('tab', { name: 'Details', exact: true });
    this.assignmentTab = page.getByRole('tab', { name: 'Assignment', exact: true });
    // Tab panes and DataTables have stable ids; the tables have no accessible names.
    this.summaryPane = page.locator('#summary_tab');
    this.summaryRows = page.locator('#tbsummary tbody tr');
    this.detailRows = page.locator('#tbdetail tbody tr');
    this.assignRows = page.locator('#tbassign tbody tr');
    this.exportLink = this.summaryPane.getByRole('link', { name: 'Export', exact: true });
    this.updateResultButton = page.locator('#detail_tab').getByRole('button', { name: 'Update Result', exact: true });
    this.assignStocktakerButton = page.locator('#assign_tab').getByRole('button', { name: 'Assign Stocktaker', exact: true });
    this.resultModal = page.locator('#modal_result');
    this.assignModal = page.locator('#modal_assign');
    this.remarks = this.resultModal.locator('textarea[name="Remarks"]');
    this.stocktakerRequired = this.assignModal.getByText('User is required', { exact: true });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
    await expect(this.page.locator('#tbsummary_info')).toHaveText(/Showing/, { timeout: 30_000 });
  }

  /** Summary row of one Sighted Result (first cell), e.g. "PENDING ... 468". */
  summaryRow(result: SightedResult): Locator {
    return this.summaryRows.filter({ has: this.page.locator('td:first-child', { hasText: new RegExp(`^\\s*${result}\\s*$`) }) });
  }

  /** Count column (last cell) of a Summary row. */
  summaryCount(result: SightedResult): Locator {
    return this.summaryRow(result).locator('td').last();
  }

  async openSummary(): Promise<void> {
    await this.summaryTab.click();
    await expect(this.summaryPane).toBeVisible();
  }

  async openDetails(): Promise<void> {
    await this.detailsTab.click();
    await expect(this.page.locator('#detail_tab')).toBeVisible();
  }

  async openAssignment(): Promise<void> {
    await this.assignmentTab.click();
    await expect(this.page.locator('#assign_tab')).toBeVisible();
  }

  detailRow(assetId: string): Locator {
    return this.detailRows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  assignRow(assetId: string): Locator {
    return this.assignRows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  /** Stocktaker column (last cell) of an Assignment row. */
  stocktakerOf(assetId: string): Locator {
    return this.assignRow(assetId).locator('td').last();
  }

  /** Details tab, keyword search for one asset. */
  async searchDetails(assetId: string): Promise<void> {
    await this.detailsTab.click();
    const pane = this.page.locator('#detail_tab');
    await pane.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill(assetId);
    await this.reloadsTable('#tbdetail', () => pane.getByRole('button', { name: 'Search', exact: true }).click());
    await expect(this.detailRow(assetId)).toHaveCount(1);
  }

  /** Assignment tab, keyword search for one asset. */
  async searchAssignment(assetId: string): Promise<void> {
    await this.assignmentTab.click();
    const pane = this.page.locator('#assign_tab');
    await pane.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill(assetId);
    await this.reloadsTable('#tbassign', () => pane.getByRole('button', { name: 'Search', exact: true }).click());
    await expect(this.assignRow(assetId)).toHaveCount(1);
  }

  /**
   * Select exactly one row. The checkbox state is not reliable (it can show ticked on a fresh page while
   * nothing is selected, and a selection survives redraws), so go by the table's own counter
   * ("Showing ... 1 row selected") and click until it says one row.
   */
  protected async tick(row: Locator, info: Locator): Promise<void> {
    const box = row.getByRole('checkbox');
    const oneRow = /records\s*1 row selected/; // "Showing 1 to 1 of 1 records1 row selected" (no space)
    await expect(async () => {
      if (!oneRow.test(await info.innerText())) await box.click();
      await expect(info).toContainText(oneRow, { timeout: 2_000 });
    }).toPass({ timeout: 20_000 });
  }

  /** Tick one asset in the Details table and open Update Result. Single selection pre-loads its saved values. */
  async openUpdateResult(assetId: string): Promise<void> {
    await this.tick(this.detailRow(assetId), this.page.locator('#tbdetail_info'));
    await this.updateResultButton.click();
    await expect(this.resultModal).toBeVisible();
  }

  /** Current text of a select2 dropdown in a dialog (e.g. "SIGHTED"). */
  selectedIn(modal: Locator, selectKey: string): Locator {
    return modal.locator(`[id^="select2-${selectKey}-"][id$="-container"]`);
  }

  get sightedResult(): Locator {
    return this.selectedIn(this.resultModal, 'SightedResult');
  }

  async pickSightedResult(result: SightedResult): Promise<void> {
    await this.pickSelect2(this.resultModal, 'SightedResult', result);
    await expect(this.sightedResult).toHaveText(result);
  }

  /** Submit the Update Result dialog and close the result message. Returns the message. */
  async submitResult(): Promise<string> {
    await this.resultModal.getByRole('button', { name: 'Submit', exact: true }).click();
    return this.acknowledge(/updated/);
  }

  /** Stocktakers offered in the Assign dialog (loaded by XHR with the page / cost centre). */
  async stocktakerOptions(): Promise<string[]> {
    const k = this.stocktakerKey;
    const options = this.assignModal.locator(`select[id="${k}"] option:not([value=""]), select[name="${k}"] option:not([value=""])`);
    await expect(options.first()).toBeAttached({ timeout: 30_000 });
    return [...new Set((await options.allTextContents()).map((t) => t.trim()).filter(Boolean))];
  }

  /** Tick one asset in the Assignment table and open Assign Stocktaker. */
  async openAssign(assetId: string): Promise<void> {
    await this.tick(this.assignRow(assetId), this.page.locator('#tbassign_info'));
    await this.assignStocktakerButton.click();
    await expect(this.assignModal).toBeVisible();
  }

  async submitAssign(): Promise<void> {
    await this.assignModal.getByRole('button', { name: 'Submit', exact: true }).click();
  }

  /** Close the Assign dialog without saving. */
  async closeAssign(): Promise<void> {
    await this.assignModal.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(this.assignModal).toBeHidden();
  }

  /**
   * Assign a stocktaker to one asset (Assignment tab). FAVE asks for a confirmation first, ad hoc does not.
   * Returns the confirmation question (if any) and the result message.
   */
  async assignStocktaker(assetId: string, stocktaker: string): Promise<{ confirmation?: string; message: string }> {
    await this.openAssign(assetId);
    await this.pickSelect2(this.assignModal, this.stocktakerKey, stocktaker);
    await this.submitAssign();
    await expect(this.alertText).toBeVisible();
    let confirmation: string | undefined;
    const first = (await this.alertText.innerText()).trim();
    if (/^Please confirm/.test(first)) {
      confirmation = first;
      await this.confirm(/^Please confirm/);
    }
    const message = await this.acknowledge(/assigned/);
    return { confirmation, message };
  }

  /** Click Export on the Summary tab and return the download (an .xlsx file). */
  async export(): Promise<Download> {
    await this.openSummary();
    const [download] = await Promise.all([this.page.waitForEvent('download', { timeout: 60_000 }), this.exportLink.click()]);
    return download;
  }
}
