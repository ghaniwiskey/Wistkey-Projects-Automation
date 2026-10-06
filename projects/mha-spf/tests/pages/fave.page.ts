import { Page, Locator, expect } from '@playwright/test';
import { AssetCondition, SightedResult, StocktakeFormPage } from './stocktake-form.page';

/**
 * Stocktake > FAVE. List (/Stocktake/Fave, #tblist: FAVE No., Create Date, pencil) and details
 * (/Stocktake/FaveForm?stktakeFAVEId=...): a cost-centre table (#tbcostcenter, first row selected on
 * load) above the shared Summary / Details / Assignment tabs. Picking a cost centre reloads all three
 * tables. The Summary tab holds the approval panel (VET IC > URO > UAO) and the FAVE Submit button.
 *
 * Update Result (VET IC, or URO after submission): Sighted Result and Asset Condition fill HTD Follow-up,
 * FSSC Outcome, FAVE Status and Location Status (FSSC mapping); PENDING clears them. Assigning a stocktaker
 * asks "Please confirm ..." first. Ok after either keeps the page and redraws the table.
 */
export class FavePage extends StocktakeFormPage {
  static readonly path = 'Stocktake/Fave';
  protected readonly stocktakerKey = 'userStocktakerDropdown';

  readonly listHeading: Locator;
  readonly faveRows: Locator;
  readonly listInfo: Locator;
  readonly costCentreRows: Locator;
  readonly submitFaveButton: Locator;
  readonly assetCondition: Locator;
  readonly followUp: Locator;
  readonly fsscOutcome: Locator;
  readonly faveStatus: Locator;
  readonly correctLocation: Locator;
  readonly locationStatus: Locator;

  constructor(page: Page) {
    super(page);
    this.listHeading = page.getByRole('heading', { name: 'FAVE', level: 1 });
    this.faveRows = page.locator('#tblist tbody tr');
    this.listInfo = page.locator('#tblist_info');
    this.costCentreRows = page.locator('#tbcostcenter tbody tr');
    this.submitFaveButton = this.summaryPane.getByRole('button', { name: 'Submit', exact: true });
    this.assetCondition = this.selectedIn(this.resultModal, 'AssetCondition');
    this.followUp = this.selectedIn(this.resultModal, 'UnitFollowUp');
    this.fsscOutcome = this.resultModal.locator('input[name="FSSCOutcome"]');
    this.faveStatus = this.resultModal.locator('input[name="FAVEStatus"]');
    this.correctLocation = this.resultModal.getByRole('checkbox', { name: /Correct Location/ });
    this.locationStatus = this.resultModal.locator('input[name="LocationStatus"]');
  }

  async gotoList(): Promise<void> {
    await this.navigate(FavePage.path);
    await expect(this.listHeading).toBeVisible();
    await expect(this.listInfo).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  /** FAVE numbers on the first list page, newest first (e.g. "FAVE FY26-2007"). */
  async faveNumbers(): Promise<string[]> {
    return (await this.faveRows.locator('td:first-child').allInnerTexts()).map((t) => t.trim());
  }

  /** Open the first FAVE in the list (the current one) and return its number. */
  async openFirst(): Promise<string> {
    await this.gotoList();
    const [faveNo] = await this.faveNumbers();
    await this.faveRows.first().locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Stocktake\/FaveForm\?stktakeFAVEId=/);
    await this.expectLoaded();
    await expect(this.title).toContainText(`Stocktake FAVE #${faveNo}`);
    return faveNo;
  }

  costCentreRow(code: string): Locator {
    return this.costCentreRows.filter({ has: this.page.locator('td:first-child', { hasText: code }) });
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

  /** Open the current FAVE on one cost centre. Returns the FAVE number. */
  async openForCostCentre(code: string): Promise<string> {
    const faveNo = await this.openFirst();
    await this.selectCostCentre(code);
    return faveNo;
  }

  /** One stage of the Summary approval panel (Verification Team IC/2IC, Unit Resource Officer, Unit Approving Officer). */
  approvalStage(role: string): Locator {
    return this.summaryPane.getByText(role, { exact: true });
  }

  /** Columns of a Details row: 6 Result & Condition, 7 HTD Follow-up, 8 FSSC Outcome. */
  resultOf(assetId: string): Locator {
    return this.detailRow(assetId).locator('td').nth(6);
  }

  followUpOf(assetId: string): Locator {
    return this.detailRow(assetId).locator('td').nth(7);
  }

  fsscOf(assetId: string): Locator {
    return this.detailRow(assetId).locator('td').nth(8);
  }

  /** Fill the open Update Result dialog (no Submit). Condition and remarks are skipped for PENDING. */
  async fillResult(r: { sighted: SightedResult; condition?: AssetCondition; remarks?: string }): Promise<void> {
    await this.pickSightedResult(r.sighted);
    if (r.condition) {
      await this.pickSelect2(this.resultModal, 'AssetCondition', r.condition);
      await expect(this.assetCondition).toHaveText(r.condition);
    }
    if (r.remarks !== undefined) await this.remarks.fill(r.remarks);
  }

  /** Cleanup: set the asset's result back to PENDING if a test left it otherwise. */
  async ensurePending(costCentre: string, assetId: string): Promise<boolean> {
    await this.openForCostCentre(costCentre);
    await this.searchDetails(assetId);
    if (/^\s*PENDING\b/.test(await this.resultOf(assetId).innerText())) return false;
    await this.openUpdateResult(assetId);
    await this.fillResult({ sighted: 'PENDING' });
    await this.submitResult();
    return true;
  }
}
