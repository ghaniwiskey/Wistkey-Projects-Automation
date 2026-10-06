import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { WizardPage } from './wizard.page';
import { StocktakeFormPage } from './stocktake-form.page';

export type AdHocStatus = 'CREATED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type Recurrence = 'BI-ANNUALLY' | 'MONTHLY' | 'QUARTERLY' | 'WEEKLY';

/**
 * Stocktake > Ad Hoc Setup (/Stocktake/Stocktake): list of ad hoc stocktake setups (#tblist) and their
 * details (/Stocktake/StocktakeForm?stktakeId=...). Columns: Stocktake No, Name, Asset Selection,
 * Recurrence Type, Created By, Created Date, Status, Stocktake Frequency, Actions (pencil).
 * New setups are CREATED; a one-off becomes SUBMITTED once results are recorded in Ad Hoc Listing.
 * The details page of a CREATED setup shows Cancel (dialog #modal_cancel: select2 Reason + Remarks),
 * but only periodic setups can be cancelled: a one-off answers "Can't cancel one-off stocktake type.".
 * The Status filter has no CREATED option, so CREATED setups are found by reading the rows.
 */
export class AdHocSetupPage extends BasePage {
  static readonly path = 'Stocktake/Stocktake';

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;
  readonly statusBadge: Locator;
  readonly cancelButton: Locator;
  readonly cancelModal: Locator;
  readonly cancelRemarks: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Ad Hoc Setup', level: 1 });
    this.searchInput = page.getByPlaceholder('Stocktake No / Stocktake Name');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    // The status badge in the details header (other badges on the page show asset statuses).
    this.statusBadge = page.locator('.badge').filter({ hasText: /^\s*(CREATED|SUBMITTED|APPROVED|REJECTED|CANCELLED)\s*$/ }).first();
    // Opens #modal_cancel; role queries skip the hidden dialogs' own Cancel buttons.
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.cancelModal = page.locator('#modal_cancel');
    this.cancelRemarks = this.cancelModal.locator('textarea[name="ReasonRemarks"]');
  }

  async goto(): Promise<void> {
    await this.navigate(AdHocSetupPage.path);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing/, { timeout: 30_000 });
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  row(stocktakeNo: string): Locator {
    return this.rows.filter({ hasText: stocktakeNo });
  }

  /** Cell of a row (0-based): 1 name, 2 asset selection, 3 recurrence, 6 status, 7 frequency. */
  cell(stocktakeNo: string, column: number): Locator {
    return this.row(stocktakeNo).locator('td').nth(column);
  }

  status(stocktakeNo: string): Locator {
    return this.cell(stocktakeNo, 6);
  }

  async find(stocktakeNo: string): Promise<void> {
    await this.goto();
    await this.search(stocktakeNo);
    await expect(this.row(stocktakeNo)).toHaveCount(1);
  }

  async open(stocktakeNo: string): Promise<void> {
    await this.find(stocktakeNo);
    await this.row(stocktakeNo).locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Stocktake\/StocktakeForm\?stktakeId=/);
    await expect(this.page.getByRole('heading', { level: 1, name: new RegExp(`Stocktake No #${stocktakeNo}`) })).toBeVisible();
  }

  /** Reason options of the Cancel dialog with this visible label. */
  cancelReason(label: string): Locator {
    return this.cancelModal.locator('select[name="Reason"] option').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) });
  }

  async openCancel(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.cancelModal).toBeVisible();
  }

  /** Cancel the open setup: pick the reason by its label, type remarks, Submit. Returns the message. */
  async cancel(reason: string, remarks: string): Promise<string> {
    if (!(await this.cancelModal.isVisible())) await this.openCancel();
    await this.pickSelect2(this.cancelModal, 'Reason', reason);
    return this.submitCancel(remarks);
  }

  /**
   * Cleanup only: cancel with the reason value OTHER picked in the underlying <select>. Works around
   * BUG-001 (the option has an empty label, so it cannot be picked by name in the dropdown).
   */
  async cancelWithOtherReason(remarks: string): Promise<string> {
    if (!(await this.cancelModal.isVisible())) await this.openCancel();
    await this.cancelModal.locator('select[name="Reason"]').selectOption('OTHER', { force: true });
    return this.submitCancel(remarks);
  }

  private async submitCancel(remarks: string): Promise<string> {
    await expect(this.cancelRemarks).toBeVisible();
    await this.cancelRemarks.fill(remarks);
    await this.cancelModal.getByRole('button', { name: 'Submit', exact: true }).click();
    return this.acknowledge(/cancelled/);
  }

  /** Numbers of CREATED periodic setups (the cancellable ones) whose number or name contains the keyword (first list page). */
  async createdSetups(keyword: string): Promise<string[]> {
    await this.goto();
    await this.search(keyword);
    if ((await this.tableTotal(this.info)) === 0) return [];
    const found: string[] = [];
    for (const r of await this.rows.all()) {
      const cells = (await r.locator('td').allInnerTexts()).map((t) => t.trim());
      if (cells[6] === 'CREATED' && cells[7] === 'PERIODIC' && /^ADST\d+$/.test(cells[0])) found.push(cells[0]);
    }
    return found;
  }
}

export type AdHocSetup = {
  frequency: 'ONE-OFF' | 'PERIODIC';
  selection: 'MANUAL' | 'RANDOM';
  name: string;
  remarks?: string;
  /** Periodic only. Number of Recurrence and Start Date keep their defaults (1, tomorrow). */
  recurrence?: Recurrence;
};

/**
 * Ad Hoc Setup > Create (/Stocktake/StocktakeCreate): Start (frequency and selection radios, name,
 * periodic fields) > Choose Asset (#tbSearch) > Review (#tbList) > End ("Ad Hoc Stocktake No. ADST...
 * has been created"). One-Off hides Recurrence Type, Number of Recurrence and Start Date.
 */
export class AdHocCreatePage extends WizardPage {
  static readonly path = 'Stocktake/StocktakeCreate';

  readonly nameInput: Locator;
  readonly remarksInput: Locator;
  readonly startDate: Locator;
  readonly nameRequired: Locator;
  readonly chooseAssetRows: Locator;
  readonly reviewRows: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input[name="StktakeName"]');
    this.remarksInput = page.locator('textarea[name="Remarks"]').filter({ visible: true });
    this.startDate = page.locator('input[name="StartOn"]');
    this.nameRequired = page.getByText('Stocktake Name is required', { exact: true });
    this.chooseAssetRows = page.locator('#tbSearch tbody tr');
    this.reviewRows = page.locator('#tbList tbody tr');
  }

  get recurrence(): Locator {
    return this.select2(this.page, 'FreqPeriod');
  }

  async goto(): Promise<void> {
    await this.navigate(AdHocCreatePage.path);
    await expect(this.nameInput).toBeVisible();
  }

  /** Fill the Start step (no Next). */
  async fillStart(s: AdHocSetup): Promise<void> {
    await this.radioCard(`StktakeFreq_${s.frequency}`).click();
    await this.radioCard(`StktakeType_${s.selection}`).click();
    await this.nameInput.fill(s.name);
    if (s.recurrence) await this.pickSelect2(this.page, 'FreqPeriod', s.recurrence);
    if (s.remarks !== undefined) await this.remarksInput.fill(s.remarks);
  }

  /** Next from the Start step to Choose Asset. */
  async nextToAssets(): Promise<void> {
    await this.next();
    await expect(this.page.locator('#tbSearch_info')).toHaveText(/Showing/, { timeout: 30_000 });
  }

  chooseAssetRow(assetId: string): Locator {
    return this.chooseAssetRows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  /** Search and tick one asset in Choose Asset (the app tracks the selection, not the checkbox). */
  async tickAsset(assetId: string): Promise<void> {
    await this.searchInput.fill(assetId);
    await this.reloadsTable('#tbSearch', () => this.searchButton.filter({ visible: true }).first().click());
    await expect(this.chooseAssetRow(assetId)).toHaveCount(1);
    await this.chooseAssetRow(assetId).getByRole('checkbox').click();
    await expect(this.selectedCount).toHaveText(/^\s*1\s*asset\(s\) selected/);
  }

  /** Next from Choose Asset to Review. */
  async nextToReview(): Promise<void> {
    await this.next();
    await expect(this.reviewRows.first()).toBeVisible();
  }

  /** Whole flow: Start, one asset, Review, Submit. Returns the End message and the ADST number. */
  async create(s: AdHocSetup, assetId: string): Promise<{ message: string; stocktakeNo: string }> {
    await this.goto();
    await this.fillStart(s);
    await this.nextToAssets();
    await this.tickAsset(assetId);
    await this.nextToReview();
    return this.submitSetup();
  }

  async submitSetup(): Promise<{ message: string; stocktakeNo: string }> {
    const message = await this.submit();
    const stocktakeNo = message.match(/ADST\d+/)?.[0];
    if (!stocktakeNo) throw new Error(`No ad hoc stocktake number in "${message}"`);
    return { message, stocktakeNo };
  }
}

/**
 * Stocktake > Ad Hoc Listing (/Stocktake/StocktakeListing, #tblist: Stocktake No, Name, Create Date,
 * pencil) and its details (/Stocktake/StocktakeListingForm?stktakeId=...): Summary / Details /
 * Assignment like FAVE, without cost centres or asset condition. Ok after Update Result reloads the
 * whole page (back on Summary); Ok after Assign Stocktaker does not, and there is no confirmation.
 */
export class AdHocListingPage extends StocktakeFormPage {
  static readonly path = 'Stocktake/StocktakeListing';
  protected readonly stocktakerKey = 'UserId';

  readonly listHeading: Locator;
  readonly listSearchInput: Locator;
  readonly listRows: Locator;
  readonly listInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.listHeading = page.getByRole('heading', { name: 'Ad Hoc Listing', level: 1 });
    this.listSearchInput = page.getByPlaceholder('Stocktake No', { exact: true });
    this.listRows = page.locator('#tblist tbody tr');
    this.listInfo = page.locator('#tblist_info');
  }

  async gotoList(): Promise<void> {
    await this.navigate(AdHocListingPage.path);
    await expect(this.listHeading).toBeVisible();
    await expect(this.listInfo).toHaveText(/Showing/, { timeout: 30_000 });
  }

  listRow(stocktakeNo: string): Locator {
    return this.listRows.filter({ hasText: stocktakeNo });
  }

  async find(stocktakeNo: string): Promise<void> {
    await this.gotoList();
    await this.listSearchInput.fill(stocktakeNo);
    await this.reloadsTable('#tblist', () => this.page.getByRole('button', { name: 'Search', exact: true }).click());
    await expect(this.listRow(stocktakeNo)).toHaveCount(1);
  }

  async open(stocktakeNo: string): Promise<void> {
    await this.find(stocktakeNo);
    await this.listRow(stocktakeNo).locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Stocktake\/StocktakeListingForm\?stktakeId=/);
    await this.expectLoaded();
    await expect(this.title).toContainText(`Stocktake No #${stocktakeNo}`);
  }

  /** Update Result in the Details tab for one asset; the page reloads on Ok. Returns the message. */
  async updateResult(assetId: string, sighted: 'SIGHTED' | 'NOT SIGHTED' | 'PENDING', remarks: string): Promise<string> {
    await this.searchDetails(assetId);
    await this.openUpdateResult(assetId);
    await this.pickSightedResult(sighted);
    await this.remarks.fill(remarks);
    const reloaded = this.page.waitForEvent('load');
    const message = await this.submitResult();
    await reloaded;
    await this.expectLoaded();
    return message;
  }
}
