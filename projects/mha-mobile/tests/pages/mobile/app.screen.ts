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

  /** Close an open dropdown (Back closes the popup and keeps the screen). */
  private async closeDropdown(): Promise<void> {
    await this.screen.pressButton('BACK');
    await expect(this.screen.getByType(AppScreen.OPTION).first()).toBeHidden();
  }

  /**
   * Open a Spinner and pick an option, scrolling the dropdown when it is below the fold. The option is
   * tapped at its position from one tree read: a locator tap waits for two identical reads (~10 s here).
   */
  protected async pick(spinner: Locator, text: string): Promise<void> {
    await this.openDropdown(spinner);
    for (let i = 0; i < 20; i++) {
      // A row cut off at the edge of the dropdown is too thin to tap safely; scroll it in first.
      const row = (await this.nodesOnScreen({ type: AppScreen.OPTION, text })).find((n) => (n.bounds?.height ?? 0) >= 80);
      if (row?.bounds) {
        await this.screen.tap(Math.round(row.bounds.x + row.bounds.width / 2), Math.round(row.bounds.y + row.bounds.height / 2));
        await expect(this.screen.getByType(AppScreen.OPTION).first()).toBeHidden();
        return;
      }
      await this.screen.swipe('up', { distance: 600 });
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
      for (const t of await this.textsOnScreen({ type: AppScreen.OPTION })) if (!seen.includes(t)) seen.push(t);
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
