import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "06-Oct-2026" (list date) -> Date, local midnight. */
function parseListDate(text: string): Date {
  const [d, mon, y] = text.trim().split('-');
  return new Date(Number(y), MONTHS.indexOf(mon), Number(d));
}

/** "2026-10-06": the announcement date fields (flatpickr Y-m-d). */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export type Announcement = { content: string; start: string; end: string };

/**
 * Settings > Announcement (/Setting/Announcement, Agency Admin): #tblist (Type, Start Date, End Date,
 * pencil), Content keyword box, Announcement Type filter, Create (opens a new tab). Form
 * (/Setting/AnnouncementForm[?announceId=]): Type HEADER/FOOTER, Content, Start/End Date (read-only
 * flatpickr Y-m-d); the save button says "Update". No delete. HEADER shows as a banner at the top of the
 * login page while today is within its dates; FOOTER is the text under the login card.
 */
export class AnnouncementPage extends BasePage {
  static readonly path = 'Setting/Announcement';

  readonly rows: Locator;
  readonly info: Locator;
  readonly content: Locator;
  readonly startDate: Locator;
  readonly endDate: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    // The form labels are not tied to their fields (no for/id pairs), so the field names are used.
    this.content = page.locator('textarea[name="Content"]');
    this.startDate = page.locator('input[name="StartOn"]');
    this.endDate = page.locator('input[name="EndOn"]');
    this.saveButton = page.locator('form').getByRole('button', { name: 'Update', exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate(AnnouncementPage.path);
    // The table first shows "Showing no records" until its data arrives; the login FOOTER always exists.
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  /** Row of an announcement by type and dates as listed ("06-Oct-2026"). */
  row(type: string, start: string, end: string): Locator {
    return this.rows.filter({ hasText: type }).filter({ hasText: start }).filter({ hasText: end });
  }

  /**
   * Open the first HEADER announcement whose end date has passed (not shown to anyone) and return the
   * form's URL (valid for this session) to come back to it. Undefined when there is none.
   */
  async openFirstEndedHeader(): Promise<string | undefined> {
    await this.goto();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const row of await this.rows.all()) {
      const cells = (await row.locator('td').allInnerTexts()).map((t) => t.trim());
      const dates = cells.filter((c) => /^\d{2}-[A-Za-z]{3}-\d{4}$/.test(c));
      if (!cells.includes('HEADER') || dates.length < 2 || parseListDate(dates[1]) >= today) continue;
      await row.locator('td').last().getByRole('link').click();
      await expect(this.page).toHaveURL(/\/Setting\/AnnouncementForm\?announceId=/);
      await expect(this.content).toBeVisible();
      return this.page.url();
    }
    return undefined;
  }

  async openForm(url: string): Promise<void> {
    await this.page.goto(url);
    await expect(this.content).toBeVisible();
  }

  async read(): Promise<Announcement> {
    return { content: await this.content.inputValue(), start: await this.startDate.inputValue(), end: await this.endDate.inputValue() };
  }

  /** Fill content and dates (Y-m-d) through flatpickr's API (the inputs are read-only), Update. Returns the message. */
  async save(a: Announcement): Promise<string> {
    await this.content.fill(a.content);
    for (const [field, value] of [[this.startDate, a.start], [this.endDate, a.end]] as const) {
      await field.evaluate((el, v) => {
        const fp = (el as HTMLInputElement & { _flatpickr: { setDate: (d: string, fire: boolean) => void; close: () => void } })._flatpickr;
        fp.setDate(v, true);
        fp.close();
      }, value);
      await expect(field).toHaveValue(value);
    }
    // A picked start date can open the end date's calendar, which covers the button.
    for (const field of [this.startDate, this.endDate]) {
      await field.evaluate((el) => (el as HTMLInputElement & { _flatpickr: { close: () => void } })._flatpickr.close());
    }
    await expect(this.page.locator('.flatpickr-calendar.open')).toHaveCount(0);
    await this.saveButton.click();
    return this.acknowledge(/.+/);
  }
}

/**
 * Settings > Cost Centre (/Setting/CostCenter, Agency Admin): #tblist (Cost Centre code + name, Hub,
 * Unit, Status, pencil), keyword box "Cost Centre Code/Cost Centre Desc" (mha-spf BUG-012: descriptions do not
 * match). Form (/Setting/CostCenterForm?costCenterId=): units table, Address (Building, Address, Postal
 * Code), Cost Centre* (read-only), Name* (max 20), Description* (max 40), Hub name; "Update" saves and
 * stays on the form.
 */
export class CostCentrePage extends BasePage {
  static readonly path = 'Setting/CostCenter';

  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly rows: Locator;
  readonly info: Locator;
  readonly code: Locator;
  readonly name: Locator;
  readonly description: Locator;
  readonly building: Locator;
  readonly saveButton: Locator;
  readonly nameRequired: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder('Cost Centre Code/Cost Centre Desc');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    // The form labels are not tied to their inputs (no for/id pairs), so the field names are used.
    this.code = page.locator('input[name="CostCenterCode"]');
    this.name = page.locator('input[name="CostCenterName"]');
    this.description = page.locator('input[name="CostCenterDesc"]');
    this.building = page.locator('input[name="Building"]');
    this.saveButton = page.locator('form').getByRole('button', { name: 'Update', exact: true });
    this.nameRequired = page.getByText('Name is required', { exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate(CostCentrePage.path);
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  async search(text: string): Promise<void> {
    await this.searchInput.fill(text);
    await this.reloadsTable('#tblist', () => this.searchButton.click());
  }

  /** Rows whose Cost Centre cell starts with the code (the cell's text runs on into the name: "332100A&F"). */
  row(code: string): Locator {
    return this.rows.filter({ has: this.page.locator('td:first-child', { hasText: new RegExp(`^\\s*${code}(?!\\d)`) }) });
  }

  /** Code of the first cost centre in the list (e.g. "332100"). */
  async firstCode(): Promise<string> {
    await this.goto();
    const text = (await this.rows.first().locator('td').first().innerText()).trim();
    return text.split(/\s+/)[0];
  }

  /** Open a cost centre from the list (pencil) and return the form URL (valid for this session). */
  async open(code: string): Promise<string> {
    await this.goto();
    await this.search(code);
    await this.row(code).locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Setting\/CostCenterForm\?costCenterId=/);
    await expect(this.code).toHaveValue(code);
    return this.page.url();
  }

  async reloadForm(): Promise<void> {
    await this.page.reload();
    await expect(this.code).not.toHaveValue('');
  }

  /** Back to a form opened earlier in this session (URL from open()). */
  async openForm(url: string): Promise<void> {
    await this.page.goto(url);
    await expect(this.code).not.toHaveValue('');
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  /** Update and close the result. Returns the message. */
  async save(): Promise<string> {
    await this.saveButton.click();
    return this.acknowledge(/.+/);
  }
}

/**
 * Settings > Email Template (/Setting/EmailTemplate, Agency Admin): #tblist (Template Name, Subject,
 * pencil), keyword box "Template Name/Subject". Form (/Setting/EmailTemplateForm?tempId=): Template
 * (max 100), Remarks (internal note, max 200; mha-spf BUG-014 counter says / 250), Email Subject (max 200),
 * Email Content (HTML). "Update" saves and stays on the form.
 */
export class EmailTemplatePage extends BasePage {
  static readonly path = 'Setting/EmailTemplate';

  readonly rows: Locator;
  readonly info: Locator;
  readonly templateName: Locator;
  readonly remarks: Locator;
  readonly subject: Locator;
  readonly saveButton: Locator;
  readonly subjectRequired: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#tblist tbody tr');
    this.info = page.locator('#tblist_info');
    // The form labels are not tied to their inputs, so the stable ids are used.
    this.templateName = page.locator('#EmailTemplate_TempName');
    this.remarks = page.locator('#EmailTemplate_TempDesc');
    this.subject = page.locator('#EmailTemplate_Subject');
    this.saveButton = page.locator('form').getByRole('button', { name: 'Update', exact: true });
    this.subjectRequired = page.getByText('Subject is required', { exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate(EmailTemplatePage.path);
    await expect(this.info).toHaveText(/Showing \d/, { timeout: 30_000 });
  }

  /** Open the first template in the list and return its form URL (valid for this session). */
  async openFirst(): Promise<string> {
    await this.goto();
    await this.rows.first().locator('td').last().getByRole('link').click();
    await expect(this.page).toHaveURL(/\/Setting\/EmailTemplateForm\?tempId=/);
    await expect(this.templateName).not.toHaveValue('');
    return this.page.url();
  }

  async reloadForm(): Promise<void> {
    await this.page.reload();
    await expect(this.templateName).not.toHaveValue('');
  }

  /** Back to a form opened earlier in this session (URL from openFirst()). */
  async openForm(url: string): Promise<void> {
    await this.page.goto(url);
    await expect(this.templateName).not.toHaveValue('');
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  async save(): Promise<string> {
    await this.saveButton.click();
    return this.acknowledge(/.+/);
  }
}
