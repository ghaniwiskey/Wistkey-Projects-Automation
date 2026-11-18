import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';

/** What mobilewright's driver offers for typing (Screen keeps it private). */
type TypingDriver = { typeText(text: string): Promise<void> };

/**
 * Login: "HTX Inventory", "Welcome back", Username, Password (with Show), Sign in. The app takes the HTX LIMS
 * web accounts. After a successful sign-in it downloads the device data and shows a "Data downloaded" dialog
 * (Pre Check-in list, storage locations, stocktake lists) with OK, then the Dashboard.
 */
export class LoginScreen extends AppScreen {
  readonly title: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;
  readonly dataDownloadedTitle: Locator;
  readonly dataDownloadedOk: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.title = this.text('Welcome back');
    this.username = this.field(0);
    this.password = this.field(1);
    this.signInButton = this.text('Sign in');
    this.dataDownloadedTitle = this.text('Data downloaded');
    this.dataDownloadedOk = this.text('OK');
  }

  async expectShown(): Promise<void> {
    await expect(this.title).toBeVisible({ timeout: 30_000 });
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /**
   * Type a value without it showing up in the report: locator.fill() puts the text in its step title, so the
   * field is focused through the locator and the value typed through the driver directly. tap() instead of
   * clear(): the fields are empty after a logout, and clear() costs ~18 s here (README > Speed).
   */
  private async typePrivately(field: Locator, value: string): Promise<void> {
    await field.tap();
    await (this.screen as unknown as { driver: TypingDriver }).driver.typeText(value);
  }

  /** Sign in and close the "Data downloaded" dialog; ends on the Dashboard. */
  async login(username: string, password: string): Promise<void> {
    await this.typePrivately(this.username, username);
    await this.typePrivately(this.password, password);
    await this.screen.pressButton('BACK'); // hide the keyboard, it covers Sign in
    await this.signInButton.tap();
    await expect(this.dataDownloadedTitle).toBeVisible({ timeout: 60_000 });
    await this.dataDownloadedOk.tap();
    await expect(this.dataDownloadedTitle).toBeHidden();
  }
}
