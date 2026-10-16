import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';

/** What Search Asset's detail shows about an asset (field texts as the phone shows them). */
export type MobileAsset = {
  assetNo: string;
  assetId2: string;
  category: string;
  capitalisationDate: string;
  acquisitionValue: string;
  description1: string;
  description2: string;
  serial: string;
  status: string;
  group: string;
  building: string;
  address: string;
  postalCode: string;
  block: string;
  level: string;
  room: string;
  locationRemarks: string;
  sensitive: boolean;
};

/**
 * Search Asset (home tile): box "Search by EPC/Asset No./Asset ID 2.", Search and Scan (RFID scanner)
 * at the bottom. The search only covers the active cost centre: another unit's asset gives an empty list
 * and no message. A result shows "Asset Desc 1: ...", "Asset Desc 2: ...", "Asset Serial No: ...",
 * "Asset ID 2: ...", "EPC No: ...". Tapping it opens the asset (read-only fields, Locate Asset) on top of
 * the list, so list ids stay in the view tree; the detail's fields are EditTexts.
 */
export class SearchAssetScreen extends AppScreen {
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly resultDescriptions: Locator;
  readonly resultSerials: Locator;
  readonly resultIds2: Locator;
  readonly detailAssetNo: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.heading = screen.getByText('Search Asset', { exact: true });
    this.searchBox = this.id('search_edit_text');
    this.searchButton = this.id('btn_search');
    this.resultDescriptions = this.id('asset_description_1');
    this.resultSerials = this.id('asset_serialno').and(screen.getByType('android.widget.TextView'));
    this.resultIds2 = this.id('asset_serialno_2');
    this.detailAssetNo = this.id('asset_no_field');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.searchBox).toBeVisible({ timeout: 30_000 });
    await expect(this.searchButton).toBeVisible();
  }

  async search(keyword: string): Promise<void> {
    await this.searchBox.fill(keyword);
    await this.hideKeyboard();
    await this.searchButton.tap();
  }

  async openFirstResult(): Promise<void> {
    await this.resultDescriptions.first().tap();
    await expect(this.detailAssetNo).toBeVisible({ timeout: 30_000 });
  }

  /** A detail field (EditText) by resource-id; scrolled into view before reading. */
  private async detail(resourceId: string): Promise<string> {
    const field = this.id(resourceId).and(this.screen.getByType('android.widget.EditText'));
    await field.scrollIntoViewIfNeeded();
    return (await field.getText()).trim();
  }

  /** Read the open asset's detail, top to bottom. */
  async readDetail(): Promise<MobileAsset> {
    const read = (id: string) => this.detail(id);
    const asset = {
      assetNo: await read('asset_no_field'),
      assetId2: await read('asset_no_2_field'),
      category: await read('asset_category'),
      capitalisationDate: await read('capitalisation_date'),
      acquisitionValue: await read('acquisition_value'),
      description1: await read('et_asset_description_1'),
      description2: await read('et_asset_description_2'),
      serial: await read('asset_serialno'),
      status: await read('asset_status'),
      group: await read('location_sublocation'),
      building: await read('asset_location_buildingname'),
      address: await read('asset_location_address'),
      postalCode: await read('asset_location_postalcode'),
      block: await read('asset_location_block'),
      level: await read('asset_location_level'),
      room: await read('asset_location_room'),
      locationRemarks: await read('asset_remarks'),
      sensitive: false,
    };
    const sensitivity = this.id('toggle_sensitivity');
    await sensitivity.scrollIntoViewIfNeeded();
    asset.sensitive = await sensitivity.isChecked();
    return asset;
  }
}
