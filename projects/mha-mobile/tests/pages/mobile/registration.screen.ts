import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';

/** The location the Register Asset form shows (empty fields report their hint, e.g. "(Optional)"). */
export type RegistrationForm = { group: string; postalCode: string; block: string; level: string; room: string; remarks: string };

/**
 * Asset Registration (home tile for LOGS1 / FALO): "Register Asset (n)" lists the partially registered
 * (PROGRESS) assets of the active cost centre (Asset ID, description, category, cost centre); tapping one
 * opens the form: Group/NPC/Base*, Asset Location* (postal code, building, address pre-filled from the
 * asset; changing the postal code lists addresses from the 4th digit, like New Asset), Block, Level, Room,
 * Remarks (NOT pre-filled: hint "(Optional)", and saving clears the asset's remarks, BUG-004), Sensitivity
 * switch, Take Photo / Upload Image (up to 5 slots, 3 MB). Save: no postal code toasts "Please input
 * postal code"; success shows the dialog "Success / Registration Success" > OK and the asset leaves the
 * list. Upload Image asks for the camera permission first (once per app start with "Only this time").
 */
export class RegistrationScreen extends AppScreen {
  readonly heading: Locator;
  readonly count: Locator;
  readonly assetIds: Locator;
  readonly empty: Locator;
  readonly groupSpinner: Locator;
  readonly postalCode: Locator;
  readonly block: Locator;
  readonly level: Locator;
  readonly room: Locator;
  readonly remarks: Locator;
  readonly uploadImageButton: Locator;
  readonly firstPhotoSlot: Locator;
  readonly saveButton: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.heading = screen.getByText('Register Asset', { exact: true });
    this.count = this.id('count');
    this.assetIds = this.id('tv_lmsAssetId');
    this.empty = screen.getByText('Nothing to show yet', { exact: true });
    this.groupSpinner = this.id('location_spinner');
    this.postalCode = this.id('asset_location_postalcode');
    this.block = this.id('asset_location_block');
    this.level = this.id('asset_location_level');
    this.room = this.id('asset_location_room');
    this.remarks = this.id('asset_remarks');
    this.uploadImageButton = this.id('upload_image_btn');
    this.firstPhotoSlot = this.id('image1');
    this.saveButton = this.id('submit_btn');
  }

  async expectList(): Promise<void> {
    await expect(this.count).toHaveText(/^\(\d+\)$/, { timeout: 30_000 });
    await expect(this.assetIds.first().or(this.empty)).toBeVisible({ timeout: 30_000 });
  }

  /** Asset IDs in the Register Asset list (those on screen). */
  async listedAssets(): Promise<string[]> {
    if (await this.empty.isVisible()) return [];
    return this.textsOnScreen({ resourceId: 'tv_lmsAssetId' });
  }

  asset(assetId: string): Locator {
    return this.assetIds.and(this.screen.getByText(assetId, { exact: true }));
  }

  /** Open an asset of the list; waits for the pre-filled postal code. */
  async open(assetId: string): Promise<void> {
    await this.asset(assetId).tap();
    await expect(this.postalCode).toHaveText(/^\d{6}$/, { timeout: 30_000 });
  }

  private async text(field: Locator): Promise<string> {
    await field.scrollIntoViewIfNeeded();
    return (await field.getText()).trim();
  }

  async readForm(): Promise<RegistrationForm> {
    return {
      group: await this.text(this.groupSpinner.getByTestId('text1')),
      postalCode: await this.text(this.postalCode),
      block: await this.text(this.block),
      level: await this.text(this.level),
      room: await this.text(this.room),
      remarks: await this.text(this.remarks),
    };
  }

  /**
   * Make sure Group/NPC/Base is set. A PROGRESS asset may have none (HTA 2026-10-20: the form shows "Select
   * Location" and Save only toasts "Please select location"); SPF assets came with it. Picks the option the asset's
   * MHA web group names ("Name (CODE)" or "CODE"), else the first one offered. Picking a group makes the app open
   * "Select Address:-" for the form's postal code (HTA 2026-10-20), so the address is picked again (the asset's
   * own, else the first row of its postal code). Returns the group the form shows.
   */
  async ensureGroup(webGroup = '', postalCode = '', address = ''): Promise<string> {
    const shown = this.groupSpinner.getByTestId('text1');
    await this.groupSpinner.scrollIntoViewIfNeeded();
    const current = (await shown.getText()).trim();
    if (current && current !== 'Select Location') return current;
    const options = (await this.firstOptionsOf(this.groupSpinner)).filter((o) => o !== 'Select Location');
    if (!options.length) throw new Error('Group/NPC/Base offers no location');
    const wanted = options.find((o) => webGroup.trim() === o || webGroup.trim().endsWith(`(${o})`)) ?? options[0];
    await this.pick(this.groupSpinner, wanted);
    const addressList = this.screen.getByText('Select Address:-', { exact: true });
    if (await expect(addressList).toBeVisible({ timeout: 8_000 }).then(() => true, () => false)) {
      await this.pickAddressRow(postalCode, address);
    }
    await expect(shown).toHaveText(wanted);
    return wanted;
  }

  /** Replace a field's text (empty string clears it). */
  async setField(field: Locator, value: string): Promise<void> {
    await field.scrollIntoViewIfNeeded();
    if (value) await field.fill(value);
    else await field.clear();
    await this.hideKeyboard();
  }

  /** Upload Image > (camera permission: Only this time) > the newest photo > Done; waits for slot 1. */
  async uploadNewestPhoto(): Promise<void> {
    await this.uploadImageButton.scrollIntoViewIfNeeded();
    await this.uploadImageButton.tap();
    const oneTime = this.screen.getByText('Only this time', { exact: true });
    const firstPhoto = this.screen.getByLabel('Photo taken on', { exact: false }).first();
    await expect(oneTime.or(firstPhoto)).toBeVisible({ timeout: 30_000 });
    if (await oneTime.isVisible()) {
      await oneTime.tap();
      // The app returns to the form after the permission; open the picker again.
      await this.uploadImageButton.tap();
    }
    await firstPhoto.tap();
    await this.screen.getByText('Done', { exact: true }).tap();
    await expect(this.uploadImageButton).toBeVisible({ timeout: 30_000 });
  }

  /** Save; the "Success / Registration Success" dialog > OK returns to the list. */
  async save(): Promise<void> {
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.saveButton.tap();
    await expect(this.alertMessage).toHaveText('Registration Success', { timeout: 60_000 });
    await this.alertOk.tap();
    await this.expectList();
  }

  /** From the list back to the home screen (Back). */
  async close(): Promise<void> {
    await this.screen.pressButton('BACK');
    await expect(this.count).toBeHidden({ timeout: 15_000 });
  }

  /** Leave the form without saving (Back). */
  async leaveForm(): Promise<void> {
    await this.screen.pressButton('BACK');
    await this.expectList();
  }
}
