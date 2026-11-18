import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';
import type { LoginScreen } from './login.screen';

/**
 * Dashboard: "Data update" card (Last updated, Update all data), task tiles (Pre Check-in, Check-in, Check-out,
 * All Assets, Stocktake, Settings, Upload queue) and a bottom bar with the user's name, username and Logout.
 *
 * Logout asks "Log out?" and then DELETES ALL DATA ON THE DEVICE, including records not uploaded yet. So a
 * test logs out only when the Upload queue is empty (ensureLoggedOut checks it).
 */
export class DashboardScreen extends AppScreen {
  readonly title: Locator;
  readonly lastUpdated: Locator;
  readonly updateAllData: Locator;
  readonly logoutButton: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.title = this.text('Choose a task to get started.');
    this.lastUpdated = this.text(/^Last updated: /);
    this.updateAllData = this.text('Update all data');
    this.logoutButton = this.text('Logout');
  }

  async isShown(): Promise<boolean> {
    return this.title.isVisible().catch(() => false);
  }

  /**
   * Wait for the Dashboard, then check the rest in one view-tree read: on this app every locator check costs
   * about 6 s (Compose, uiautomator idle wait), so screens check lists of texts with expectTexts.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible({ timeout: 60_000 });
    await this.expectTexts(['Data update', 'Update all data', 'Logout']);
  }

  tile(title: string): Locator {
    return this.text(title);
  }

  /** The signed-in username from the bottom bar: "<Name>", "<USERNAME>", then Logout. */
  async signedInUsername(): Promise<string> {
    const texts = await this.textsOnScreen();
    const i = texts.indexOf('Logout');
    return i >= 1 ? texts[i - 1] : '';
  }

  /**
   * Records waiting to upload plus failed ones (Upload queue screen: "<n> Waiting to upload", "<n> Upload
   * failed"), then back to the Dashboard. An unreadable count counts as 1, so a test never logs out blindly.
   */
  async pendingUploads(): Promise<number> {
    await this.tile('Upload queue').tap();
    await expect(this.text('Upload failed')).toBeVisible({ timeout: 15_000 });
    const texts = await this.textsOnScreen();
    const before = (label: string) => Number(texts[texts.indexOf(label) - 1]);
    const waiting = before('Waiting to upload');
    const failed = before('Upload failed');
    await this.screen.pressButton('BACK');
    await this.expectLoaded();
    return (Number.isFinite(waiting) ? waiting : 1) + (Number.isFinite(failed) ? failed : 1);
  }

  /**
   * Get to the login screen. When signed in, log out only if nothing waits in the Upload queue (logging out
   * deletes it); otherwise throw, so a test never throws away unsent records.
   */
  async ensureLoggedOut(login: LoginScreen): Promise<void> {
    await expect(this.title.or(login.title)).toBeVisible({ timeout: 60_000 });
    if (!(await this.isShown())) return;
    const pending = await this.pendingUploads();
    if (pending > 0) throw new Error(`The app has ${pending} record(s) in the Upload queue; logging out would delete them. Upload them first.`);
    await this.logoutButton.tap();
    await expect(this.text('Log out?')).toBeVisible();
    await this.text('Log out').tap();
    await login.expectShown();
  }
}
