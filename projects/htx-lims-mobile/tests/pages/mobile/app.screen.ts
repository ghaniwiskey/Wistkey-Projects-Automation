import type { Locator, Screen } from 'mobilewright';

/**
 * Base of the HTX LIMS app's screen objects (native Android, Kotlin/Jetpack Compose, driven by mobilewright's
 * `screen`). Compose gives the views no resource-ids or accessibility labels, so elements are found by their
 * visible text; buttons are a clickable View around a TextView, and tapping the text taps the button.
 * Text fields are plain EditTexts whose hint is a separate TextView, so they are found by position.
 */
export abstract class AppScreen {
  static readonly EDIT_TEXT = 'android.widget.EditText';
  readonly screen: Screen;

  constructor(screen: Screen) {
    this.screen = screen;
  }

  /** An element by its exact visible text (button labels, titles), or matching a RegExp. */
  text(value: string | RegExp): Locator {
    return typeof value === 'string' ? this.screen.getByText(value, { exact: true }) : this.screen.getByText(value);
  }

  /** The nth text field on screen (0-based, top to bottom). */
  protected field(index: number): Locator {
    return this.screen.getByType(AppScreen.EDIT_TEXT).nth(index);
  }

  /**
   * Check that every text is on screen (exact match) with one view-tree read. Much faster than one locator
   * assertion per text (each costs about 6 s on this Compose app). Fails listing the missing ones.
   */
  async expectTexts(wanted: string[]): Promise<void> {
    const texts = await this.textsOnScreen();
    const missing = wanted.filter((w) => !texts.includes(w));
    if (missing.length) throw new Error(`Not on screen: ${missing.join(', ')}. On screen: ${texts.join(' | ')}`);
  }

  /** Visible texts in screen order, from one view-tree read (one device round trip). */
  async textsOnScreen(): Promise<string[]> {
    type Node = { text?: string; children?: Node[] };
    const out: string[] = [];
    const walk = (n: Node) => {
      if (n.text?.trim()) out.push(n.text.trim());
      for (const c of n.children ?? []) walk(c);
    };
    for (const n of (await this.screen.viewTree()) as Node[]) walk(n);
    return out;
  }
}
