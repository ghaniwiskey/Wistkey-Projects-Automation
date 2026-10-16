import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';

export type FaveTab = 'SELECT' | 'VERIFY' | 'REVIEW';
const TABS: FaveTab[] = ['SELECT', 'VERIFY', 'REVIEW'];

/**
 * Stocktake list (home > Stocktake): title "Stocktake" with the count "(n)", one row per stocktake of the
 * active cost centre (date box, "FAVE FY26-2007", "<cost centre> - <name>", "Fave | Pending: <n>"; the
 * pending count is the cost centre's, not the stocktaker's). Empty list: "Nothing to show yet".
 * Opening a FAVE asks "Will do stocktake by OFFLINE MODE?": CONFIRM = offline (downloads every asset first),
 * CANCEL = online.
 */
export class StocktakeListScreen extends AppScreen {
  readonly count: Locator;
  readonly numbers: Locator;
  readonly names: Locator;
  readonly empty: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.count = this.id('count');
    this.numbers = this.id('stkTakeNo');
    this.names = this.id('stkTakeName');
    this.empty = screen.getByText('Nothing to show yet', { exact: true });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.count).toHaveText(/^\(\d+\)$/, { timeout: 30_000 });
    await expect(this.numbers.first().or(this.empty)).toBeVisible({ timeout: 30_000 });
  }

  /** The "(n)" next to the title. */
  async total(): Promise<number> {
    return Number((await this.count.getText()).replace(/\D/g, ''));
  }

  /** Stocktake numbers listed ("FAVE FY26-2007"). */
  async stocktakeNumbers(): Promise<string[]> {
    return this.textsOnScreen({ resourceId: 'stkTakeNo' });
  }

  /** "<cost centre> - <name>" of each row. */
  async stocktakeNames(): Promise<string[]> {
    return this.textsOnScreen({ resourceId: 'stkTakeName' });
  }

  /** Open a stocktake by number and answer CANCEL (online mode) to the offline question. */
  async openOnline(stocktakeNo: string): Promise<void> {
    await this.numbers.and(this.screen.getByText(stocktakeNo, { exact: true })).tap();
    await this.answer('Will do stocktake by OFFLINE MODE?', 'right');
  }

  /**
   * Open a stocktake in OFFLINE MODE: CONFIRM downloads every asset of it, then "All data assets has been
   * downloaded" > CONTINUE. Sightings are kept on the phone until REVIEW > Submit (needs the network).
   */
  async openOffline(stocktakeNo: string): Promise<void> {
    await this.numbers.and(this.screen.getByText(stocktakeNo, { exact: true })).tap();
    await this.answer('Will do stocktake by OFFLINE MODE?', 'left');
    await this.answer('All data assets has been downloaded', 'left');
  }
}

/**
 * One FAVE on the phone: tabs SELECT (assets to sight by hand) / VERIFY (assets an RFID scanner read) /
 * REVIEW (saved sightings, Submit sends them), each with a count; a search box (Asset ID / Asset ID 2 /
 * description) that filters while typing; SELECT groups the assets by location ("<postal code>",
 * "Block X | Level Y", "<n> Assets" pill that expands the group). The counts read 0/0/0 for a moment while a
 * sighting is saved. Home (top right) asks "Are you sure you want to exit without uploading?", even with an
 * empty REVIEW.
 */
export class FaveScreen extends AppScreen {
  readonly search: Locator;
  readonly groupPills: Locator;
  readonly assetIds: Locator;
  readonly submitButton: Locator;
  readonly homeButton: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.search = this.id('search_asset');
    this.groupPills = this.id('pending_count');
    this.assetIds = this.id('lmsAssetID');
    this.submitButton = this.id('submit_btn');
    this.homeButton = this.id('menu_home');
  }

  tab(name: FaveTab): Locator {
    return this.screen.getByText(name, { exact: true });
  }

  /** The count badge of a tab (the three badges share one id, in tab order). */
  tabCount(name: FaveTab): Locator {
    return this.id('count').nth(TABS.indexOf(name));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.search).toBeVisible({ timeout: 60_000 });
    for (const t of TABS) await expect(this.tab(t)).toBeVisible();
    await expect(this.tabCount('REVIEW')).toHaveText(/^\d+$/);
  }

  async openTab(name: FaveTab): Promise<void> {
    await this.tab(name).tap();
  }

  /** Asset row in the open tab, by Asset ID. */
  asset(assetId: string): Locator {
    return this.assetIds.and(this.screen.getByText(assetId, { exact: true }));
  }

  /** Search the open tab for an asset and expand its location group. */
  async findAsset(assetId: string): Promise<void> {
    await this.search.fill(assetId);
    await this.hideKeyboard();
    await expect(this.groupPills.first()).toBeVisible({ timeout: 30_000 });
    if (!(await this.asset(assetId).isVisible())) await this.groupPills.first().tap();
    await expect(this.asset(assetId)).toBeVisible({ timeout: 15_000 });
  }

  async openAsset(assetId: string): Promise<void> {
    await this.asset(assetId).tap();
  }

  /**
   * Wait until REVIEW offers Submit. Offline the button is not shown at all; after the network comes back
   * it appears when the tab is drawn again, so switch tabs until it does.
   */
  async waitForSubmit(timeoutMs = 60_000): Promise<void> {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      await this.openTab('SELECT');
      await this.openTab('REVIEW');
      if (await this.submitButton.isVisible({ timeout: 5_000 })) return;
    }
    throw new Error('REVIEW shows no Submit button although the network is back');
  }

  /** REVIEW > Submit: sends the saved sightings (the app toasts "Submission Successful"). */
  async submitReview(): Promise<void> {
    await this.openTab('REVIEW');
    await this.submitButton.tap();
  }

  /** Leave the FAVE for the home screen (EXIT ANYWAY to the upload warning). */
  async exitToHome(): Promise<void> {
    await this.homeButton.tap();
    await this.answer('Are you sure you want to exit without uploading?', 'left');
  }
}

/** Asset data the StockTake Detail screen shows (read-only fields). */
export type StocktakeAsset = { assetNo: string; assetId2: string; serial: string };

/**
 * StockTake Detail (tap an asset in a FAVE): read-only asset data (Asset No., Asset ID 2, Serial Number,
 * category, dates, values, description, location), then Sighted and Correct Location switches, Asset
 * Condition (WORKING / NOT WORKING / NOT IN USE/OBSOLETE), Remarks and the photo. Turning Sighted on also
 * turns on Correct Location and sets WORKING. SAVE asks "Set this asset as sighted?"; CONFIRM stores the
 * sighting on the phone (REVIEW) and returns to the FAVE.
 */
export class StocktakeDetailScreen extends AppScreen {
  readonly heading: Locator;
  readonly assetNo: Locator;
  readonly assetId2: Locator;
  readonly serial: Locator;
  readonly sighted: Locator;
  readonly correctLocation: Locator;
  readonly conditionSpinner: Locator;
  readonly remarks: Locator;
  readonly saveButton: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.heading = screen.getByText('StockTake Detail', { exact: true });
    this.assetNo = this.id('asset_no');
    this.assetId2 = this.id('asset_id_2');
    this.serial = this.id('serial_number');
    this.sighted = this.id('toggle_sighted');
    this.correctLocation = this.id('toggle_sighted_location');
    this.conditionSpinner = this.id('spinner_asset_condition');
    this.remarks = this.id('asset_remarks');
    this.saveButton = this.id('save_review_btn');
  }

  /** Asset Condition as shown in its spinner. */
  get condition(): Locator {
    return this.conditionSpinner.getByTestId('text1');
  }

  async expectLoaded(assetId: string): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
    await expect(this.assetNo).toHaveText(assetId, { timeout: 30_000 });
  }

  async readAsset(): Promise<StocktakeAsset> {
    return {
      assetNo: (await this.assetNo.getText()).trim(),
      assetId2: (await this.assetId2.getText()).trim(),
      serial: (await this.serial.getText()).trim(),
    };
  }

  async setSighted(): Promise<void> {
    await this.sighted.scrollIntoViewIfNeeded();
    await this.sighted.check();
  }

  async pickCondition(condition: string): Promise<void> {
    await this.conditionSpinner.scrollIntoViewIfNeeded();
    if ((await this.condition.getText()).trim() !== condition) await this.pick(this.conditionSpinner, condition);
    await expect(this.condition).toHaveText(condition);
  }

  async typeRemarks(text: string): Promise<void> {
    await this.remarks.scrollIntoViewIfNeeded();
    await this.remarks.fill(text);
    await this.hideKeyboard();
  }

  /** SAVE, then CONFIRM "Set this asset as sighted?"; returns to the FAVE. */
  async saveSighted(): Promise<void> {
    await this.saveButton.tap();
    await this.answer('Set this asset as sighted?', 'left');
    await expect(this.heading).toBeHidden({ timeout: 30_000 });
  }
}
