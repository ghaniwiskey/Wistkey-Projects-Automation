import { Page, Locator, expect } from '@playwright/test';
import { WizardPage } from './wizard.page';

/** One open item in the Follow up list. */
export type FollowUpItem = { fave: string; assetId: string };

/**
 * Stocktake > Follow up (/Stocktake/Followup, FALO / URO / UAO): Close Item wizard Start (radio
 * "Close Item", the only type) > Choose Asset (#tblist: FAVE No, Asset, Serial No, Cost Centre, Group,
 * HTD Follow-up, FSSC Outcome, Follow-up Type ASSET/LOCATION, LOGS1, FALO, Stocktaker) > Review
 * (#tbreview) > End (h2 "Stocktake Follow-up Close", #summary "1 Asset has been closed.").
 * The list holds the OPEN items of FAVEs that went through approval. Ticking a row moves it out of the
 * list into the selection (the table total drops by one). No reason and no confirmation: Submit closes
 * the items for good, so each run uses one item up.
 */
export class FollowUpPage extends WizardPage {
  static readonly path = 'Stocktake/Followup';

  readonly listInfo: Locator;
  readonly reviewRows: Locator;
  readonly endSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.listInfo = page.locator('#tblist_info');
    this.reviewRows = page.locator('#tbreview tbody tr');
    this.endSummary = page.locator('#summary');
  }

  async goto(): Promise<void> {
    await this.navigate(FollowUpPage.path);
    await expect(this.stepHeading('Close Item - Start')).toBeVisible();
    await expect(this.page.getByRole('radio', { name: 'Close Item' })).toBeChecked();
  }

  /** Start > Choose Asset. */
  async start(): Promise<void> {
    await this.goto();
    await this.nextToChooseAsset('Close Item - Choose Asset');
    await expect(this.listInfo).toHaveText(/Showing/, { timeout: 30_000 });
  }

  /** Number of open items in the list (current filters). */
  async total(): Promise<number> {
    return this.tableTotal(this.listInfo);
  }

  /** FAVE number and Asset ID of the first open item, or undefined when the list is empty. */
  async firstItem(): Promise<FollowUpItem | undefined> {
    if ((await this.total()) === 0) return undefined;
    const text = await this.assetRows.first().innerText();
    const fave = text.match(/FAVE FY\d{2}-\d{4}/)?.[0];
    const assetId = text.match(/Asset ID: (\d+)/)?.[1];
    if (!fave || !assetId) throw new Error(`Unexpected Follow up row: ${text}`);
    return { fave, assetId };
  }

  /** List rows of one item (an asset can have open items from several FAVEs). */
  itemRows(item: FollowUpItem): Locator {
    return this.assetRows.filter({ hasText: item.fave }).filter({ hasText: `Asset ID: ${item.assetId}` });
  }

  /** Search the list by Asset ID. */
  async searchItem(item: FollowUpItem): Promise<void> {
    await this.searchAsset(item.assetId);
  }

  /** Tick one item; the row leaves the list and the counter says 1 selected. */
  async tickItem(item: FollowUpItem): Promise<void> {
    await this.itemRows(item).first().getByRole('checkbox').click();
    await expect(this.selectedCount).toHaveText(/^\s*1\s*asset\(s\) selected/);
  }

  /** Choose Asset > Review. */
  async nextToReview(): Promise<void> {
    await this.next();
    await expect(this.stepHeading('Close Item - Review')).toBeVisible();
  }
}
