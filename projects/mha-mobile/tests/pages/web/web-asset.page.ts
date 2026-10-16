import { Page, Locator, expect } from '@playwright/test';
import { WebBasePage } from './web-base.page';

/** An asset as MHA web Asset Details shows it (texts as displayed). */
export type WebAsset = {
  id: string;
  id2: string;
  serial: string;
  category: string;
  capitalisedOn: string;
  acquisitionValue: string;
  description: string;
  status: string;
  costCentre: string;
  sensitivity: string;
  group: string;
  building: string;
  address: string;
  postalCode: string;
  block: string;
  level: string;
  roomNo: string;
  remarks: string;
};

/**
 * MHA web Asset > Listing (/Asset/Asset, #tblist; filters apply on Search) and Asset Details
 * (/Asset/AssetForm?assetId=...: label/value div pairs in the header and tabs Main Data, Location, ...).
 * Use a unit role such as LOGS1: as Agency Admin the listing holds ~48k assets and searching hangs.
 * Slim version of mha-spf's AssetListingPage / AssetDetailsPage.
 */
export class WebAssetPage extends WebBasePage {
  static readonly path = 'Asset/Asset';

  readonly heading: Locator;
  readonly rows: Locator;
  readonly info: Locator;
  readonly searchButton: Locator;
  readonly activePanel: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Listing', level: 1 });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.activePanel = page.locator('.tab-content .tab-pane.active');
  }

  async gotoListing(): Promise<void> {
    await this.navigate(WebAssetPage.path);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  /** Asset IDs and cost centres of the first listing page with this status (e.g. AVAILABLE). */
  async listedWithStatus(status: string): Promise<{ id: string; costCentre: string }[]> {
    await this.gotoListing();
    await this.pickSelect2(this.page, 'Status', status);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
    if ((await this.tableTotal(this.info)) === 0) return [];
    const out: { id: string; costCentre: string }[] = [];
    for (const row of await this.rows.all()) {
      const lines = (await row.innerText()).split(/[\t\n]/).map((s) => s.trim()).filter(Boolean);
      const id = lines[0]?.match(/Asset ID: (\d+)/)?.[1];
      const costCentre = lines.find((l) => /^\d{6}$/.test(l));
      if (id && costCentre) out.push({ id, costCentre });
    }
    return out;
  }

  async openAsset(assetId: string): Promise<void> {
    await this.page.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill(assetId);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
    await this.rows.filter({ hasText: `Asset ID: ${assetId}` }).getByRole('link', { name: `Asset ID: ${assetId}` }).click();
    await expect(this.page).toHaveURL(/\/Asset\/AssetForm\?assetId=/);
    await expect(this.field('Asset ID')).toBeVisible();
  }

  /** Value next to a field label (label and value are sibling divs without ids or roles). */
  field(label: string, scope: Locator | Page = this.page): Locator {
    return scope.getByText(label, { exact: true }).filter({ visible: true }).first().locator('xpath=following-sibling::*[1]');
  }

  async openTab(name: string): Promise<void> {
    const tab = this.page.getByRole('tab', { name, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  /** Current LOGS1 and Current FALO of an asset (Asset Details > Ownership; "-" when there is none). */
  async ownership(assetId: string): Promise<{ logs1: string; falo: string }> {
    await this.gotoListing();
    await this.openAsset(assetId);
    await this.openTab('Ownership');
    return {
      logs1: (await this.field('Current LOGS1', this.activePanel).innerText()).trim(),
      falo: (await this.field('Current FALO', this.activePanel).innerText()).trim(),
    };
  }

  /** Read the open asset: header, Main Data and the Location tab's "Asset Location" card. */
  async readAsset(): Promise<WebAsset> {
    const read = async (label: string, scope: Locator | Page = this.page) => (await this.field(label, scope).innerText()).trim();
    await this.openTab('Main Data');
    const main = {
      id: await read('Asset ID'),
      id2: await read('Asset ID (Secondary)'),
      serial: await read('Serial No'),
      category: await read('Asset Category'),
      capitalisedOn: await read('Capitalized On'),
      acquisitionValue: await read('Acquisition Value'),
      description: await read('Asset Description'),
      status: await read('Asset Status'),
      costCentre: await read('Cost Centre'),
      sensitivity: await read('Asset Sensitivity', this.activePanel),
    };
    await this.openTab('Location');
    // The Location tab also has a "Cost Centre Location" card with its own Postal Code.
    const card = this.activePanel.locator('.card').filter({ has: this.page.getByRole('heading', { name: 'Asset Location', exact: true }) });
    return {
      ...main,
      group: await read('Group / NPC / Base', card),
      building: await read('Building', card),
      address: await read('Address', card),
      postalCode: await read('Postal Code', card),
      block: await read('Block', card),
      level: await read('Level', card),
      roomNo: await read('Room No', card),
      remarks: await read('Remarks', card),
    };
  }
}
