import { expect, type Locator, type Page } from '@playwright/test';

export type ItemState = { id: number; itemNo: string; chipCode: string; status: string; purpose: string; locationId: number; whitelisted: boolean };

/**
 * HTX LIMS web (same UAT backend as the app), used by the phone tests to set up data and check results.
 * Blazor Server + BootstrapBlazor: pages show "Loading..." first; date fields are read-only pickers opened by a
 * click (sometimes two) that show a `.popover.show` calendar. The API shares the web login cookie, so
 * `page.request` reads item state (GET /api/Item/*, GET /api/Gantry = the whitelist the gantries download).
 * Details: projects/htx-lims-web/context.md and context/gantry.md.
 */
export class LimsWebPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get main(): Locator {
    return this.page.locator('main');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('Identity/Account/Login');
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await expect(this.page).toHaveURL(/dashboard/, { timeout: 30_000 });
  }

  /** Open a page by its address and wait until its data is loaded (no "Loading..."). */
  async open(path: string, ready: Locator): Promise<void> {
    await this.page.goto(path);
    await expect(ready).toBeVisible({ timeout: 30_000 });
    await expect(this.main.getByText('Loading...').filter({ visible: true })).toHaveCount(0, { timeout: 30_000 }); // grids keep a hidden one
  }

  /** Pick a day in a BootstrapBlazor date picker, `nextMonths` months after the one it opens on. */
  async pickDay(input: Locator, day: number, nextMonths = 0): Promise<void> {
    const popover = this.page.locator('.popover.show').last();
    // The first click sometimes only focuses the field: click until the calendar shows.
    for (let i = 0; i < 3 && !(await popover.isVisible()); i++) {
      await input.click({ force: true });
      await popover.waitFor({ state: 'visible', timeout: 1_500 }).catch(() => undefined);
    }
    await expect(popover).toBeVisible();
    for (let i = 0; i < nextMonths; i++) await popover.getByRole('button', { name: 'Next Month' }).click();
    await popover.locator('table.date-table td:not(.prev-month):not(.next-month) span.cell').getByText(String(day), { exact: true }).first().click();
    await expect(input).not.toHaveValue('');
  }

  /** Register one item (Item Register) and return its item number. */
  async registerItem(d: { category: string; type: string; description: string; lot: string }): Promise<string> {
    await this.open('itemregister', this.page.getByRole('heading', { name: 'Register new item' }));
    await this.main.locator('select').first().selectOption({ label: d.category });
    await this.main.locator('select').nth(1).selectOption({ label: d.type });
    await this.page.getByRole('textbox', { name: /Item description/ }).fill(d.description);
    await this.page.getByRole('textbox', { name: /Lot \/ batch/ }).fill(d.lot);
    const dates = this.main.locator('input[placeholder="Please select ..."]');
    await this.pickDay(dates.nth(0), 1); // production
    await this.pickDay(dates.nth(1), 1); // delivery
    await this.pickDay(dates.nth(2), 15, 2); // expiry, two months ahead
    await this.page.getByRole('button', { name: 'Register' }).click();
    const done = this.main.getByText(/1 item\(s\) registered with Item Number \d{9}/);
    await expect(done).toBeVisible({ timeout: 30_000 });
    return ((await done.innerText()).match(/\d{9}/) as RegExpMatchArray)[0];
  }

  /** Print the tags of registered items on the UAT printer "test" (label size By category). */
  async printTags(itemNos: string[]): Promise<void> {
    await this.open('assettagprinting', this.page.getByRole('heading', { name: 'Print new tags' }));
    // The printer list comes from Zebra Browser Print on this PC (filled in a few seconds after the page loads).
    await expect(this.page.getByLabel('Printer').locator('option', { hasText: 'test' })).toHaveCount(1, { timeout: 30_000 });
    await this.page.getByLabel('Printer').selectOption({ label: 'test' });
    for (const no of itemNos) await this.page.getByRole('checkbox', { name: `Select ${no}` }).check();
    await this.page.getByRole('button', { name: /Print \d+ selected/ }).click();
    await expect(this.page.getByText(new RegExp(`tag\\(s\\) sent to the printer: .*${itemNos[0]}`))).toBeVisible({ timeout: 30_000 });
  }

  /** Current state of an item from the API (status, check-out purpose, room, chip code, on the gantry whitelist). */
  async itemState(itemNo: string): Promise<ItemState> {
    const all = (await (await this.page.request.get('api/Item/all')).json()) as { id: number; rfIdTag: string }[];
    const ref = all.find((i) => i.rfIdTag === itemNo);
    if (!ref) throw new Error(`Item ${itemNo} not found in /api/Item/all`);
    const d = await (await this.page.request.get(`api/Item/${ref.id}`)).json();
    const whitelist = (await (await this.page.request.get('api/Gantry')).json()) as string[];
    return { id: ref.id, itemNo, chipCode: d.encodedRfidTag, status: d.status ?? '', purpose: d.exhibitStatus ?? '', locationId: d.locationId, whitelisted: whitelist.includes(d.encodedRfidTag) };
  }

  /** An IN, non-chemical item that is not whitelisted (chemicals follow FEFO), or undefined. */
  async findLoanableItem(): Promise<ItemState | undefined> {
    const all = (await (await this.page.request.get('api/Item/all')).json()) as { id: number; rfIdTag: string; category?: string }[];
    for (const ref of all.filter((i) => /^00[12]\d{6}$/.test(i.rfIdTag)).reverse()) {
      const s = await this.itemState(ref.rfIdTag);
      if (s.status === 'IN' && !s.whitelisted && s.chipCode) return s;
    }
    return undefined;
  }
}
