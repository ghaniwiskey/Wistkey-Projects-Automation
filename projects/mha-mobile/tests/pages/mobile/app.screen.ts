import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';

/** The part of mobilewright's view tree nodes these screens read. */
type TreeNode = {
  type: string;
  identifier?: string;
  text?: string;
  bounds?: { x: number; y: number; width: number; height: number };
  children?: TreeNode[];
};

/**
 * Base of the MHA app's screen objects (native Android, driven by mobilewright's `screen`).
 * Elements are found by their Android resource-id: screen.getByTestId('switch_btn') matches
 * "com.iconsult.mhasgtwo:id/switch_btn". The app has no accessibility labels.
 *
 * Dialogs come in two kinds:
 * - Android AlertDialog (login errors): title #alertTitle, text #message, OK #button1.
 * - The app's own two-button dialog: a question text, left button #left_btn (CONFIRM, EXIT ANYWAY) and
 *   right button #right_btn (CANCEL, GO BACK). Its title id (#title) is also used by the FAVE tab titles,
 *   so the question is found by its text.
 */
export abstract class AppScreen {
  readonly screen: Screen;

  constructor(screen: Screen) {
    this.screen = screen;
  }

  protected id(resourceId: string): Locator {
    return this.screen.getByTestId(resourceId);
  }

  get alertTitle(): Locator {
    return this.id('alertTitle');
  }

  get alertMessage(): Locator {
    return this.id('message');
  }

  get alertOk(): Locator {
    return this.id('button1');
  }

  get dialogLeftButton(): Locator {
    return this.id('left_btn');
  }

  get dialogRightButton(): Locator {
    return this.id('right_btn');
  }

  /** Answer the app's two-button dialog: 'left' = CONFIRM / EXIT ANYWAY, 'right' = CANCEL / GO BACK. */
  async answer(question: string | RegExp, button: 'left' | 'right'): Promise<void> {
    const text = this.screen.getByText(question);
    // Some questions follow a download or upload (offline FAVE), so allow a minute.
    await expect(text).toBeVisible({ timeout: 60_000 });
    await (button === 'left' ? this.dialogLeftButton : this.dialogRightButton).tap();
    await expect(text).toBeHidden({ timeout: 30_000 });
  }

  /**
   * Hide the soft keyboard. Gboard stays open after typing and covers the buttons at the bottom of the
   * screen (LOGIN, SAVE, Search). Back closes it; without a keyboard Back would leave the screen, so call
   * this only right after typing into a field. The keyboard is not part of the view tree, so it cannot be
   * checked first.
   */
  async hideKeyboard(): Promise<void> {
    await this.screen.pressButton('BACK');
  }

  /**
   * Nodes on screen that match, flattened from one view-tree read, in screen order. Reading locators one
   * by one costs a device round trip each (about 5 s while a dropdown is open), so lists are read this way.
   */
  async nodesOnScreen(match: { resourceId?: string; type?: string; text?: string }): Promise<TreeNode[]> {
    const out: TreeNode[] = [];
    const walk = (n: TreeNode) => {
      const idOk = !match.resourceId || (n.identifier ?? '').endsWith(`:id/${match.resourceId}`);
      const typeOk = !match.type || n.type === match.type;
      const textOk = match.text === undefined ? !!n.text?.trim() : n.text?.trim() === match.text;
      if (idOk && typeOk && textOk) out.push(n);
      for (const c of n.children ?? []) walk(c);
    };
    for (const n of (await this.screen.viewTree()) as TreeNode[]) walk(n);
    return out;
  }

  /** Texts of the matching elements on screen (see nodesOnScreen). */
  async textsOnScreen(match: { resourceId?: string; type?: string }): Promise<string[]> {
    return (await this.nodesOnScreen(match)).map((n) => (n.text ?? '').trim());
  }

  /** Rows of an open Spinner dropdown. */
  private static readonly OPTION = 'android.widget.CheckedTextView';

  /** Open a Spinner and wait for its dropdown rows (read from the tree, no locator round trips). */
  private async openDropdown(spinner: Locator): Promise<void> {
    // A tap while a panel is still sliding in (Switch Role right after returning home) can miss the
    // spinner, so tap once more when no dropdown shows up.
    for (let attempt = 0; attempt < 2; attempt++) {
      await spinner.tap();
      // Poll gently: each read is a `uiautomator dump` on the device, and back-to-back dumps of a UI that is
      // not idle yet have crashed the emulator's system server once.
      for (const end = Date.now() + 12_000; Date.now() < end; ) {
        await new Promise((r) => setTimeout(r, 700));
        if ((await this.nodesOnScreen({ type: AppScreen.OPTION })).length > 0) return;
      }
    }
    throw new Error('The dropdown did not open');
  }

  /**
   * Close the dropdown if it is still open (Back closes the popup and keeps the screen). A swipe meant to
   * scroll a short dropdown lands outside it and dismisses it; Back would then close the panel or screen
   * behind it, so it is only pressed while options show.
   */
  private async closeDropdown(): Promise<void> {
    if ((await this.nodesOnScreen({ type: AppScreen.OPTION })).length === 0) return;
    await this.screen.pressButton('BACK');
    await expect(this.screen.getByType(AppScreen.OPTION).first()).toBeHidden();
  }

  private screenHeightPx = 0;

  /** Height of the screen in pixels (from the view tree's root, read once). */
  private async screenHeight(): Promise<number> {
    if (!this.screenHeightPx) {
      const roots = (await this.screen.viewTree()) as TreeNode[];
      this.screenHeightPx = Math.max(0, ...roots.map((n) => (n.bounds?.y ?? 0) + (n.bounds?.height ?? 0))) || 2400;
    }
    return this.screenHeightPx;
  }

  /**
   * Whether a dropdown shows all its rows: a list longer than the screen fills the popup down to the
   * screen's bottom edge, a short one ends well above it. A short list must not be swiped: the swipe lands
   * outside the popup and dismisses it, or near the bottom edge counts as Android's go-home gesture (the
   * app went to the background in MHM-006, 2026-10-20).
   */
  private async dropdownFits(rows: TreeNode[]): Promise<boolean> {
    const bottom = Math.max(0, ...rows.map((n) => (n.bounds?.y ?? 0) + (n.bounds?.height ?? 0)));
    const rowHeight = Math.max(0, ...rows.map((n) => n.bounds?.height ?? 0));
    return bottom + 2 * rowHeight < (await this.screenHeight());
  }

  /**
   * Open a Spinner and pick an option, scrolling the dropdown when it is out of view. The option is
   * tapped at its position from one tree read: a locator tap waits for two identical reads (~10 s here).
   * Android opens a dropdown scrolled to the selected row, so the option may be above it: the search
   * scrolls down to the end first, then back up to the top.
   */
  protected async pick(spinner: Locator, text: string): Promise<void> {
    await this.openDropdown(spinner);
    let direction: 'up' | 'down' = 'up';
    let lastShown = '';
    for (let i = 0; i < 40; i++) {
      const shown = await this.nodesOnScreen({ type: AppScreen.OPTION });
      if (shown.length === 0) break; // a short dropdown, dismissed by the last swipe: all of it was seen
      // A row cut off at the edge of the dropdown is too thin to tap safely; scroll it in first.
      const row = shown.find((n) => n.text?.trim() === text && (n.bounds?.height ?? 0) >= 80);
      if (row?.bounds) {
        await this.screen.tap(Math.round(row.bounds.x + row.bounds.width / 2), Math.round(row.bounds.y + row.bounds.height / 2));
        await expect(this.screen.getByType(AppScreen.OPTION).first()).toBeHidden();
        return;
      }
      if (i === 0 && (await this.dropdownFits(shown))) break; // every row is on screen
      const key = shown.map((n) => n.text?.trim()).join('|');
      if (key === lastShown) {
        if (direction === 'down') break; // top reached too
        direction = 'down'; // end of the list reached: go back up
      }
      lastShown = key;
      await this.screen.swipe(direction, { distance: 600 });
    }
    await this.closeDropdown();
    throw new Error(`The dropdown does not offer "${text}"`);
  }

  /** All options of a Spinner (scrolls through the dropdown, then closes it). */
  protected async optionsOf(spinner: Locator): Promise<string[]> {
    await this.openDropdown(spinner);
    const seen: string[] = [];
    for (let unchanged = 0, i = 0; unchanged < 2 && i < 20; i++) {
      const before = seen.length;
      const rows = await this.nodesOnScreen({ type: AppScreen.OPTION });
      if (rows.length === 0) break; // a short dropdown, dismissed by the last swipe: all of it was seen
      for (const t of rows.map((n) => (n.text ?? '').trim())) if (!seen.includes(t)) seen.push(t);
      if (i === 0 && (await this.dropdownFits(rows))) break; // every row is on screen
      unchanged = seen.length === before ? unchanged + 1 : 0;
      if (unchanged < 2) await this.screen.swipe('up', { distance: 600 });
    }
    await this.closeDropdown();
    return seen;
  }

  /** The options a Spinner shows without scrolling. */
  protected async firstOptionsOf(spinner: Locator): Promise<string[]> {
    await this.openDropdown(spinner);
    const shown = await this.textsOnScreen({ type: AppScreen.OPTION });
    await this.closeDropdown();
    return shown;
  }
}
