import { Page, Locator, expect } from '@playwright/test';
import { WizardPage } from './wizard.page';

/**
 * Asset > Print Tag (/Asset/PrintTag): Reprint RFID Tag wizard Start > Choose Asset (#tblist) > Review
 * (#tbprint) > Reason (select2 #printTagReason, OTHER adds Remarks max 200) > End.
 * Submit sends the tags to a Zebra printer through Zebra Browser Print. Without it (as on the test
 * machines) the app shows a printer error, then the End step lists the assets as failed (#tbfail).
 */
export class PrintTagPage extends WizardPage {
  static readonly path = 'Asset/PrintTag';

  readonly reasonOptions: Locator;
  readonly selectedReason: Locator;
  readonly reasonRequired: Locator;
  readonly remarks: Locator;
  readonly remarksRequired: Locator;
  readonly remarksCounter: Locator;
  readonly reviewRows: Locator;
  readonly endHeading: Locator;
  readonly endSummary: Locator;
  readonly failedHeading: Locator;
  readonly failedRows: Locator;

  constructor(page: Page) {
    super(page);
    // Reason step: the hidden <select> holds the options; select2 shows the current one.
    this.reasonOptions = page.locator('select#printTagReason option');
    this.selectedReason = page.locator('[id^="select2-printTagReason"][id$="-container"]');
    this.reasonRequired = page.getByText('Reason is required', { exact: true }).filter({ visible: true });
    this.remarks = page.locator('textarea[name="ReasonRemarks"]');
    this.remarksRequired = page.getByText('Remarks is required', { exact: true }).filter({ visible: true });
    this.remarksCounter = page.getByText(/^\s*\d+ \/ 200\s*$/).filter({ visible: true });
    this.reviewRows = page.locator('#tbprint tbody tr');
    // End step: ids from the app markup (the headings have no roles beyond h2/h5).
    this.endHeading = page.locator('#summary_header');
    this.endSummary = page.locator('#summary');
    this.failedHeading = page.locator('#summary_fail');
    this.failedRows = page.locator('#tbfail tbody tr');
  }

  async goto(): Promise<void> {
    await this.navigate(PrintTagPage.path);
    await expect(this.stepHeading('Print Tag - Start')).toBeVisible();
    await expect(this.page.getByRole('radio', { name: 'Reprint RFID Tag' })).toBeChecked();
  }

  /** Start (Reprint RFID Tag is the only choice) > Choose Asset. */
  async start(): Promise<void> {
    await this.goto();
    await this.nextToChooseAsset('Print Tag - Choose Asset');
  }

  /** Asset ID of the first asset in Choose Asset (the test asset; no fixed ID). */
  async firstAssetId(): Promise<string> {
    await expect(this.assetRows.first()).toBeVisible();
    const id = (await this.assetRows.first().innerText()).match(/Asset ID: (\d+)/)?.[1];
    if (!id) throw new Error('The Print Tag asset list is empty');
    return id;
  }

  /** Choose Asset > Review > Reason for one asset. */
  async goToReason(assetId: string): Promise<void> {
    await this.searchAsset(assetId);
    await this.selectAsset(assetId);
    await this.next();
    await expect(this.stepHeading('Print Tag - Review')).toBeVisible();
    await expect(this.reviewRows).toHaveCount(1);
    await expect(this.reviewRows.first()).toContainText(`Asset ID: ${assetId}`);
    await this.next();
    await expect(this.stepHeading('Print Tag - Reason')).toBeVisible();
  }

  /** Reason option texts, without the "Select Reason" placeholder. */
  async reasons(): Promise<string[]> {
    return (await this.reasonOptions.allTextContents()).map((t) => t.trim()).filter((t) => t && t !== 'Select Reason');
  }

  /** Pick a reason by its text ("Select Reason" empties it). */
  async pickReason(reason: string): Promise<void> {
    await this.pickSelect2(this.page, 'printTagReason', reason);
    await expect(this.selectedReason).toHaveText(reason);
  }

  /** Submit on the Reason step without expecting the End step (validation). */
  async submitReason(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Submit the reprint. With no Zebra Browser Print the app first shows a printer error; it is closed
   * here and returned (undefined when a printer answered). Then the End step shows.
   */
  async submitReprint(): Promise<string | undefined> {
    await this.submitButton.click();
    let printerError: string | undefined;
    // The printer error pops up over the End step, so both can be visible at once.
    await expect(this.alert.or(this.endHeading.filter({ visible: true })).first()).toBeVisible({ timeout: 30_000 });
    if (await this.alert.isVisible()) printerError = await this.acknowledge(/Zebra/);
    await expect(this.endHeading).toBeVisible({ timeout: 30_000 });
    return printerError;
  }

  failedRow(assetId: string): Locator {
    return this.failedRows.filter({ hasText: `Asset ID: ${assetId}` });
  }
}
