import { Page, Locator, expect } from '@playwright/test';
import { WebBasePage } from './web-base.page';

/** A FAVE asset the mobile stocktaker can sight (found at runtime on MHA web). */
export type FaveTarget = {
  faveNo: string;
  costCentre: string;
  asset: string;
  /** The officer's name as MHA web writes it (e.g. "Tan Jun Yong Shawn"; the phone shows it in capitals). */
  stocktaker: string;
  /** True when the asset has no stocktaker yet and the test must assign the officer. */
  needsAssignment: boolean;
};

/** What the Update Result dialog pre-loads for one asset. */
export type FaveResult = {
  sighted: string;
  condition: string;
  followUp: string;
  remarks: string;
  fssc: string;
  faveStatus: string;
  locationStatus: string;
  correctLocation: boolean;
};

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * MHA web Stocktake > FAVE (VET IC): list /Stocktake/Fave (#tblist, newest FAVE first), details
 * /Stocktake/FaveForm: cost centre table (#tbcostcenter, first row selected on load, Status APPROVED = final)
 * above tabs Summary, Details (#tbdetail: Result & Condition, HTD Follow-up, FSSC Outcome, Stocktaker;
 * filters incl. Stocktaker and Result; Update Result #modal_result) and Assignment (#tbassign, Assign
 * Stocktaker #modal_assign, confirmation "Please confirm ..."). Slim version of mha-spf's FavePage.
 */
export class WebFavePage extends WebBasePage {
  static readonly path = 'Stocktake/Fave';

  readonly faveRows: Locator;
  readonly listInfo: Locator;
  readonly title: Locator;
  readonly costCentreRows: Locator;
  readonly detailsTab: Locator;
  readonly assignmentTab: Locator;
  readonly detailPane: Locator;
  readonly assignPane: Locator;
  readonly detailRows: Locator;
  readonly detailInfo: Locator;
  readonly assignRows: Locator;
  readonly assignInfo: Locator;
  readonly resultModal: Locator;
  readonly assignModal: Locator;

  constructor(page: Page) {
    super(page);
    // DataTables and Bootstrap tab panes have stable ids; the tables have no accessible names.
    this.faveRows = page.locator('#tblist tbody tr');
    this.listInfo = page.locator('#tblist_info');
    this.title = page.getByRole('heading', { level: 1, name: /^Stocktake FAVE #/ });
    this.costCentreRows = page.locator('#tbcostcenter tbody tr');
    this.detailsTab = page.getByRole('tab', { name: 'Details', exact: true });
    this.assignmentTab = page.getByRole('tab', { name: 'Assignment', exact: true });
    this.detailPane = page.locator('#detail_tab');
    this.assignPane = page.locator('#assign_tab');
    this.detailRows = page.locator('#tbdetail tbody tr');
    this.detailInfo = page.locator('#tbdetail_info');
    this.assignRows = page.locator('#tbassign tbody tr');
    this.assignInfo = page.locator('#tbassign_info');
    this.resultModal = page.locator('#modal_result');
    this.assignModal = page.locator('#modal_assign');
  }

  /** Open the newest FAVE in the list and return its number (e.g. "FAVE FY26-2007"). */
  async openCurrent(): Promise<string> {
    await this.navigate(WebFavePage.path);
    await expect(this.listInfo).toHaveText(/Showing \d/, { timeout: 30_000 });
    const faveNo = (await this.faveRows.first().locator('td').first().innerText()).trim();
    await this.faveRows.first().locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Stocktake\/FaveForm\?stktakeFAVEId=/);
    await expect(this.title).toContainText(`Stocktake FAVE #${faveNo}`);
    await expect(this.page.locator('#tbsummary_info')).toHaveText(/Showing/, { timeout: 30_000 });
    return faveNo;
  }

  costCentreRow(code: string): Locator {
    return this.costCentreRows.filter({ has: this.page.locator('td:first-child', { hasText: code }) });
  }

  async costCentreCodes(): Promise<string[]> {
    await expect(this.costCentreRows.first()).toBeVisible();
    return (await this.costCentreRows.locator('td:first-child').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  }

  /** Status column (4th) of a cost centre row: blank, SUBMITTED, REJECTED, APPROVED. */
  costCentreStatus(code: string): Locator {
    return this.costCentreRow(code).locator('td').nth(3);
  }

  /** Pick a cost centre; the Summary, Details and Assignment tables reload for it. */
  async selectCostCentre(code: string): Promise<void> {
    const row = this.costCentreRow(code);
    await expect(row).toHaveCount(1);
    if (!/\bselected\b/.test((await row.getAttribute('class')) ?? '')) {
      await this.reloadsTables(['#tbsummary', '#tbdetail', '#tbassign'], () => row.click());
    }
    await expect(row).toHaveClass(/\bselected\b/);
  }

  async openDetails(): Promise<void> {
    await this.detailsTab.click();
    await expect(this.detailPane).toBeVisible();
  }

  async openAssignment(): Promise<void> {
    await this.assignmentTab.click();
    await expect(this.assignPane).toBeVisible();
  }

  /** Stocktakers the Details filter offers for the selected cost centre (web spelling of the names). */
  async stocktakerOptions(): Promise<string[]> {
    await this.openDetails();
    const options = this.selectOptions(this.detailPane, 'StocktakerId').filter({ hasNotText: /^\s*Stocktaker\s*$/ });
    await expect(this.selectOptions(this.detailPane, 'StocktakerId').first()).toBeAttached({ timeout: 30_000 });
    return (await options.allTextContents()).map((t) => t.trim()).filter(Boolean);
  }

  /** Details filters (applied with Search): Stocktaker and/or Result. The keyword box is emptied. */
  async filterDetails(f: { stocktaker?: string; result?: string }): Promise<void> {
    await this.openDetails();
    if (f.stocktaker) await this.pickSelect2(this.detailPane, 'StocktakerId', f.stocktaker);
    if (f.result) await this.pickSelect2(this.detailPane, 'SightedResult2', f.result);
    await this.detailPane.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill('');
    await this.reloadsTable('#tbdetail', () => this.detailPane.getByRole('button', { name: 'Search', exact: true }).click());
  }

  /** Details tab, keyword search for one asset. */
  async searchDetails(assetId: string): Promise<void> {
    await this.openDetails();
    await this.detailPane.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill(assetId);
    await this.reloadsTable('#tbdetail', () => this.detailPane.getByRole('button', { name: 'Search', exact: true }).click());
    await expect(this.detailRow(assetId)).toHaveCount(1);
  }

  detailRow(assetId: string): Locator {
    return this.detailRows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  /** A Details cell by its column header (columns shift with the approval state, so never count them). */
  detailCell(assetId: string, header: string): Locator {
    return this.detailRow(assetId).locator(
      `xpath=td[count(ancestor::table[1]/thead//th[normalize-space()="${header}"]/preceding-sibling::th)+1]`,
    );
  }

  resultOf(assetId: string): Locator {
    return this.detailCell(assetId, 'Result & Condition');
  }

  followUpOf(assetId: string): Locator {
    return this.detailCell(assetId, 'HTD Follow-up');
  }

  fsscOf(assetId: string): Locator {
    return this.detailCell(assetId, 'FSSC Outcome');
  }

  stocktakerOf(assetId: string): Locator {
    return this.detailCell(assetId, 'Stocktaker');
  }

  /** Asset ID 2 and Serial Number of a Details row. */
  async idsOf(assetId: string): Promise<{ assetId2: string; serial: string }> {
    return {
      assetId2: (await this.detailCell(assetId, 'Asset ID2').innerText()).trim(),
      serial: (await this.detailCell(assetId, 'Serial Number').innerText()).trim(),
    };
  }

  /** Asset IDs of the Details rows on the current page, with their stocktaker cell. */
  async listedDetails(): Promise<{ asset: string; stocktaker: string }[]> {
    if ((await this.tableTotal(this.detailInfo)) === 0) return [];
    const out: { asset: string; stocktaker: string }[] = [];
    for (const row of await this.detailRows.all()) {
      const asset = (await row.innerText()).match(/Asset ID: (\d+)/)?.[1];
      if (asset) out.push({ asset, stocktaker: (await this.stocktakerOf(asset).innerText()).trim() });
    }
    return out;
  }

  /**
   * The asset for a mobile sighting: in the current FAVE, the first cost centre that is not APPROVED and
   * offers the officer as stocktaker; there, the first PENDING asset already assigned to the officer, or
   * else the first PENDING asset with no stocktaker (to be assigned). Undefined when there is none.
   */
  async findSightingTarget(officer: string): Promise<FaveTarget | undefined> {
    const faveNo = await this.openCurrent();
    for (const costCentre of await this.costCentreCodes()) {
      if ((await this.costCentreStatus(costCentre).innerText()).trim() === 'APPROVED') continue;
      await this.selectCostCentre(costCentre);
      const stocktaker = (await this.stocktakerOptions()).find((o) => sameName(o, officer));
      if (!stocktaker) continue;
      await this.filterDetails({ stocktaker, result: 'PENDING' });
      const mine = (await this.listedDetails())[0];
      if (mine) return { faveNo, costCentre, asset: mine.asset, stocktaker, needsAssignment: false };
      // Drop the Stocktaker filter: reload the page, which resets every filter (and the cost centre).
      await this.page.reload();
      await expect(this.page.locator('#tbsummary_info')).toHaveText(/Showing/, { timeout: 30_000 });
      await this.selectCostCentre(costCentre);
      await this.filterDetails({ result: 'PENDING' });
      const free = (await this.listedDetails()).find((d) => d.stocktaker === '' || d.stocktaker === '-');
      if (free) return { faveNo, costCentre, asset: free.asset, stocktaker, needsAssignment: true };
    }
    return undefined;
  }

  /** Open the FAVE on one cost centre (Details tab) and search an asset. */
  async openAsset(costCentre: string, assetId: string): Promise<void> {
    await this.openCurrent();
    await this.selectCostCentre(costCentre);
    await this.searchDetails(assetId);
  }

  /**
   * Select exactly one row. The checkbox state is not reliable (it can show ticked while nothing is
   * selected), so go by the table's counter ("Showing 1 to 1 of 1 records" + "1 row selected").
   */
  private async tick(row: Locator, info: Locator): Promise<void> {
    const oneRow = /records\s*1 row selected/;
    await expect(async () => {
      if (!oneRow.test(await info.innerText())) await row.getByRole('checkbox').click();
      await expect(info).toContainText(oneRow, { timeout: 5_000 });
    }).toPass({ timeout: 30_000 });
  }

  /** Assign a stocktaker to one asset (Assignment tab). Returns the result message. */
  async assignStocktaker(assetId: string, stocktaker: string): Promise<string> {
    await this.openAssignment();
    await this.assignPane.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill(assetId);
    await this.reloadsTable('#tbassign', () => this.assignPane.getByRole('button', { name: 'Search', exact: true }).click());
    const row = this.assignRows.filter({ hasText: `Asset ID: ${assetId}` });
    await expect(row).toHaveCount(1);
    await this.tick(row, this.assignInfo);
    await this.assignPane.getByRole('button', { name: 'Assign Stocktaker', exact: true }).click();
    await expect(this.assignModal).toBeVisible();
    await this.pickSelect2(this.assignModal, 'userStocktakerDropdown', stocktaker);
    await this.assignModal.getByRole('button', { name: 'Submit', exact: true }).click();
    await this.confirm(/^Please confirm/);
    return this.acknowledge(/assigned/);
  }

  /** Tick the asset in Details (search it first) and open Update Result; one asset pre-loads its values. */
  async openUpdateResult(assetId: string): Promise<void> {
    await this.tick(this.detailRow(assetId), this.detailInfo);
    await this.detailPane.getByRole('button', { name: 'Update Result', exact: true }).click();
    await expect(this.resultModal).toBeVisible();
  }

  private selectedIn(selectKey: string): Locator {
    return this.resultModal.locator(`[id^="select2-${selectKey}-"][id$="-container"]`);
  }

  /** Values of the open Update Result dialog. */
  async readResult(): Promise<FaveResult> {
    const text = async (l: Locator) => ((await l.innerText()) || '').trim();
    await expect(this.selectedIn('SightedResult')).not.toHaveText(/Sighted Result Status/, { timeout: 15_000 });
    return {
      sighted: await text(this.selectedIn('SightedResult')),
      condition: await text(this.selectedIn('AssetCondition')),
      followUp: await text(this.selectedIn('UnitFollowUp')),
      remarks: await this.resultModal.locator('textarea[name="Remarks"]').inputValue(),
      fssc: await this.resultModal.locator('input[name="FSSCOutcome"]').inputValue(),
      faveStatus: await this.resultModal.locator('input[name="FAVEStatus"]').inputValue(),
      locationStatus: await this.resultModal.locator('input[name="LocationStatus"]').inputValue(),
      correctLocation: await this.resultModal.getByRole('checkbox', { name: /Correct Location/ }).isChecked(),
    };
  }

  /** In the open Update Result dialog: Sighted Result PENDING (clears the rest), Submit, Ok. Returns the message. */
  async submitPending(): Promise<string> {
    await this.pickSelect2(this.resultModal, 'SightedResult', 'PENDING');
    await this.resultModal.getByRole('button', { name: 'Submit', exact: true }).click();
    return this.acknowledge(/updated/);
  }

  /** Cleanup: set the asset's result back to PENDING if it is not. Returns true when it changed something. */
  async ensurePending(costCentre: string, assetId: string): Promise<boolean> {
    await this.openAsset(costCentre, assetId);
    if (/^\s*PENDING\b/.test(await this.resultOf(assetId).innerText())) return false;
    await this.openUpdateResult(assetId);
    await this.submitPending();
    return true;
  }
}
