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

  /**
   * Value of a field in the details header, e.g. detailValue('Max Asset:') -> "3". Each field is a label
   * <div> followed by its value <div>, with no label/for association.
   */
  detailValue(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('xpath=following-sibling::div[1]');
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
   * mha-spf BUG-001 (the option has an empty label, so it cannot be picked by name in the dropdown).
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
 * With Random selection, Choose Asset has filters, Max Asset / Max Group / NPC / Base and a Search that
 * draws the assets on the server (totals shown above); Next before a Search, or after one with no
 * match, says "Please click Search button to ensure there is asset(s) based on filter(s) selected.".
 */
export class AdHocCreatePage extends WizardPage {
  static readonly path = 'Stocktake/StocktakeCreate';

  readonly nameInput: Locator;
  readonly remarksInput: Locator;
  readonly startDate: Locator;
  readonly nameRequired: Locator;
  readonly chooseAssetRows: Locator;
  readonly reviewRows: Locator;
  // Random selection (Choose Asset step): read-only totals, filters, limits and its own Search button.
  readonly totalAssets: Locator;
  readonly totalGroups: Locator;
  readonly maxAsset: Locator;
  readonly maxGroup: Locator;
  readonly randomSearchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input[name="StktakeName"]');
    this.remarksInput = page.locator('textarea[name="Remarks"]').filter({ visible: true });
    this.startDate = page.locator('input[name="StartOn"]');
    this.nameRequired = page.getByText('Stocktake Name is required', { exact: true });
    this.chooseAssetRows = page.locator('#tbSearch tbody tr');
    this.reviewRows = page.locator('#tbList tbody tr');
    // The totals are disabled inputs whose labels are not linked to them (no for/id pair).
    this.totalAssets = page.locator('#totalAsset');
    this.totalGroups = page.locator('#totalLocation');
    this.maxAsset = page.locator('input[name="MaxAsset"]');
    this.maxGroup = page.locator('input[name="MaxLocation"]');
    // The manual table has another "Search" button in the same step; this attribute marks the random one.
    this.randomSearchButton = page.locator('[data-button-action-random="search"]');
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

  /** Next from the Start step to Choose Asset with Random selection (filters and limits, no table). */
  async nextToRandomAssets(): Promise<void> {
    await this.next();
    await expect(this.maxAsset).toBeVisible();
  }

  /** Random selection: pick one value in the Status filter (a multi-select select2). */
  async filterStatus(status: string): Promise<void> {
    const select = this.page.locator('select[name="AssetStatus"]');
    // A multi-select select2 has an inline search box next to the hidden <select>, not a combobox span.
    const box = this.page.locator('select[name="AssetStatus"] + .select2-container .select2-search__field');
    await box.click();
    await box.pressSequentially(status, { delay: 30 });
    await this.page.getByRole('option', { name: status, exact: true }).click();
    await this.page.keyboard.press('Escape');
    await expect(select).toHaveValues([status]);
  }

  /**
   * Random selection: set the limits (empty = no limit) and click Search. The page draws the assets on
   * the server (GET ...handler=GetList...maxLoc=...) and fills the totals from the response; with no
   * match it shows "No asset found in randomized locations: ..." instead (closed here, totals 0).
   */
  async randomSearch(limits: { maxAsset?: number; maxGroup?: number } = {}): Promise<{ assets: number; groups: number; message?: string }> {
    await this.maxAsset.fill(limits.maxAsset === undefined ? '' : String(limits.maxAsset));
    await this.maxGroup.fill(limits.maxGroup === undefined ? '' : String(limits.maxGroup));
    const response = this.page.waitForResponse((r) => r.url().includes('handler=GetList') && r.url().includes('maxLoc='), { timeout: 60_000 });
    await this.randomSearchButton.click();
    await response;
    // Search resets the totals to 0 and sets them once the response is handled.
    await expect
      .poll(async () => (await this.alert.isVisible()) || (await this.totalAssets.inputValue()) !== '0', { timeout: 15_000 })
      .toBe(true);
    if (await this.alert.isVisible()) {
      return { assets: 0, groups: 0, message: await this.acknowledge(/No asset found/) };
    }
    return { assets: Number(await this.totalAssets.inputValue()), groups: Number(await this.totalGroups.inputValue()) };
  }

  /** Review step rows (current page, 10 per page): Asset ID and Status (last column). */
  async reviewAssets(): Promise<{ id: string; status: string }[]> {
    await expect(this.reviewRows.first()).toContainText('Asset ID:');
    const assets: { id: string; status: string }[] = [];
    for (const row of await this.reviewRows.all()) {
      const id = (await row.innerText()).match(/Asset ID: (\d+)/)?.[1] ?? '';
      assets.push({ id, status: (await row.locator('td').last().innerText()).trim() });
    }
    return assets;
  }

  /** Asset ID of the first asset in Choose Asset (after nextToAssets). */
  async firstAssetId(): Promise<string> {
    await expect(this.chooseAssetRows.first()).toContainText('Asset ID:');
    const id = (await this.chooseAssetRows.first().innerText()).match(/Asset ID: (\d+)/)?.[1];
    if (!id) throw new Error('The Choose Asset list is empty');
    return id;
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

  /**
   * Whole flow: Start, one asset (the first in Choose Asset unless given), Review, Submit.
   * Returns the End message, the ADST number and the asset used.
   */
  async create(s: AdHocSetup, assetId?: string): Promise<{ message: string; stocktakeNo: string; assetId: string }> {
    await this.goto();
    await this.fillStart(s);
    await this.nextToAssets();
    const asset = assetId ?? (await this.firstAssetId());
    await this.tickAsset(asset);
    await this.nextToReview();
    return { ...(await this.submitSetup()), assetId: asset };
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

  /** Asset IDs in the Details tab (first page, 10 rows). */
  async detailAssetIds(): Promise<string[]> {
    await this.openDetails();
    await expect(this.page.locator('#tbdetail_info')).toHaveText(/Showing/, { timeout: 30_000 });
    return (await this.detailRows.allInnerTexts()).map((t) => t.match(/Asset ID: (\d+)/)?.[1] ?? '').filter(Boolean);
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
