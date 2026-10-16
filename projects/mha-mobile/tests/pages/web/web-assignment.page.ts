import { Page, Locator, expect } from '@playwright/test';
import { WebBasePage } from './web-base.page';

/** One row of Asset > Assignment. */
export type AssignmentRow = { no: string; costCentre: string; type: string; createdBy: string; approverRole: string; createdOn: string; status: string };

/** The new location of a RELOCATE transaction, as its details page shows it ("-" for an empty field). */
export type AssignmentLocation = { group: string; postalCode: string; block: string; level: string; roomNo: string; remarks: string };

/**
 * MHA web Asset > Assignment (/Asset/Assignment): transactions newest first (#tblist: Transaction No.,
 * Cost Centre, Transaction Type, Created By, Approver Role, Create Date (server time, SGT), Status,
 * Actions), keyword search (Transaction No / Asset ID / Asset ID2 / Serial No, applied on Search).
 * Relocations and LOGS1 > FALO assignments are auto-approved (Approver Role "-", Status APPROVED); a FALO
 * return waits for Logistics Officer 1, a LOGS1 > LOGS1 recall for Unit Resource Officer. Details
 * (/Asset/AssignmentForm): Approve / Reject (#modal_reject: select2 Reason + Remarks) with a "Are you sure
 * to ...?" confirmation; RELOCATE shows an "Asset Location" card. Slim version of mha-spf's AssignmentPage
 * and AssignmentFormPage.
 */
export class WebAssignmentPage extends WebBasePage {
  static readonly path = 'Asset/Assignment';

  readonly rows: Locator;
  readonly info: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly detailHeading: Locator;
  readonly detailStatus: Locator;
  readonly approveButton: Locator;
  readonly rejectButton: Locator;
  readonly rejectModal: Locator;
  readonly assetLocation: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    this.searchInput = page.getByPlaceholder('Transaction No/Asset ID/Asset ID2/Serial No');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.detailHeading = page.getByRole('heading', { name: /^Assignment #ASG\d+$/, level: 1 });
    this.detailStatus = page.getByText(/^(SUBMITTED|APPROVED|REJECTED|CANCELLED)$/).filter({ visible: true }).first();
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
    this.rejectButton = page.getByRole('button', { name: 'Reject', exact: true });
    this.rejectModal = page.locator('#modal_reject');
    this.assetLocation = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Asset Location', exact: true }) });
  }

  async goto(): Promise<void> {
    await this.navigate(WebAssignmentPage.path);
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  private async readRows(count: number): Promise<AssignmentRow[]> {
    if ((await this.tableTotal(this.info)) === 0) return [];
    const out: AssignmentRow[] = [];
    for (const row of (await this.rows.all()).slice(0, count)) {
      const c = (await row.locator('td').allInnerTexts()).map((t) => t.trim());
      out.push({ no: c[0], costCentre: c[1], type: c[2], createdBy: c[3], approverRole: c[4], createdOn: c[5], status: c[6] });
    }
    return out;
  }

  /** The newest transactions (first list page), read from their cells. */
  async newest(count = 5): Promise<AssignmentRow[]> {
    await this.goto();
    return this.readRows(count);
  }

  /** The newest transaction of an asset (keyword search by Asset ID), or undefined when it has none. */
  async newestFor(assetId: string): Promise<AssignmentRow | undefined> {
    await this.goto();
    await this.searchInput.fill(assetId);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
    return (await this.readRows(1))[0];
  }

  /** Open a transaction's details from the list (pencil in the Actions column). */
  async open(transactionNo: string): Promise<void> {
    await this.goto();
    await this.searchInput.fill(transactionNo);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
    const row = this.rows.filter({ hasText: transactionNo });
    await expect(row).toHaveCount(1);
    await row.locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Asset\/AssignmentForm\?assetAssId=/);
    await expect(this.page.getByRole('heading', { name: `Assignment #${transactionNo}`, level: 1 })).toBeVisible();
  }

  /** Approve the open transaction; returns the message ("Assignment has been approved"). */
  async approve(): Promise<string> {
    await this.approveButton.click();
    await this.confirm(/Are you sure to approve/);
    return this.acknowledge(/approved/);
  }

  /** Reject the open transaction with a reason (e.g. Others) and remarks; returns the message. */
  async reject(reason: string, remarks: string): Promise<string> {
    await this.rejectButton.click();
    await expect(this.rejectModal).toBeVisible();
    await this.pickSelect2(this.rejectModal, 'Reason', reason);
    await this.rejectModal.locator('textarea[name="ReasonRemarks"]').fill(remarks);
    await this.rejectModal.getByRole('button', { name: 'Submit', exact: true }).click();
    await this.confirm(/Are you sure to reject/);
    return this.acknowledge(/rejected/);
  }

  /** Value next to a label cell ("Room No.:") in a details card; label and value are sibling <td>s. */
  private value(label: string, scope: Locator): Locator {
    return scope.getByRole('cell', { name: label, exact: true }).first().locator('xpath=following-sibling::td[1]');
  }

  /** The "Asset Location" card of the open RELOCATE transaction. */
  async readNewLocation(): Promise<AssignmentLocation> {
    await expect(this.assetLocation).toBeVisible();
    const read = async (label: string) => (await this.value(label, this.assetLocation).innerText()).trim();
    return {
      group: await read('Group / NPC / Base:'),
      postalCode: await read('Postal Code:'),
      block: await read('Block:'),
      level: await read('Level:'),
      roomNo: await read('Room No.:'),
      remarks: await read('Remarks:'),
    };
  }
}
