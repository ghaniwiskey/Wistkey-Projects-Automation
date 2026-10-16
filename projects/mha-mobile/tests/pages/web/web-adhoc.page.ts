import { Page, Locator, expect } from '@playwright/test';
import { WebBasePage } from './web-base.page';

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * MHA web ad hoc stocktakes (LOGS1): Ad Hoc Setup (/Stocktake/Stocktake, #tblist: Stocktake No, Name, Asset
 * Selection, Recurrence Type, Created By, Created Date, Status, Stocktake Frequency ONE-OFF / PERIODIC;
 * keyword "Stocktake No / Stocktake Name") and Ad Hoc Listing (/Stocktake/StocktakeListing, keyword
 * "Stocktake No"; details /Stocktake/StocktakeListingForm with tabs Summary, Details (#tbdetail, Update
 * Result #modal_result) and Assignment (#tbassign: ..., Ad Hoc Stocktaker last; Assign Stocktaker
 * #modal_assign, no confirmation). One-off stocktakes cannot be cancelled, so tests reuse one.
 * Slim version of mha-spf's AdHocSetupPage / AdHocListingPage.
 */
export class WebAdHocPage extends WebBasePage {
  static readonly setupPath = 'Stocktake/Stocktake';
  static readonly listingPath = 'Stocktake/StocktakeListing';

  readonly rows: Locator;
  readonly info: Locator;
  readonly detailRows: Locator;
  readonly detailInfo: Locator;
  readonly assignRows: Locator;
  readonly assignInfo: Locator;
  readonly assignModal: Locator;
  readonly resultModal: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    this.detailRows = page.locator('#tbdetail tbody tr');
    this.detailInfo = page.locator('#tbdetail_info');
    this.assignRows = page.locator('#tbassign tbody tr');
    this.assignInfo = page.locator('#tbassign_info');
    this.assignModal = page.locator('#modal_assign');
    this.resultModal = page.locator('#modal_result');
  }

  private async searchList(path: string, placeholder: string, keyword: string): Promise<void> {
    await this.navigate(path);
    await expect(this.info).toHaveText(/Showing/, { timeout: 30_000 });
    await this.page.getByPlaceholder(placeholder, { exact: true }).fill(keyword);
    await this.reloadsTable('#tblist', () => this.page.getByRole('button', { name: 'Search', exact: true }).click());
  }

  /** Stocktake No of the newest one-off setup (not cancelled) whose name starts with the prefix. */
  async findOneOff(namePrefix: string): Promise<string | undefined> {
    await this.searchList(WebAdHocPage.setupPath, 'Stocktake No / Stocktake Name', namePrefix);
    if ((await this.tableTotal(this.info)) === 0) return undefined;
    for (const row of await this.rows.all()) {
      const c = (await row.locator('td').allInnerTexts()).map((t) => t.trim());
      if (c[1]?.startsWith(namePrefix) && c[6] !== 'CANCELLED' && c[7] === 'ONE-OFF') return c[0];
    }
    return undefined;
  }

  /** Open a stocktake from Ad Hoc Listing. */
  async open(stocktakeNo: string): Promise<void> {
    await this.searchList(WebAdHocPage.listingPath, 'Stocktake No', stocktakeNo);
    const row = this.rows.filter({ hasText: stocktakeNo });
    await expect(row).toHaveCount(1);
    await row.locator('td').last().getByRole('link').click();
    await expect(this.page.getByRole('heading', { level: 1, name: new RegExp(`Stocktake No #${stocktakeNo}`) })).toBeVisible();
  }

  private async openTab(name: 'Details' | 'Assignment', info: Locator): Promise<void> {
    await this.page.getByRole('tab', { name, exact: true }).click();
    await expect(info).toHaveText(/Showing/, { timeout: 30_000 });
  }

  /** Assignment tab: the first asset and its Ad Hoc Stocktaker ("-" when none). */
  async firstAssignment(): Promise<{ asset: string; stocktaker: string }> {
    await this.openTab('Assignment', this.assignInfo);
    const row = this.assignRows.first();
    const asset = ((await row.innerText()).match(/Asset ID: (\d+)/) ?? [])[1] ?? '';
    expect(asset, 'the ad hoc stocktake has an asset').not.toBe('');
    return { asset, stocktaker: (await row.locator('td').last().innerText()).trim() };
  }

  /** Assignment tab: assign the stocktaker (name matched case-insensitively) to one asset. */
  async assignStocktaker(assetId: string, officer: string): Promise<string> {
    await this.openTab('Assignment', this.assignInfo);
    await this.tickOne(this.assignRows.filter({ hasText: `Asset ID: ${assetId}` }), this.assignInfo);
    await this.page.getByRole('button', { name: 'Assign Stocktaker', exact: true }).click();
    await expect(this.assignModal).toBeVisible();
    const options = this.selectOptions(this.assignModal, 'UserId');
    await expect(options.nth(1)).toBeAttached({ timeout: 30_000 });
    const name = (await options.allTextContents()).map((t) => t.trim()).find((t) => sameName(t, officer));
    expect(name, `${officer} is offered as ad hoc stocktaker`).toBeTruthy();
    await this.pickSelect2(this.assignModal, 'UserId', name as string);
    await this.assignModal.getByRole('button', { name: 'Submit', exact: true }).click();
    return this.acknowledge(/assigned/);
  }

  /** Details tab: the result of an asset (SIGHTED / NOT SIGHTED / PENDING). */
  async resultOf(assetId: string): Promise<string> {
    await this.openTab('Details', this.detailInfo);
    const text = await this.detailRows.filter({ hasText: `Asset ID: ${assetId}` }).innerText();
    return (text.match(/\b(NOT SIGHTED|SIGHTED|PENDING)\b/) ?? [''])[0];
  }

  /** Details tab: set the asset's result back to PENDING when it is not. */
  async ensurePending(assetId: string): Promise<void> {
    if ((await this.resultOf(assetId)) === 'PENDING') return;
    await this.tickOne(this.detailRows.filter({ hasText: `Asset ID: ${assetId}` }), this.detailInfo);
    await this.page.getByRole('button', { name: 'Update Result', exact: true }).click();
    await expect(this.resultModal).toBeVisible();
    await this.pickSelect2(this.resultModal, 'SightedResult', 'PENDING');
    await this.resultModal.getByRole('button', { name: 'Submit', exact: true }).click();
    await this.acknowledge(/updated/);
  }
}
