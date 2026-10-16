import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';

/** What mobilewright's driver offers for typing (Screen keeps it private). */
type TypingDriver = { typeText(text: string): Promise<void> };

/**
 * Login screen: username (the account's full NRIC on mobile), password (empty for the passwordless UAT
 * account), agency spinner (SPF) and LOGIN. A refused login shows an AlertDialog "Login failed" /
 * "Your username or password is incorrect.\n Please try again.". After a successful login the app preloads
 * data (postal codes) for a few seconds, then shows the home screen.
 */
export class LoginScreen extends AppScreen {
  readonly username: Locator;
  readonly password: Locator;
  readonly agency: Locator;
  readonly loginButton: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.username = this.id('et_username');
    this.password = this.id('password');
    this.agency = this.id('spinner_text');
    this.loginButton = this.id('login_btn');
  }

  async expectShown(): Promise<void> {
    await expect(this.loginButton).toBeVisible({ timeout: 30_000 });
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.agency).toHaveText('SPF');
  }

  /**
   * Type a value without it showing up in the report: mobilewright's locator.fill() puts the typed text
   * in its step title ('locator.fill("...")'), and the mobile login is a full NRIC. So the field is
   * tapped and cleared through the locator and the value typed through the driver directly.
   */
  private async typePrivately(field: Locator, value: string): Promise<void> {
    await field.clear();
    await (this.screen as unknown as { driver: TypingDriver }).driver.typeText(value);
  }

  /**
   * Log in with the account (agency SPF). Waits until the login screen is gone. When the app refuses
   * the login, the username is cleared before failing, so a failure screenshot never shows it.
   */
  async login(username: string, password = ''): Promise<void> {
    // The home screen's bottom bar (role | cost centre) shows once the login and the postal code
    // preload (a few seconds on UAT) are done.
    const home = this.id('tv_role_centercode');
    let refused = '';
    try {
      await this.typePrivately(this.username, username);
      if (password) await this.typePrivately(this.password, password);
      await this.hideKeyboard();
      await this.loginButton.tap();
      await expect(home.or(this.alertTitle)).toBeVisible({ timeout: 60_000 });
      if (await this.alertTitle.isVisible()) refused = `${await this.alertTitle.getText()}: ${await this.alertMessage.getText()}`;
    } catch (e) {
      refused = (e as Error).message.split('\n')[0];
    }
    if (refused) {
      if (await this.alertOk.isVisible()) await this.alertOk.tap();
      await this.username.clear().catch(() => undefined);
      throw new Error(`Mobile login with the .env account failed: ${refused}`);
    }
  }

  /** A login the app refuses: returns [title, message] of the error dialog and closes it with OK. */
  async attemptLogin(username: string, password = ''): Promise<[string, string]> {
    await this.username.fill(username);
    if (password) await this.password.fill(password);
    await this.hideKeyboard();
    await this.loginButton.tap();
    await expect(this.alertTitle).toBeVisible({ timeout: 30_000 });
    const result: [string, string] = [(await this.alertTitle.getText()).trim(), (await this.alertMessage.getText()).trim()];
    await this.alertOk.tap();
    await expect(this.alertTitle).toBeHidden();
    return result;
  }
}
