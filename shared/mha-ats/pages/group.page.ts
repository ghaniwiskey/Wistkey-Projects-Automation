import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Settings > Group (/Setting/Location): the Group / NPC / Base locations of the unit's cost centres
 * (used by registration, assignment and FAVE). List #tblist (Cost Centre, Name (Short), Name (Long),
 * Created Date, pencil), keyword box "Name (Short/Long)", Cost Centre filter, Create link.
 * Form (/Setting/LocationForm[?locId=...]): Cost Centre* (select2), Name (Short)* max 25, Name (Long)*
 * max 100, Description; the save button is labelled "Update" also when creating. Delete (existing groups)
 * asks "Are you sure?" with "Yes, delete it!".
 */
export class GroupPage extends BasePage {
  static readonly path = 'Setting/Location';

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly createLink: Locator;
  readonly rows: Locator;
  readonly info: Locator;
  readonly costCentreOptions: Locator;
  readonly selectedCostCentre: Locator;
  readonly shortName: Locator;
  readonly longName: Locator;
  readonly description: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly costCentreRequired: Locator;
  readonly codeRequired: Locator;
  readonly nameRequired: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Group', level: 1 });
    this.searchInput = page.getByPlaceholder('Name (Short/Long)');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.createLink = page.getByRole('link', { name: 'Create', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    const form = page.locator('form').filter({ has: page.locator('#locCode') });
    this.costCentreOptions = form.locator('select[name="CostCenterId"] option:not([value=""]):not([value="0"])');
    this.selectedCostCentre = form.locator('[id^="select2-CostCenterId"][id$="-container"]');
    // The labels are not tied to the inputs (no for/id pairs), so the stable ids/names are used.
    this.shortName = page.locator('#locCode');
    this.longName = page.locator('#locName');
    this.description = page.locator('input[name="LocDesc"]');
    this.saveButton = form.getByRole('button', { name: 'Update', exact: true });
    this.deleteButton = form.getByRole('button', { name: 'Delete', exact: true });
    this.costCentreRequired = page.getByText('Cost Center is required', { exact: true });
    this.codeRequired = page.getByText('Code is required', { exact: true });
    this.nameRequired = page.getByText('Name is required', { exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate(GroupPage.path);
    await expect(this.heading).toBeVisible();
    await expect(this.info).toHaveText(/Showing/, { timeout: 30_000 });
  }

  async search(text: string): Promise<void> {
    await this.searchInput.fill(text);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  /** Row whose Name (Short) is exactly `code`. */
  row(code: string): Locator {
    return this.rows.filter({ has: this.page.locator('td', { hasText: new RegExp(`^\\s*${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`) }) });
  }

  /** Fresh list, search a group. */
  async find(code: string): Promise<void> {
    await this.goto();
    await this.search(code);
  }

  async openCreate(): Promise<void> {
    await this.createLink.click();
    await expect(this.page).toHaveURL(/\/Setting\/LocationForm$/);
    await expect(this.shortName).toBeVisible();
  }

  /** Open an existing group from a search result (pencil in the last column). */
  async open(code: string): Promise<void> {
    await this.row(code).locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Setting\/LocationForm\?locId=/);
    await expect(this.shortName).toHaveValue(code);
  }

  /** The first cost centre the form offers (e.g. "332100 - A&F"); not fixed, so it works for any unit. */
  async firstCostCentre(): Promise<string> {
    await expect(this.costCentreOptions.first()).toBeAttached({ timeout: 30_000 });
    return (await this.costCentreOptions.first().innerText()).trim();
  }

  async pickCostCentre(option: string): Promise<void> {
    await this.pickSelect2(this.page, 'CostCenterId', option);
    await expect(this.selectedCostCentre).toHaveText(option);
  }

  /** Click the save button ("Update") without expecting a result (validation). */
  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  /** Save and close the result message; the app goes back to the list. Returns the message. */
  async save(): Promise<string> {
    await this.saveButton.click();
    const message = await this.acknowledge(/successfully (created|updated)/);
    await expect(this.page).toHaveURL(/\/Setting\/Location(\?|$)/);
    return message;
  }

  /** Delete the open group: confirm "Yes, delete it!", then the result. Returns [question, message]. */
  async delete(): Promise<[string, string]> {
    await this.deleteButton.click();
    await expect(this.alert).toContainText('Are you sure?');
    const asked = (await this.alert.innerText()).replace(/\s+/g, ' ').trim();
    await this.alert.getByRole('button', { name: 'Yes, delete it!', exact: true }).click();
    return [asked, await this.acknowledge(/successfully deleted/)];
  }

  /** Cleanup: delete every group whose short name contains `text` (e.g. the QA prefix). Returns their names. */
  async deleteMatching(text: string): Promise<string[]> {
    const deleted: string[] = [];
    for (;;) {
      await this.find(text);
      if ((await this.tableTotal(this.info)) === 0) return deleted;
      const code = (await this.rows.first().locator('td').nth(1).innerText()).trim();
      if (!code.includes(text)) return deleted;
      await this.open(code);
      await this.delete();
      deleted.push(code);
    }
  }
}
