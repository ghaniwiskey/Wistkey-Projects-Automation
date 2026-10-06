import { Page, Locator, expect } from '@playwright/test';
import { WizardPage } from './wizard.page';

export type AssignmentType = 'Assign' | 'Relocate' | 'Assign & Relocate';

/** Radio ids of the Start step; the radios are hidden `btn-check` inputs styled through their labels. */
const TYPE_IDS: Record<AssignmentType, string> = {
  Assign: 'ass_type_ass',
  Relocate: 'ass_type_move',
  'Assign & Relocate': 'ass_type_assmove',
};

export type NewAssignment = {
  type: AssignmentType;
  assetId: string;
  /** Assign step, e.g. "Fixed Asset Liaison Officer (FALO)" (option text in the Role dropdown). */
  role?: string;
  /** Assign step, officer name, e.g. "Wong Pui Lai Annie". */
  assignee?: string;
  /** Location step: new Remarks (other location fields keep the asset's current values). */
  remarks?: string;
};

/**
 * Create assignment wizard (/Asset/AssignmentCreate):
 * Start (type) > Asset > Review > Assign (#pnlAssign) and/or Location (#pnlMove) > End.
 */
export class AssignmentCreatePage extends WizardPage {
  readonly reviewRows: Locator;
  readonly assignPanel: Locator;
  readonly locationPanel: Locator;
  readonly locationGroup: Locator;
  readonly locationPostalCode: Locator;
  readonly locationRemarks: Locator;

  constructor(page: Page) {
    super(page);
    this.reviewRows = page.locator('#tbreview tbody tr');
    this.assignPanel = page.locator('#pnlAssign').filter({ visible: true });
    // Location step panel and its select2 values (rendered spans; no labels tie them to the inputs).
    this.locationPanel = page.locator('#pnlMove');
    this.locationGroup = this.locationPanel.locator('#select2-subLocList-container');
    this.locationPostalCode = this.locationPanel.locator('[id^="select2-PostalCode"][id$="-container"]');
    this.locationRemarks = this.locationPanel.locator('textarea[name="LocRemarks"]');
  }

  async goto(): Promise<void> {
    await this.navigate('Asset/AssignmentCreate');
    await this.expectStart();
  }

  typeRadio(type: AssignmentType): Locator {
    return this.page.getByRole('radio', { name: type, exact: true });
  }

  /** The clickable card of a type (the label covers the hidden radio). */
  typeCard(type: AssignmentType): Locator {
    return this.radioCard(TYPE_IDS[type]);
  }

  async expectStart(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/AssignmentCreate/);
    await expect(this.stepHeading('Assign - Start')).toBeVisible();
  }

  async chooseType(type: AssignmentType): Promise<void> {
    await this.typeCard(type).click();
    await expect(this.typeRadio(type)).toBeChecked();
    await this.nextToChooseAsset(`${type} - Choose Asset`);
  }

  /**
   * The location step loads the asset's current location by XHR after it opens and then overwrites
   * every field (Building ... Remarks) in one go. Typing before that is lost, so wait for Building.
   */
  async waitForLocationPrefill(): Promise<void> {
    await expect(this.locationPanel).toBeVisible();
    await expect(this.locationPanel.locator('input[name="Building"]')).toHaveValue(/\S/);
  }

  async chooseAssignee(role: string, assignee: string): Promise<void> {
    await this.pickSelect2(this.assignPanel, 'RoleId', role);
    // The assignee list reloads by XHR for the chosen role. An already open select2 keeps the old
    // list, so wait until the officer is in the hidden <select> before opening the dropdown.
    await expect(this.assignPanel.locator('select[name="UserId"] option').filter({ hasText: assignee })).toHaveCount(1);
    await this.pickSelect2(this.assignPanel, 'UserId', assignee);
  }

  /**
   * Run the whole wizard from the Start step and submit. Returns the End-step message and the
   * transaction number from it ("Asset Assignment #ASG00006276 is created and approved.").
   */
  async create(a: NewAssignment): Promise<{ message: string; transactionNo: string }> {
    await this.goto();
    await this.chooseType(a.type);
    await this.pickAsset(a.assetId);
    if (a.type !== 'Relocate') {
      if (!a.role || !a.assignee) throw new Error(`${a.type} needs a role and an assignee`);
      await this.chooseAssignee(a.role, a.assignee);
      if (a.type === 'Assign & Relocate') await this.next();
    }
    if (a.type !== 'Assign' && a.remarks !== undefined) {
      await this.waitForLocationPrefill();
      await this.locationRemarks.fill(a.remarks);
    }
    const message = await this.submit();
    const transactionNo = message.match(/ASG\d+/)?.[0];
    if (!transactionNo) throw new Error(`No transaction number in "${message}"`);
    return { message, transactionNo };
  }
}
