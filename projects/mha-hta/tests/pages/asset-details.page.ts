import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Asset details (/Asset/AssetForm?assetId=<encrypted id>), opened from Asset Listing.
 * Header fields (Asset ID, Asset Status, Serial No, ...) and tabs Main Data, Location, Ownership,
 * Loan, Maintenance, Retirement (+ Status). Fields are label/value div pairs.
 *
 * Two pencil buttons (icon-only labels without names, so they are found by the dialog they open):
 * - Edit Picture (#modal_upload): 5 photo slots in a slider; a slot holding a photo is an <img data-def>
 *   with the photo id, an empty slot a placeholder. Empty slot + file + Upload adds a photo (.png/.jpg/.jpeg
 *   under 3 MB); picking a photo offers Update / Delete (Delete has no confirmation). A sensitive asset gets
 *   no Upload button.
 * - Edit asset (#modal_update): Tag Type, Asset Sensitivity (Yes checkbox), Sensitivity Remarks (max 200,
 *   read-only while Yes is unticked). Submit saves without a message.
 */
export class AssetDetailsPage extends BasePage {
  static readonly TABS = ['Main Data', 'Location', 'Ownership', 'Loan', 'Maintenance', 'Retirement'] as const;
  static readonly MAX_PHOTOS = 5;

  readonly breadcrumb: Locator;
  readonly activePanel: Locator;
  /** Location tab, "Asset Location" card (the tab also has a "Cost Centre Location" card with its own Postal Code). */
  readonly assetLocation: Locator;
  readonly editPictureButton: Locator;
  readonly pictureDialog: Locator;
  readonly pictureFile: Locator;
  readonly photos: Locator;
  readonly emptySlots: Locator;
  readonly uploadButton: Locator;
  readonly deletePhotoButton: Locator;
  readonly pictureRequired: Locator;
  readonly editAssetButton: Locator;
  readonly editAssetDialog: Locator;
  readonly sensitiveYes: Locator;
  readonly sensitivityRemarks: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumb = page.locator('.breadcrumb');
    this.activePanel = page.locator('.tab-content .tab-pane.active');
    this.assetLocation = this.activePanel.locator('.card').filter({ has: page.getByRole('heading', { name: 'Asset Location', exact: true }) });
    this.editPictureButton = page.locator('label[data-bs-target="#modal_upload"]');
    this.pictureDialog = page.locator('#modal_upload');
    this.pictureFile = this.pictureDialog.locator('input[type="file"][name="Image"]');
    this.photos = this.pictureDialog.locator('img[data-def]');
    this.emptySlots = this.pictureDialog.locator('.tns-item').filter({ has: page.locator('img[alt="placeholder"]') });
    this.uploadButton = this.pictureDialog.getByRole('button', { name: 'Upload', exact: true });
    this.deletePhotoButton = this.pictureDialog.getByRole('button', { name: 'Delete', exact: true });
    this.pictureRequired = this.pictureDialog.getByText('Picture file is required', { exact: true });
    this.editAssetButton = page.locator('label[data-bs-target="#modal_update"]');
    this.editAssetDialog = page.locator('#modal_update');
    this.sensitiveYes = this.editAssetDialog.getByRole('checkbox', { name: 'Yes' });
    this.sensitivityRemarks = this.editAssetDialog.locator('textarea[name="SensitiveRemarks"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Asset\/AssetForm\?assetId=/);
    await expect(this.breadcrumb).toContainText('Details');
    await expect(this.field('Asset ID')).toBeVisible();
  }

  /**
   * Value next to a field label, e.g. field('Asset Status') -> "AVAILABLE". Searches the whole page
   * (header and the open tab); pass `scope` to look inside one tab panel.
   * The label and value are sibling divs without ids or roles, hence the XPath sibling step.
   */
  field(label: string, scope: Locator | Page = this.page): Locator {
    return scope
      .getByText(label, { exact: true })
      .filter({ visible: true })
      .first()
      .locator('xpath=following-sibling::*[1]');
  }

  tab(name: string): Locator {
    return this.page.getByRole('tab', { name, exact: true });
  }

  async openTab(name: string): Promise<void> {
    await this.tab(name).click();
    await expect(this.tab(name)).toHaveAttribute('aria-selected', 'true');
  }

  /** Reload the details page (after a photo or asset change) and wait for the header. */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.expectLoaded();
  }

  /** Location tab: the asset's own location (Asset Location card), e.g. { level: '1', roomNo: 'NA', ... }. */
  async readAssetLocation(): Promise<{ postalCode: string; block: string; level: string; roomNo: string; remarks: string }> {
    await this.openTab('Location');
    const read = async (label: string) => (await this.field(label, this.assetLocation).innerText()).trim();
    return {
      postalCode: await read('Postal Code'),
      block: await read('Block'),
      level: await read('Level'),
      roomNo: await read('Room No'),
      remarks: await read('Remarks'),
    };
  }

  /** True when Main Data says Asset Sensitivity "Yes". */
  async isSensitive(): Promise<boolean> {
    await this.openTab('Main Data');
    return (await this.field('Asset Sensitivity', this.activePanel).innerText()).trim() === 'Yes';
  }

  /** Open Edit Picture and wait for its slider (5 slots, photos first). */
  async openPictures(): Promise<void> {
    await this.editPictureButton.click();
    await expect(this.pictureDialog).toBeVisible();
    await expect(this.pictureDialog.locator('.tns-item')).toHaveCount(AssetDetailsPage.MAX_PHOTOS);
  }

  async closePictures(): Promise<void> {
    await this.pictureDialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(this.pictureDialog).toBeHidden();
  }

  /** Ids of the asset's photos (open Edit Picture first). */
  async photoIds(): Promise<string[]> {
    return (await this.photos.evaluateAll((imgs) => imgs.map((i) => i.id))).filter(Boolean);
  }

  /** Pick an empty slot, choose the file and Upload. Returns the message. */
  async uploadPhoto(file: string): Promise<string> {
    await this.emptySlots.first().click();
    await this.pictureFile.setInputFiles(file);
    await this.uploadButton.click();
    return this.acknowledge(/Uploaded successfully/);
  }

  /** Select a photo by id and Delete it (no confirmation). Returns the message. */
  async deletePhoto(photoId: string): Promise<string> {
    await this.pictureDialog.locator(`img[data-def][id="${photoId}"]`).click();
    await this.deletePhotoButton.click();
    return this.acknowledge(/Deleted successfully/);
  }

  /**
   * Edit asset: set Asset Sensitivity (and its remarks when Yes), Submit, reload. The dialog shows no
   * message, so success is checked on the reloaded page by the caller.
   */
  async setSensitivity(sensitive: boolean, remarks?: string): Promise<void> {
    await this.editAssetButton.click();
    await expect(this.editAssetDialog).toBeVisible();
    await this.sensitiveYes.setChecked(sensitive);
    if (sensitive && remarks !== undefined) await this.sensitivityRemarks.fill(remarks);
    await this.editAssetDialog.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(this.editAssetDialog).toBeHidden();
    await this.reload();
  }
}
