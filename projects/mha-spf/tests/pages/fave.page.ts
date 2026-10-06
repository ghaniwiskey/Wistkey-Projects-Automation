import { Page, Locator, Download, expect } from '@playwright/test';
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
 *
 * Approval (Summary tab, per cost centre): VET IC Submit > URO Submit/Reject > UAO Approve/Reject.
 * There is no HQ AO on SPF, so UAO approval is final (APPROVED, read-only for everyone). A reject
 * returns the FAVE one level down. Each stage card in #pnlStatus shows the role, a
 * status badge, officer, time and "Remarks: ..."; a card keeps its last status until that level acts
 * again. The cost centre row shows the last action (Status, Role).
 */
export type FaveStage = 'Verification Team IC/2IC' | 'Unit Resource Officer' | 'Unit Approving Officer';

/** New Asset Location typed in Update Result (field limits: Block 10, Level 3, Room No 5, Remarks 200). */
export type FaveNewLocation = { block?: string; level?: string; roomNo?: string; remarks?: string };

export class FavePage extends StocktakeFormPage {
  static readonly path = 'Stocktake/Fave';
  protected readonly stocktakerKey = 'userStocktakerDropdown';

  readonly listHeading: Locator;
  readonly faveRows: Locator;
  readonly listInfo: Locator;
  readonly costCentreRows: Locator;
  readonly submitFaveButton: Locator;
  readonly approveButton: Locator;
  readonly rejectButton: Locator;
  readonly rejectModal: Locator;
  readonly rejectRemarks: Locator;
  readonly reasonRequired: Locator;
  readonly remarksRequired: Locator;
  readonly assetCondition: Locator;
  readonly followUp: Locator;
  readonly fsscOutcome: Locator;
  readonly faveStatus: Locator;
  readonly correctLocation: Locator;
  readonly locationStatus: Locator;
  readonly importButton: Locator;
  readonly importDialog: Locator;
  readonly importRows: Locator;
  readonly importTemplateButton: Locator;
  readonly newLocationHeading: Locator;
  readonly newBuilding: Locator;
  readonly newBlock: Locator;
  readonly newLevel: Locator;
  readonly newRoomNo: Locator;
  readonly newLocationRemarks: Locator;

  constructor(page: Page) {
    super(page);
    this.listHeading = page.getByRole('heading', { name: 'FAVE', level: 1 });
    this.faveRows = page.locator('#tblist tbody tr');
    this.listInfo = page.locator('#tblist_info');
    this.costCentreRows = page.locator('#tbcostcenter tbody tr');
    this.submitFaveButton = this.summaryPane.getByRole('button', { name: 'Submit', exact: true });
    this.approveButton = this.summaryPane.getByRole('button', { name: 'Approve', exact: true });
    this.rejectButton = this.summaryPane.getByRole('button', { name: 'Reject', exact: true });
    this.rejectModal = page.locator('#modal_reject');
    this.rejectRemarks = this.rejectModal.locator('textarea[name="ReasonRemarks"]');
    this.reasonRequired = this.rejectModal.getByText('Reason is required', { exact: true });
    this.remarksRequired = this.rejectModal.getByText('Remarks is required', { exact: true });
    this.assetCondition = this.selectedIn(this.resultModal, 'AssetCondition');
    this.followUp = this.selectedIn(this.resultModal, 'UnitFollowUp');
    this.fsscOutcome = this.resultModal.locator('input[name="FSSCOutcome"]');
    this.faveStatus = this.resultModal.locator('input[name="FAVEStatus"]');
    this.correctLocation = this.resultModal.getByRole('checkbox', { name: /Correct Location/ });
    this.locationStatus = this.resultModal.locator('input[name="LocationStatus"]');
    // Import Working Result (Details tab, VET IC before submitting): dialog with a Dropzone upload,
    // a preview table of the uploaded asset IDs and the Import button.
    this.importButton = page.locator('#detail_tab').getByRole('button', { name: 'Import Working Result', exact: true });
    this.importDialog = page.locator('#modal_import');
    this.importRows = page.locator('#tbimport tbody tr');
    this.importTemplateButton = this.importDialog.getByRole('button', { name: 'Import Template', exact: true });
    // New Asset Location (Update Result, SIGHTED with Correct Location unticked). The inputs have <label>s
    // that are not linked to them, so they are found by name.
    this.newLocationHeading = this.resultModal.getByRole('heading', { name: 'New Asset Location' });
    this.newBuilding = this.resultModal.locator('input[name="Building"]');
    this.newBlock = this.resultModal.locator('input[name="Block"]');
    this.newLevel = this.resultModal.locator('input[name="Level"]');
    this.newRoomNo = this.resultModal.locator('input[name="RoomNo"]');
    this.newLocationRemarks = this.resultModal.locator('textarea[name="LocRemarks"]');
  }

  /**
   * Tick or untick "Correct Location?" in the open Update Result dialog. Unticking (with SIGHTED) sets
   * Location Status OPEN and shows the New Asset Location section; the location then goes to the asset's
   * LOGS1 as a RELOCATE assignment transaction (SUBMITTED) when the result is submitted.
   */
  async setCorrectLocation(correct: boolean): Promise<void> {
    await this.correctLocation.setChecked(correct);
    if (!correct) await expect(this.newLocationHeading).toBeVisible();
  }

  /** Pick the first Group / NPC / Base offered in New Asset Location. Returns its name. */
  async pickFirstNewGroup(): Promise<string> {
    // The select has id subLocList (name LocId); its first option is the "Group / NPC / Base" placeholder (value 0).
    const first = this.resultModal.locator('select#subLocList option:not([value="0"]):not([value=""])').first();
    await expect(first).toBeAttached({ timeout: 30_000 });
    const group = ((await first.textContent()) ?? '').trim();
    await this.pickSelect2(this.resultModal, 'subLocList', group);
    return group;
  }

  /** Search a postal code in New Asset Location and pick the first address. Building/Address fill by XHR. */
  async pickNewPostalCode(postalCode: string): Promise<string> {
    const picked = await this.searchSelect2(this.resultModal, 'postalCode', postalCode, this.postalResult(postalCode));
    await expect(this.newBuilding).not.toHaveValue('', { timeout: 30_000 });
    return picked;
  }

  async fillNewLocation(loc: FaveNewLocation): Promise<void> {
    if (loc.block !== undefined) await this.newBlock.fill(loc.block);
    if (loc.level !== undefined) await this.newLevel.fill(loc.level);
    if (loc.roomNo !== undefined) await this.newRoomNo.fill(loc.roomNo);
    if (loc.remarks !== undefined) await this.newLocationRemarks.fill(loc.remarks);
  }

  /** Submit the Update Result dialog when a validation message is expected; returns it. The dialog stays open. */
  async submitResultRejected(message: string | RegExp): Promise<string> {
    await this.resultModal.getByRole('button', { name: 'Submit', exact: true }).click();
    const text = await this.acknowledge(message);
    await expect(this.resultModal).toBeVisible();
    return text;
  }

  /**
   * Details tab filters (they apply on Search): Assignee (LOGS1) and Result. Clears the keyword box.
   * Returns false, without searching, when the LOGS1 is not offered for this unit.
   */
  async filterDetails(f: { logs1: string; result?: SightedResult }): Promise<boolean> {
    await this.openDetails();
    const pane = this.page.locator('#detail_tab');
    const logs1Options = pane.locator('select[name="UserIdLogs1"] option');
    await expect(logs1Options.nth(1)).toBeAttached({ timeout: 30_000 });
    if ((await logs1Options.filter({ hasText: new RegExp(`^\\s*${f.logs1}\\s*$`) }).count()) === 0) return false;
    await this.pickSelect2(pane, 'UserIdLogs1', f.logs1);
    if (f.result) await this.pickSelect2(pane, 'SightedResult2', f.result);
    await pane.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill('');
    await this.reloadsTable('#tbdetail', () => pane.getByRole('button', { name: 'Search', exact: true }).click());
    return true;
  }

  /**
   * First asset of the selected cost centre whose Assignee (LOGS1) is this officer and whose result is still
   * PENDING, or undefined when there is none.
   */
  async firstPendingAssetOf(logs1: string): Promise<string | undefined> {
    if (!(await this.filterDetails({ logs1, result: 'PENDING' }))) return undefined;
    if ((await this.tableTotal(this.page.locator('#tbdetail_info'))) === 0) return undefined;
    return (await this.detailRows.first().innerText()).match(/Asset ID: (\d+)/)?.[1];
  }

  async openImport(): Promise<void> {
    await this.openDetails();
    await this.importButton.click();
    await expect(this.importDialog).toBeVisible();
  }

  /**
   * Choose the Excel file in the open Import dialog. Dropzone keeps its file input outside the dialog
   * (appended to <body>, class dz-hidden-input), so that input is the stable hook.
   */
  async chooseImportFile(file: string): Promise<void> {
    await this.page.locator('input.dz-hidden-input[type="file"]').setInputFiles(file);
  }

  importRow(assetId: string): Locator {
    return this.importRows.filter({ hasText: assetId });
  }

  /** Click Import in the dialog and close the result message. Returns the message. */
  async submitImport(): Promise<string> {
    await this.importDialog.locator('[data-modal-action="import"]').click();
    return this.acknowledge(/import record\(s\)/);
  }

  /** Click Import Template in the open Import dialog and return the download. */
  async downloadImportTemplate(): Promise<Download> {
    const [download] = await Promise.all([this.page.waitForEvent('download', { timeout: 30_000 }), this.importTemplateButton.click()]);
    return download;
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
    // The approval panel and its buttons load by a separate request; let it settle before reading them.
    await this.page.waitForLoadState('networkidle');
    await expect(this.stage('Unit Approving Officer')).toBeVisible();
  }

  /** Status (column 4) and role (column 5) of the last approval action, in the cost centre table. */
  costCentreStatus(code: string): Locator {
    return this.costCentreRow(code).locator('td').nth(3);
  }

  costCentreRole(code: string): Locator {
    return this.costCentreRow(code).locator('td').nth(4);
  }

  /** One card of the approval panel (#pnlStatus). */
  stage(role: FaveStage): Locator {
    return this.page.locator('#pnlStatus .card-body').filter({ has: this.page.getByText(role, { exact: true }) });
  }

  stageStatus(role: FaveStage): Locator {
    return this.stage(role).locator('.badge');
  }

  stageRemarks(role: FaveStage): Locator {
    return this.stage(role).getByText(/^\s*Remarks:/);
  }

  /** Switch to another role and reopen the current FAVE on the cost centre. */
  async reopenAs(roleLabel: string, costCentre: string): Promise<void> {
    await this.switchRole(roleLabel);
    await this.openForCostCentre(costCentre);
  }

  /** Submit (VET IC, URO) or Approve (UAO): confirm, then the result message. Returns [question, message]. */
  async submitFave(): Promise<[string, string]> {
    return this.decide(this.submitFaveButton, /submit this FAVE/, /submitted/);
  }

  async approveFave(): Promise<[string, string]> {
    return this.decide(this.approveButton, /approve this FAVE/, /approved/);
  }

  private async decide(button: Locator, question: RegExp, done: RegExp): Promise<[string, string]> {
    await this.openSummary();
    await button.click();
    await expect(this.alertText).toHaveText(question);
    const asked = (await this.alertText.innerText()).trim();
    await this.confirm(question);
    return [asked, await this.acknowledge(done)];
  }

  async openReject(): Promise<void> {
    await this.openSummary();
    await this.rejectButton.click();
    await expect(this.rejectModal).toBeVisible();
  }

  async submitReject(): Promise<void> {
    await this.rejectModal.getByRole('button', { name: 'Submit', exact: true }).click();
  }

  async pickRejectReason(reason: string): Promise<void> {
    await this.pickSelect2(this.rejectModal, 'Reason', reason);
  }

  /** Reject (URO, UAO) with a reason and remarks: confirm, then the result. Returns [question, message]. */
  async rejectFave(reason: string, remarks: string): Promise<[string, string]> {
    if (!(await this.rejectModal.isVisible())) await this.openReject();
    await this.pickRejectReason(reason);
    await this.rejectRemarks.fill(remarks);
    await this.submitReject();
    await expect(this.alertText).toHaveText(/reject this FAVE/);
    const asked = (await this.alertText.innerText()).trim();
    await this.confirm(/reject this FAVE/);
    return [asked, await this.acknowledge(/rejected/)];
  }

  /** Cost centre codes of the open FAVE, in table order. */
  async costCentreCodes(): Promise<string[]> {
    await expect(this.costCentreRows.first()).toBeVisible();
    return (await this.costCentreRows.locator('td:first-child').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  }

  /** Cost centres of the current FAVE that are not APPROVED yet (approval is final), in table order. */
  async notApprovedCostCentres(): Promise<string[]> {
    await this.openFirst();
    const open: string[] = [];
    for (const code of await this.costCentreCodes()) {
      if ((await this.costCentreStatus(code).innerText()).trim() !== 'APPROVED') open.push(code);
    }
    return open;
  }

  /** First cost centre of the current FAVE that is not APPROVED yet, or undefined when all are. */
  async firstNotApproved(): Promise<string | undefined> {
    return (await this.notApprovedCostCentres())[0];
  }

  /** Asset ID of the first row in the Details table of the selected cost centre. */
  async firstAssetId(): Promise<string> {
    await expect(this.page.locator('#tbdetail_info')).toHaveText(/Showing \d/, { timeout: 30_000 });
    const id = (await this.detailRows.first().innerText()).match(/Asset ID: (\d+)/)?.[1];
    if (!id) throw new Error('No asset in the FAVE details of the selected cost centre');
    return id;
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

  /**
   * A Details cell found by its column header. Column positions change with the approval state (an
   * APPROVED cost centre has no checkbox column), so never count columns.
   */
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

  /** Fill the open Update Result dialog (no Submit). Condition and remarks are skipped for PENDING. */
  async fillResult(r: { sighted: SightedResult; condition?: AssetCondition; followUp?: string; remarks?: string }): Promise<void> {
    await this.pickSightedResult(r.sighted);
    if (r.condition) {
      await this.pickSelect2(this.resultModal, 'AssetCondition', r.condition);
      await expect(this.assetCondition).toHaveText(r.condition);
    }
    if (r.followUp) await this.pickFollowUp(r.followUp);
    if (r.remarks !== undefined) await this.remarks.fill(r.remarks);
  }

  /** HTD Follow-up choices the dialog offers for the current Sighted Result and Asset Condition. */
  async followUpOptions(): Promise<string[]> {
    const options = this.resultModal.locator('select[name="UnitFollowUp"] option:not([value=""])');
    return (await options.allTextContents()).map((t) => t.trim()).filter(Boolean);
  }

  /** Pick an HTD Follow-up (FSSC Outcome follows it). */
  async pickFollowUp(followUp: string): Promise<void> {
    await this.pickSelect2(this.resultModal, 'UnitFollowUp', followUp);
    await expect(this.followUp).toHaveText(followUp);
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
