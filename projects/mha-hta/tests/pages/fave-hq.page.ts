import { Page, Locator, Download, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Stocktake > FAVE(HQ) (/Stocktake/FaveHQ -> /Stocktake/FaveHQForm?stktakeFAVEId=..., Agency Admin and HQ
 * roles): read-only HQ view of a FAVE over every cost centre of the agency (#tbcostcenter, first row
 * selected on load). Tabs Overview (#tboverview: FSSC legend a..i with Cost, NBV, Count of FA and open
 * follow-up items of the selected cost centre, plus Export of that cost centre), Summary (approval stages
 * and #tbsummary like FAVE) and Details (#tbdetail, Search/Clear only: no Update Result, Assign or Submit).
 * The Export link above the cost centre table exports the whole FAVE (costCenterId=0, several MB).
 */
export class FaveHqPage extends BasePage {
  static readonly path = 'Stocktake/FaveHQ';

  readonly listHeading: Locator;
  readonly faveRows: Locator;
  readonly listInfo: Locator;
  readonly title: Locator;
  readonly costCentreSearch: Locator;
  readonly costCentreRows: Locator;
  readonly costCentreInfo: Locator;
  readonly overviewTab: Locator;
  readonly summaryTab: Locator;
  readonly detailsTab: Locator;
  readonly overviewRows: Locator;
  readonly summaryRows: Locator;
  readonly detailRows: Locator;
  readonly overviewExport: Locator;
  /** Every visible button in the Details tab (HQ gets Search and Clear only). */
  readonly detailButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.listHeading = page.getByRole('heading', { name: 'FAVE(HQ)', level: 1 });
    this.faveRows = page.locator('#tblist tbody tr');
    this.listInfo = page.locator('#tblist_info');
    this.title = page.getByRole('heading', { level: 1, name: /^Stocktake FAVE #/ });
    // The placeholder has a typo in the app ("Cost Centr Name").
    this.costCentreSearch = page.getByPlaceholder(/^Cost Centre Code\/Cost Centr/);
    this.costCentreRows = page.locator('#tbcostcenter tbody tr');
    this.costCentreInfo = page.locator('#tbcostcenter_info');
    this.overviewTab = page.getByRole('tab', { name: 'Overview', exact: true });
    this.summaryTab = page.getByRole('tab', { name: 'Summary', exact: true });
    this.detailsTab = page.getByRole('tab', { name: 'Details', exact: true });
    this.overviewRows = page.locator('#tboverview tbody tr');
    this.summaryRows = page.locator('#tbsummary tbody tr');
    this.detailRows = page.locator('#tbdetail tbody tr');
    this.overviewExport = page.locator('#overview_tab').getByRole('link', { name: 'Export', exact: true });
    this.detailButtons = page.locator('#detail_tab').getByRole('button').filter({ visible: true });
  }

  async gotoList(): Promise<void> {
    await this.navigate(FaveHqPage.path);
    await expect(this.listHeading).toBeVisible();
    await expect(this.listInfo).toHaveText(/Showing/, { timeout: 30_000 });
  }

  /** Open the first FAVE of the list. Returns its number (e.g. "FAVE FY26-2007"). */
  async openFirst(): Promise<string> {
    await this.gotoList();
    await expect(this.faveRows.first()).toContainText(/FAVE FY\d{2}-\d{4}/, { timeout: 30_000 });
    const faveNo = (await this.faveRows.first().locator('td').first().innerText()).trim();
    await this.faveRows.first().locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Stocktake\/FaveHQForm\?stktakeFAVEId=/);
    await expect(this.title).toContainText(faveNo);
    await expect(this.costCentreInfo).toHaveText(/Showing/, { timeout: 30_000 });
    return faveNo;
  }

  /** Total number of cost centres in the FAVE (unfiltered). */
  async costCentreTotal(): Promise<number> {
    return this.tableTotal(this.costCentreInfo);
  }

  costCentreRow(code: string): Locator {
    return this.costCentreRows.filter({ has: this.page.locator('td:first-child', { hasText: new RegExp(`^\\s*${code}\\s*$`) }) });
  }

  /**
   * Search one cost centre and select it. The cost centre search filters in the browser (no request) and
   * selects the first row it shows, which reloads the tabs; clicking a row that is already selected
   * reloads nothing. So: search, click only when the row is not selected, and wait for an Overview reload
   * only if one starts.
   */
  async selectCostCentre(code: string): Promise<void> {
    const reloaded = this.overviewReload();
    await this.costCentreSearch.fill(code);
    await this.page.getByRole('button', { name: 'Search', exact: true }).first().click();
    await expect(this.costCentreRow(code)).toHaveCount(1);
    if (!(await this.costCentreRow(code).getAttribute('class'))?.includes('selected')) {
      await this.costCentreRow(code).click();
    }
    await expect(this.costCentreRow(code)).toHaveClass(/\bselected\b/);
    await reloaded;
    await this.settled(['#tboverview', '#tbsummary', '#tbdetail']);
  }

  /** Resolves after the next Overview reload is drawn, or after 10 s when none happens. */
  private overviewReload(): Promise<void> {
    return this.page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          const $ = (window as unknown as { jQuery: (s: string) => { one: (e: string, f: () => void) => void } }).jQuery;
          $('#tboverview').one('xhr.dt', () => $('#tboverview').one('draw.dt', () => resolve()));
          setTimeout(resolve, 10_000);
        }),
    );
  }

  /** Wait until no request of these DataTables is still in flight. */
  private async settled(tables: string[]): Promise<void> {
    await this.page.waitForFunction((sels) => {
      const $ = (window as unknown as { jQuery: (s: string) => { DataTable?: () => { settings: () => { jqXHR?: { readyState: number } }[] } } }).jQuery;
      return sels.every((sel) => {
        const settings = $(sel).DataTable?.().settings()[0];
        return !settings?.jqXHR || settings.jqXHR.readyState === 4;
      });
    }, tables);
  }

  /** Overview row of one FSSC legend letter (a..i). */
  overviewRow(letter: string): Locator {
    return this.overviewRows.filter({ has: this.page.locator('td:first-child', { hasText: new RegExp(`^\\s*${letter}\\s*$`) }) });
  }

  /** Overview: [letter, legend text, count of FA] for every legend row. */
  async overview(): Promise<{ letter: string; legend: string; count: number }[]> {
    await this.overviewTab.click();
    await expect(this.overviewRows.first()).toBeVisible();
    const out: { letter: string; legend: string; count: number }[] = [];
    for (const r of await this.overviewRows.all()) {
      const cells = (await r.locator('td').allInnerTexts()).map((t) => t.trim());
      out.push({ letter: cells[0], legend: cells[1], count: Number(cells[4].replace(/,/g, '')) });
    }
    return out;
  }

  /** Count of FA of one legend letter. */
  async overviewCount(letter: string): Promise<number> {
    return (await this.overview()).find((o) => o.letter === letter)?.count ?? NaN;
  }

  /** Summary rows: Sighted Result, FSSC Outcome and Count (columns Sighted Result, Condition, HTD, FSSC, Count). */
  async summary(): Promise<{ result: string; fssc: string; count: number }[]> {
    await this.summaryTab.click();
    await expect(this.page.locator('#tbsummary_info')).toHaveText(/Showing/, { timeout: 30_000 });
    const out: { result: string; fssc: string; count: number }[] = [];
    for (const r of await this.summaryRows.all()) {
      const cells = (await r.locator('td').allInnerTexts()).map((t) => t.trim());
      if (cells.length < 5) continue; // "No data" row
      out.push({ result: cells[0], fssc: cells[3], count: Number(cells[4].replace(/,/g, '')) });
    }
    return out;
  }

  /** Details tab, keyword search for one asset. */
  async searchDetails(assetId: string): Promise<void> {
    await this.detailsTab.click();
    const pane = this.page.locator('#detail_tab');
    await pane.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').fill(assetId);
    await this.reloadsTable('#tbdetail', () => pane.getByRole('button', { name: 'Search', exact: true }).click());
    await expect(this.detailRow(assetId)).toHaveCount(1);
  }

  detailRow(assetId: string): Locator {
    return this.detailRows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  /** Export of the selected cost centre (Overview tab): StktakeFAVEReport_<stamp>.xlsx. */
  async exportCostCentre(): Promise<Download> {
    await this.overviewTab.click();
    const [download] = await Promise.all([this.page.waitForEvent('download', { timeout: 60_000 }), this.overviewExport.click()]);
    return download;
  }
}
