import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export type TransactionType = 'ASSIGN' | 'ASSIGN & RELOCATE' | 'RELOCATE';

/** Location fields of the Relocate form, as the phone shows them. */
export type RelocateForm = { postalCode: string; block: string; level: string; room: string; remarks: string };

/**
 * Assign Asset (home tile for URO, LOGS1, FALO): "Asset Selected: n", Select Asset (bottom sheet with
 * Category / Location / Assignee (LOGS1) / Assignee (FALO) filters, a keyword box and Search; each result
 * has a "+" action box), Edit Selection, transaction type ASSIGN / ASSIGN & RELOCATE / RELOCATE. RELOCATE
 * shows Location (Group / NPC / Base), postal code (pre-filled with the asset's), building and address
 * (read-only), Block, Level, Room and Remarks, then Complete. A relocation is auto-approved; the app toasts
 * "Submit success" and resets the form (Asset Selected 0). ASSIGN shows Role (Logistics Officer 1, Fixed Asset
 * Liaison Officer, End User; offered to LOGS1 and to FALO, so a FALO can return an asset to LOGS1) and User;
 * Complete toasts "Submit success" too, whether MHA web approves it at once or holds it for approval.
 *
 * The Remarks box is not the asset's location remarks: it always holds the text "No Remarks" (real text,
 * not a hint), and Complete saves it as the asset's location remarks (BUG-002). Type the remarks you want.
 */
export class AssignScreen extends AppScreen {
  readonly heading: Locator;
  readonly selectedCount: Locator;
  readonly selectAssetButton: Locator;
  readonly typeSpinner: Locator;
  readonly postalCode: Locator;
  readonly block: Locator;
  readonly level: Locator;
  readonly room: Locator;
  readonly remarks: Locator;
  readonly completeButton: Locator;
  // Select Asset sheet
  readonly keywords: Locator;
  readonly searchButton: Locator;
  readonly resultIds: Locator;
  readonly addButtons: Locator;
  readonly closeSheetButton: Locator;
  readonly logs1Filter: Locator;
  readonly resultTotal: Locator;
  readonly noResults: Locator;
  // ASSIGN
  readonly roleSpinner: Locator;
  readonly userSpinner: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.heading = screen.getByText('Assign Asset', { exact: true });
    this.selectedCount = this.id('total_selected_asset');
    this.selectAssetButton = this.id('add_asset_btn');
    this.typeSpinner = this.id('transaction_type_spinner');
    this.postalCode = this.id('asset_location_postalcode');
    this.block = this.id('asset_location_block');
    this.level = this.id('asset_location_level');
    this.room = this.id('asset_location_room');
    this.remarks = this.id('asset_remarks');
    this.completeButton = this.id('complete_button');
    this.keywords = this.id('et_keywords');
    this.searchButton = this.id('btn_show_result');
    this.resultIds = this.id('tv_lmsAssetId');
    this.addButtons = this.id('action_box');
    this.closeSheetButton = this.id('close_btn');
    this.logs1Filter = this.id('spinner_select_assignee_logs1');
    this.resultTotal = this.id('total_result');
    this.noResults = screen.getByText('Nothing to show yet', { exact: true });
    this.roleSpinner = this.id('spinner_select_role');
    this.userSpinner = this.id('spinner_select_user');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
    await expect(this.selectedCount).toHaveText(/^\d+$/);
  }

  /** Select Asset: search the Asset ID, add it with "+", close the sheet. */
  async selectAsset(assetId: string): Promise<void> {
    await this.selectAssetButton.tap();
    await this.keywords.fill(assetId);
    await this.hideKeyboard();
    await this.searchButton.tap();
    await expect(this.resultIds.and(this.screen.getByText(assetId, { exact: true }))).toBeVisible({ timeout: 30_000 });
    // One result for an exact Asset ID: its "+" is the first action box.
    await this.addButtons.first().tap();
    await this.closeSheetButton.tap();
    await expect(this.selectedCount).toHaveText('1', { timeout: 15_000 });
  }

  /**
   * Select Asset filtered by Assignee (LOGS1) = the officer (name matched case-insensitively): add the first
   * result and close the sheet. Returns its Asset ID, or undefined (sheet closed) when the officer is not
   * offered or owns no selectable asset (assets in an open transaction are not listed).
   */
  async selectFirstAssetOf(officer: string): Promise<string | undefined> {
    await this.selectAssetButton.tap();
    await expect(this.logs1Filter).toBeVisible({ timeout: 15_000 });
    // The LOGS1 list of a unit is short: read what the dropdown shows first, scroll only when needed.
    const name =
      (await this.firstOptionsOf(this.logs1Filter)).find((o) => sameName(o, officer)) ??
      (await this.optionsOf(this.logs1Filter)).find((o) => sameName(o, officer));
    if (name) {
      await this.pick(this.logs1Filter, name);
      await this.searchButton.tap();
      await expect(this.resultTotal.or(this.noResults)).toBeVisible({ timeout: 30_000 });
      if (await this.resultTotal.isVisible()) {
        const [first] = await this.textsOnScreen({ resourceId: 'tv_lmsAssetId' });
        if (first) {
          await this.addButtons.first().tap();
          await this.closeSheetButton.tap();
          await expect(this.selectedCount).toHaveText('1', { timeout: 15_000 });
          return first;
        }
      }
    }
    await this.closeSheetButton.tap();
    return undefined;
  }

  /** ASSIGN: the users the form offers for a role (picks the role; scrolls the whole list). */
  async usersFor(role: string): Promise<string[]> {
    await this.pickType('ASSIGN');
    await this.pick(this.roleSpinner, role);
    await expect(this.roleSpinner.getByTestId('text1')).toHaveText(role);
    return (await this.optionsOf(this.userSpinner)).filter((u) => u !== 'Select User');
  }

  /**
   * ASSIGN the selected asset to a role and user (user matched case-insensitively: the bottom bar writes
   * names in capitals), then Complete. Returns the user as the form spells it.
   */
  async assignTo(role: string, user: string): Promise<string> {
    const name = (await this.usersFor(role)).find((u) => sameName(u, user));
    if (!name) throw new Error(`The Assign form offers no "${user}" for ${role}`);
    await this.chooseUserAndComplete(name);
    return name;
  }

  /** After usersFor(role): pick the user (exact text from the list) and Complete. */
  async chooseUserAndComplete(name: string): Promise<void> {
    await this.pick(this.userSpinner, name);
    await expect(this.userSpinner.getByTestId('text1')).toHaveText(name);
    await this.complete();
  }

  /** Back to the home screen (the toolbar arrow; Back does the same). */
  async close(): Promise<void> {
    await this.screen.pressButton('BACK');
    await expect(this.heading).toBeHidden({ timeout: 15_000 });
  }

  async pickType(type: TransactionType): Promise<void> {
    await this.pick(this.typeSpinner, type);
    await expect(this.typeSpinner.getByTestId('text1')).toHaveText(type);
  }

  /** Text of a form field (the empty fields report their hint, e.g. "Block"). */
  private async text(field: Locator): Promise<string> {
    await field.scrollIntoViewIfNeeded();
    return (await field.getText()).trim();
  }

  /** The Relocate form as pre-filled for the selected asset (waits for the postal code to load). */
  async readRelocateForm(): Promise<RelocateForm> {
    await expect(this.postalCode).toHaveText(/^\d{6}$/, { timeout: 30_000 });
    return {
      postalCode: await this.text(this.postalCode),
      block: await this.text(this.block),
      level: await this.text(this.level),
      room: await this.text(this.room),
      remarks: await this.text(this.remarks),
    };
  }

  /** Replace a field's text (empty string clears it). */
  async setField(field: Locator, value: string): Promise<void> {
    await field.scrollIntoViewIfNeeded();
    if (value) await field.fill(value);
    else await field.clear();
    await this.hideKeyboard();
  }

  /** Complete; the app resets the form when the transaction is saved. */
  async complete(): Promise<void> {
    await this.completeButton.scrollIntoViewIfNeeded();
    await this.completeButton.tap();
    await expect(this.selectedCount).toHaveText('0', { timeout: 30_000 });
  }

  /** Relocate one asset to a new Room No, with these remarks (empty = none). */
  async relocate(assetId: string, room: string, remarks: string): Promise<void> {
    await this.selectAsset(assetId);
    await this.pickType('RELOCATE');
    await this.readRelocateForm();
    await this.setField(this.room, room);
    await this.setField(this.remarks, remarks);
    await this.complete();
  }
}
