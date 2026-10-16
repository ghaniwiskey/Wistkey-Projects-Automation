import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';

export type NewAssetReport = {
  condition: 'WORKING' | 'NOT WORKING' | 'NOT IN USE/OBSOLETE';
  description: string;
  remarks: string;
  postalCode: string;
  /** Address to pick in "Select Address:-" (as MHA web shows it, e.g. "35 AIRPORT BOULEVARD ... 819645"). */
  address: string;
  level: string;
  locationRemarks: string;
};

/**
 * Report New Asset (home tile): Asset Condition*, Estimated Asset Age, Estimated Capitalisation Value,
 * Asset No., Serial Number, Description, Remarks*, Asset Location* (postal code: 4 digits open
 * "Select Address:-", a list of addresses containing those digits; picking one asks "Your Selected Address
 * is" > OK and fills building and address), Block, Level, Room, location Remarks*, Upload Photo* (Take
 * Photo / Upload Image through Android's photo picker, 3 MB limit), SAVE. The cost centre is the active one.
 * Validation and success are toasts ("Please select asset condition", "Please upload photo"); a saved
 * report returns to the home screen. A tiny image (85-byte PNG) is dropped without a message.
 */
export class NewAssetScreen extends AppScreen {
  readonly heading: Locator;
  readonly conditionSpinner: Locator;
  readonly description: Locator;
  readonly remarks: Locator;
  readonly postalCode: Locator;
  readonly level: Locator;
  readonly locationRemarks: Locator;
  readonly uploadImageButton: Locator;
  readonly photoPreview: Locator;
  readonly changeImage: Locator;
  readonly saveButton: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.heading = screen.getByText('Report New Asset', { exact: true });
    this.conditionSpinner = this.id('asset_condition_spinner');
    this.description = this.id('asset_description');
    this.remarks = this.id('asset_remarks');
    this.postalCode = this.id('asset_location_postalcode');
    this.level = this.id('asset_location_level');
    this.locationRemarks = this.id('asset_location_remarks');
    this.uploadImageButton = this.id('upload_image_btn');
    this.photoPreview = this.id('holderImg');
    this.changeImage = this.id('changeImg_btn');
    this.saveButton = this.id('save_button');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
    await expect(this.saveButton).toBeVisible();
  }

  async save(): Promise<void> {
    await this.saveButton.tap();
  }

  private async type(field: Locator, text: string): Promise<void> {
    await field.scrollIntoViewIfNeeded();
    await field.fill(text);
    await this.hideKeyboard();
  }

  /** Type the postal code, pick the address in the dialog and confirm it. */
  async pickAddress(postalCode: string, address: string): Promise<void> {
    await this.postalCode.scrollIntoViewIfNeeded();
    // The dialog opens after the 4th digit and lists every address containing them.
    await this.postalCode.fill(postalCode.slice(0, 4));
    await expect(this.screen.getByText('Select Address:-', { exact: true })).toBeVisible({ timeout: 30_000 });
    const row = this.screen.getByText(address, { exact: true });
    await row.scrollIntoViewIfNeeded({ maxSwipes: 30 });
    await row.tap();
    await expect(this.screen.getByText('Your Selected Address is', { exact: true })).toBeVisible();
    await this.alertOk.tap();
    await expect(this.postalCode).toHaveText(postalCode, { timeout: 15_000 });
  }

  /** Upload Image > the newest photo in the picker > Done; waits for the preview. */
  async uploadNewestPhoto(): Promise<void> {
    await this.uploadImageButton.scrollIntoViewIfNeeded();
    await this.uploadImageButton.tap();
    // Android's photo picker: tiles labelled "Photo taken on <date>", newest first; multi-select with Done.
    const firstPhoto = this.screen.getByLabel('Photo taken on', { exact: false }).first();
    await firstPhoto.tap();
    await this.screen.getByText('Done', { exact: true }).tap();
    // The preview and "Change Image" sit at the bottom of the form, under the SAVE bar.
    await this.changeImage.scrollIntoViewIfNeeded();
    await expect(this.photoPreview).toBeVisible({ timeout: 30_000 });
  }

  /** Fill the whole form (no SAVE). */
  async fill(r: NewAssetReport): Promise<void> {
    await this.conditionSpinner.scrollIntoViewIfNeeded();
    await this.pick(this.conditionSpinner, r.condition);
    await this.type(this.description, r.description);
    await this.type(this.remarks, r.remarks);
    await this.pickAddress(r.postalCode, r.address);
    await this.type(this.level, r.level);
    await this.type(this.locationRemarks, r.locationRemarks);
  }
}
