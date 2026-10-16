import { Page, Locator, expect } from '@playwright/test';
import { WebBasePage } from './web-base.page';

/** One row of Asset > Assignment. */
export type AssignmentRow = { no: string; costCentre: string; type: string; createdBy: string; approverRole: string; createdOn: string; status: string };

/**
 * MHA web Asset > Assignment (/Asset/Assignment): transactions newest first (#tblist: Transaction No.,
 * Cost Centre, Transaction Type, Created By, Approver Role, Create Date (server time, SGT), Status,
 * Actions). Relocations are auto-approved (Approver Role "-", Status APPROVED). LOGS1 sees its units.
 */
export class WebAssignmentPage extends WebBasePage {
  static readonly path = 'Asset/Assignment';

  readonly rows: Locator;
  readonly info: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
  }

  async goto(): Promise<void> {
    await this.navigate(WebAssignmentPage.path);
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  /** The newest transactions (first list page), read from their cells. */
  async newest(count = 5): Promise<AssignmentRow[]> {
    await this.goto();
    const out: AssignmentRow[] = [];
    for (const row of (await this.rows.all()).slice(0, count)) {
      const c = (await row.locator('td').allInnerTexts()).map((t) => t.trim());
      out.push({ no: c[0], costCentre: c[1], type: c[2], createdBy: c[3], approverRole: c[4], createdOn: c[5], status: c[6] });
    }
    return out;
  }
}
