import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { WizardPage } from './wizard.page';

export type NewAssetStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

/**
 * Asset > New Asset (/Asset/NewAsset): reported potential assets. Search "Request No / Asset Desc",
 * filters Cost Centre / Created By / Status. Columns: Request Number, Asset Description, Cost Centre,
 * Created By, Created Date, Status, Actions (pencil).
 */
export class NewAssetListPage extends BasePage {
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'New Asset', level: 1 });
    this.createButton = page.getByRole('link', { name: 'Create', exact: true });
    this.searchInput = page.getByPlaceholder('Request No / Asset Desc');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
  }

  async goto(): Promise<void> {
    await this.navigate('Asset/NewAsset');
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing/, { timeout: 30_000 });
  }

  async search(keyword: string, status?: NewAssetStatus): Promise<void> {
    if (status) await this.pickSelect2(this.page, 'Status', status);
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  row(requestNo: string): Locator {
    return this.rows.filter({ hasText: requestNo });
  }

  status(requestNo: string): Locator {
    return this.row(requestNo).locator('td').nth(5);
  }

  description(requestNo: string): Locator {
    return this.row(requestNo).locator('td').nth(1);
  }

  /**
   * Search one request. A report created a moment ago sometimes comes back empty on the first
   * search (seen once in HTA-016, 2026-10-06), so search again until the row shows up.
   */
  async find(requestNo: string): Promise<void> {
    await this.goto();
    await expect(async () => {
      await this.search(requestNo);
      await expect(this.row(requestNo)).toHaveCount(1, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async open(requestNo: string): Promise<void> {
    await this.find(requestNo);
    await this.row(requestNo).locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Asset\/NewAssetForm\?assetNewId=/);
  }

  /** Request numbers of OPEN reports whose description contains the text. */
  async openRequests(descriptionText: string): Promise<string[]> {
    await this.goto();
    await this.search(descriptionText, 'OPEN');
    if ((await this.tableTotal(this.info)) === 0) return [];
    const cells = await this.rows.locator('td:first-child').allInnerTexts();
    return cells.map((t) => t.trim()).filter((t) => /^RNA\d+$/.test(t));
  }
}

export type NewAssetReport = {
  /** Cost Centre option; default: the first one offered (the account's units). */
  costCentre?: string;
  description: string;
  remarks: string;
  /** Postal code to search, e.g. taken from another asset of the unit; the first address found is picked. */
  postalCode: string;
  locationRemarks: string;
  photo: string;
};

/** Report New Asset wizard (/Asset/NewAssetCreate): Start > Asset > Location > Photo (mandatory) > End. */
export class NewAssetCreatePage extends WizardPage {
  readonly description: Locator;
  readonly remarks: Locator;
  readonly locationRemarks: Locator;
  readonly photoInput: Locator;

  constructor(page: Page) {
    super(page);
    this.description = page.locator('textarea[name="AssetDesc"]');
    this.remarks = page.locator('textarea[name="Remarks"]');
    this.locationRemarks = page.locator('textarea[name="LocRemarks"]');
    this.photoInput = page.locator('input[type="file"][name="Image"]');
  }

  /** First option of the Cost Centre dropdown (the account's units). */
  async firstCostCentre(): Promise<string> {
    const options = this.page.locator('select[id="CostCenterId" i], select[name="CostCenterId" i]').locator('option:not([value=""]):not([value="0"])');
    await expect(options.first()).toBeAttached({ timeout: 30_000 });
    return ((await options.first().textContent()) ?? '').trim();
  }

  /** Report a potential asset; returns the End-step message and the request number (RNA...). */
  async report(r: NewAssetReport): Promise<{ message: string; requestNo: string }> {
    await this.navigate('Asset/NewAssetCreate');
    await expect(this.stepHeading('Report New Asset - Start')).toBeVisible();
    await this.next();
    await expect(this.stepHeading('Report New Asset - Asset')).toBeVisible();
    await this.pickSelect2(this.page, 'CostCenterId', r.costCentre ?? (await this.firstCostCentre()));
    await this.description.fill(r.description);
    await this.remarks.fill(r.remarks);
    await this.next();
    await expect(this.stepHeading('Report New Asset - Location')).toBeVisible();
    await this.searchSelect2(this.page, 'postalCode', r.postalCode, this.postalResult(r.postalCode));
    // Building/Address are filled by XHR from the postal code; type the remarks after that.
    await expect(this.page.locator('input[name="Building"]')).toHaveValue(/\S/);
    await this.locationRemarks.fill(r.locationRemarks);
    await this.next();
    await expect(this.stepHeading('Report New Asset - Photo *')).toBeVisible();
    await this.photoInput.setInputFiles(r.photo);
    const message = await this.submit();
    const requestNo = message.match(/RNA\d+/)?.[0];
    if (!requestNo) throw new Error(`No request number in "${message}"`);
    return { message, requestNo };
  }
}

/**
 * Reported new asset details (/Asset/NewAssetForm?assetNewId=...). OPEN reports show Cancel Item
 * (everyone) and Close Item (URO/LOGS1/FALO); both open a modal with a select2 Reason.
 */
export class NewAssetFormPage extends BasePage {
  readonly cancelItemButton: Locator;
  readonly closeItemButton: Locator;
  readonly description: Locator;
  readonly closeModal: Locator;
  readonly cancelModal: Locator;

  constructor(page: Page) {
    super(page);
    this.cancelItemButton = page.getByRole('button', { name: 'Cancel Item', exact: true });
    this.closeItemButton = page.getByRole('button', { name: 'Close Item', exact: true });
    this.description = page.locator('textarea[name="AssetDesc"], input[name="AssetDesc"]').first();
    this.closeModal = page.locator('#modal_close');
    this.cancelModal = page.locator('#modal_cancel');
  }

  async closeItem(reason: string, remarks?: string): Promise<string> {
    return this.resolve(this.closeItemButton, this.closeModal, reason, remarks, /closed/);
  }

  async cancelItem(reason: string, remarks?: string): Promise<string> {
    return this.resolve(this.cancelItemButton, this.cancelModal, reason, remarks, /cancel/i);
  }

  private async resolve(button: Locator, modal: Locator, reason: string, remarks: string | undefined, done: RegExp): Promise<string> {
    await button.click();
    await expect(modal).toBeVisible();
    await this.pickSelect2(modal, 'Reason', reason);
    if (remarks !== undefined) await modal.locator('textarea[name="ReasonRemarks"]').fill(remarks);
    await modal.getByRole('button', { name: 'Submit', exact: true }).click();
    // Close shows the result directly; answer a confirmation first if the app asks for one.
    await expect(this.alertText).toBeVisible();
    if (/Are you sure/.test(await this.alertText.innerText())) await this.confirm();
    return this.acknowledge(done);
  }
}
