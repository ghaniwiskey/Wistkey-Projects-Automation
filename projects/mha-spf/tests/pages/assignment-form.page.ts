import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type TransactionStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

/**
 * Assignment transaction details (/Asset/AssignmentForm?assetAssId=...), opened with the pencil icon.
 * SUBMITTED transactions show Cancel (owner) and Approve / Reject (approver). Cancel and Reject open
 * a modal (#modal_cancel / #modal_reject) with a select2 Reason; "Others" needs Remarks.
 */
export class AssignmentFormPage extends BasePage {
  readonly heading: Locator;
  readonly status: Locator;
  readonly approveButton: Locator;
  readonly rejectButton: Locator;
  readonly cancelButton: Locator;
  readonly cancelModal: Locator;
  readonly rejectModal: Locator;
  /** Main content (details, approval trail with Rejected By / reason, asset table). */
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^Assignment #ASG\d+$/, level: 1 });
    this.status = page.getByText(/^(SUBMITTED|APPROVED|REJECTED|CANCELLED)$/).filter({ visible: true }).first();
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
    this.rejectButton = page.getByRole('button', { name: 'Reject', exact: true });
    // The header Cancel comes first in the DOM; the modals have their own Cancel buttons.
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true }).first();
    this.cancelModal = page.locator('#modal_cancel');
    this.rejectModal = page.locator('#modal_reject');
    this.content = page.locator('#kt_content');
  }

  async expectLoaded(transactionNo: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/AssignmentForm\?assetAssId=/);
    await expect(this.page.getByRole('heading', { name: `Assignment #${transactionNo}`, level: 1 })).toBeVisible();
  }

  modalRemarks(modal: Locator): Locator {
    return modal.locator('textarea[name="ReasonRemarks"]');
  }

  modalSubmit(modal: Locator): Locator {
    return modal.getByRole('button', { name: 'Submit', exact: true });
  }

  async approve(): Promise<string> {
    await this.approveButton.click();
    await this.confirm(/Are you sure to approve/);
    return this.acknowledge(/approved/);
  }

  async reject(reason: string, remarks?: string): Promise<string> {
    await this.rejectButton.click();
    await this.fillReason(this.rejectModal, reason, remarks);
    await this.modalSubmit(this.rejectModal).click();
    await this.confirm(/Are you sure to reject/);
    return this.acknowledge(/rejected/);
  }

  /** Open the Cancel modal and pick a reason (does not submit). */
  async startCancel(reason: string): Promise<void> {
    await this.cancelButton.click();
    await expect(this.cancelModal).toBeVisible();
    await this.pickSelect2(this.cancelModal, 'Reason', reason);
  }

  async cancel(reason: string, remarks?: string): Promise<string> {
    await this.startCancel(reason);
    if (remarks !== undefined) await this.modalRemarks(this.cancelModal).fill(remarks);
    await this.modalSubmit(this.cancelModal).click();
    await this.confirm(/Are you sure to cancel/);
    return this.acknowledge(/cancelled/);
  }

  private async fillReason(modal: Locator, reason: string, remarks?: string): Promise<void> {
    await expect(modal).toBeVisible();
    await this.pickSelect2(modal, 'Reason', reason);
    if (remarks !== undefined) await this.modalRemarks(modal).fill(remarks);
  }
}
