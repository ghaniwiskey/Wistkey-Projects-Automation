import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type AssignmentType = 'Assign' | 'Relocate' | 'Assign & Relocate';

/** Radio ids of the Start step; the radios are hidden `btn-check` inputs styled through their labels. */
const TYPE_IDS: Record<AssignmentType, string> = {
  Assign: 'ass_type_ass',
  Relocate: 'ass_type_move',
  'Assign & Relocate': 'ass_type_assmove',
};

/**
 * Create assignment wizard (/Asset/AssignmentCreate), a KTStepper:
 * Start (type) > Asset (choose, #tblist) > Review (#tbreview) > Assign and/or Location (#pnlMove) > End.
 * Next/Back/Submit are shared buttons at the bottom of the form; Submit is the write step.
 */
export class AssignmentCreatePage extends BasePage {
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly selectedCount: Locator;
  readonly assetRows: Locator;
  readonly reviewRows: Locator;
  readonly locationPanel: Locator;
  readonly locationGroup: Locator;
  readonly locationPostalCode: Locator;

  constructor(page: Page) {
    super(page);
    this.nextButton = page.getByRole('button', { name: 'Next', exact: true });
    this.backButton = page.getByRole('button', { name: 'Back', exact: true });
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
    this.searchInput = page.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.selectedCount = page.getByRole('heading', { name: /asset\(s\) selected/ });
    this.assetRows = page.locator('#tblist tbody tr');
    this.reviewRows = page.locator('#tbreview tbody tr');
    // Location step panel and its select2 values (rendered spans; no labels tie them to the inputs).
    this.locationPanel = page.locator('#pnlMove');
    this.locationGroup = this.locationPanel.locator('#select2-subLocList-container');
    this.locationPostalCode = this.locationPanel.locator('[id^="select2-PostalCode"][id$="-container"]');
  }

  /** Step heading such as "Relocate - Choose Asset" (whitespace in the markup is normalised). */
  stepHeading(text: string | RegExp): Locator {
    return this.page.getByRole('heading', { name: text });
  }

  typeRadio(type: AssignmentType): Locator {
    return this.page.getByRole('radio', { name: type, exact: true });
  }

  async expectStart(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/AssignmentCreate/);
    await expect(this.stepHeading('Assign - Start')).toBeVisible();
  }

  /** The clickable card of a type (the label covers the hidden radio). */
  typeCard(type: AssignmentType): Locator {
    return this.page.locator(`label[for="${TYPE_IDS[type]}"]`);
  }

  async chooseType(type: AssignmentType): Promise<void> {
    await this.typeCard(type).click();
    await expect(this.typeRadio(type)).toBeChecked();
    await this.reloadsTable('#tblist', () => this.nextButton.click());
    await expect(this.stepHeading(`${type} - Choose Asset`)).toBeVisible();
  }

  async searchAsset(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  /** Tick an asset in the Choose Asset table (the app tracks the selection, not the checkbox state). */
  async selectAsset(assetId: string): Promise<void> {
    await this.assetRows.filter({ hasText: `Asset ID: ${assetId}` }).getByRole('checkbox').click();
  }

  async next(): Promise<void> {
    await this.nextButton.click();
  }
}
