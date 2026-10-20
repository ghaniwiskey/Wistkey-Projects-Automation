import { Page, Locator, expect } from '@playwright/test';
import { WebBasePage } from './web-base.page';

/** A New Asset request as MHA web shows it. */
export type WebNewAsset = {
  costCentre: string;
  condition: string;
  description: string;
  remarks: string;
  postalCode: string;
  address: string;
  level: string;
  locationRemarks: string;
  photos: number;
};

/**
 * MHA web Asset > New Asset (/Asset/NewAsset): reported potential assets (#tblist: Request Number, Asset
 * Description, Cost Centre, Created By, Created Date, Status, Actions), search box "Request No / Asset Desc".
 * Details (/Asset/NewAssetForm): Photo, Asset Detail and Location as read-only fields; Cancel Item opens
 * #modal_cancel (select2 Reason: Mistaken as Asset, Others; Remarks) > "The reported new asset has been
 * cancelled.". Slim version of mha-spf's NewAssetListPage / NewAssetFormPage.
 */
export class WebNewAssetPage extends WebBasePage {
  static readonly path = 'Asset/NewAsset';

  readonly rows: Locator;
  readonly info: Locator;
  readonly cancelItemButton: Locator;
  readonly cancelModal: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    this.cancelItemButton = page.getByRole('button', { name: 'Cancel Item', exact: true });
    this.cancelModal = page.locator('#modal_cancel');
  }

  /** Search the list (request number or description); returns the rows' cells. */
  async search(keyword: string): Promise<string[][]> {
    await this.openPage(WebNewAssetPage.path);
    await expect(this.info).toHaveText(/Showing/, { timeout: 30_000 });
    await this.page.getByPlaceholder('Request No / Asset Desc').fill(keyword);
    await this.reloadsTable('#tblist', () => this.page.getByRole('button', { name: 'Search', exact: true }).click());
    if ((await this.tableTotal(this.info)) === 0) return [];
    const out: string[][] = [];
    for (const row of await this.rows.all()) out.push((await row.locator('td').allInnerTexts()).map((t) => t.trim()));
    return out;
  }

  async open(requestNo: string): Promise<void> {
    await this.search(requestNo);
    await this.rows.filter({ hasText: requestNo }).locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Asset\/NewAssetForm\?assetNewId=/);
    await expect(this.cancelItemButton.or(this.page.getByText(/CANCELLED|CLOSED/))).toBeVisible({ timeout: 30_000 });
  }

  /** The nth read-only field after a label (labels are plain text, not linked to their inputs). */
  private field(label: string, nth = 0): Locator {
    return this.page.getByText(label, { exact: true }).nth(nth).locator('xpath=following::*[self::input or self::textarea][1]');
  }

  /** Read the open request. */
  async read(): Promise<WebNewAsset> {
    const v = async (label: string, nth = 0) => (await this.field(label, nth).inputValue()).trim();
    const photoCard = this.page.locator('.card').filter({ has: this.page.getByRole('heading', { name: 'Photo', exact: true }) });
    return {
      costCentre: await v('Cost Centre'),
      condition: await v('Asset Condition'),
      description: await v('Description'),
      remarks: await v('Remarks', 0),
      postalCode: await v('Postal Code'),
      address: await v('Address'),
      level: await v('Level'),
      locationRemarks: await v('Remarks', 1),
      photos: await photoCard.locator('img').count(),
    };
  }

  /** Cancel Item with a reason (and remarks); returns the result message. */
  async cancelItem(reason: string, remarks: string): Promise<string> {
    // The button is bound by script after load; retry the click until the modal opens.
    await expect(async () => {
      await this.cancelItemButton.click();
      await expect(this.cancelModal).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await this.pickSelect2(this.cancelModal, 'Reason', reason);
    await this.cancelModal.locator('textarea[name="ReasonRemarks"]').fill(remarks);
    await this.cancelModal.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(this.alertText).toBeVisible();
    if (/Are you sure/.test(await this.alertText.innerText())) await this.confirm(/Are you sure/);
    return this.acknowledge(/cancelled/i);
  }

  /** Cleanup: cancel every OPEN request whose description contains the text. Returns their numbers. */
  async cancelOpen(descriptionText: string): Promise<string[]> {
    const open = (await this.search(descriptionText)).filter((c) => c[5] === 'OPEN').map((c) => c[0]);
    for (const no of open) {
      await this.open(no);
      await this.cancelItem('Others', 'QA cleanup');
    }
    return open;
  }
}
