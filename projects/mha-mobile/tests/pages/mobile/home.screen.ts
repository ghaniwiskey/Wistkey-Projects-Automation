import { expect } from '@mobilewright/test';
import type { Locator, Screen } from 'mobilewright';
import { AppScreen } from './app.screen';
import type { LoginScreen } from './login.screen';

/**
 * Home: tiles (Search Asset, Stocktake, New Asset, Settings for Stocktaker; none for Agency Admin), the
 * announcement and the bottom bar "<OFFICER NAME>" / "<Role> | <cost centre>" with Switch.
 *
 * Switch opens the "Switch Role" panel: Select Role and Select Cost Center spinners, Confirm, Logout and a
 * close (X) button. Select Cost Center does not reliably follow the role picked in the panel (it may list
 * the cost centres of the active role, or all 37 agency cost centres), so the wanted cost centre is picked
 * by name, scrolling the dropdown.
 *
 * The app keeps the session across restarts, but the server ends it about 10 minutes after login
 * (BUG-001); the next server action then drops the app on the login screen. Tests therefore log in fresh.
 */
export class HomeScreen extends AppScreen {
  readonly officer: Locator;
  readonly roleAndCostCentre: Locator;
  readonly switchButton: Locator;
  readonly tiles: Locator;
  readonly panelTitle: Locator;
  readonly roleSpinner: Locator;
  readonly costCentreSpinner: Locator;
  readonly confirmButton: Locator;
  readonly logoutButton: Locator;
  readonly closePanelButton: Locator;

  constructor(screen: Screen) {
    super(screen);
    this.officer = this.id('tv_username');
    this.roleAndCostCentre = this.id('tv_role_centercode');
    this.switchButton = this.id('switch_btn');
    this.tiles = this.id('menu_text');
    this.panelTitle = screen.getByText('Switch Role', { exact: true });
    this.roleSpinner = this.id('spinner_select_role');
    this.costCentreSpinner = this.id('spinner_select_costcenter');
    this.confirmButton = this.id('btn_confirm');
    this.logoutButton = this.id('btn_logout');
    this.closePanelButton = this.id('close_btn');
  }

  tile(name: string): Locator {
    return this.tiles.and(this.screen.getByText(name, { exact: true }));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.roleAndCostCentre).toBeVisible({ timeout: 60_000 });
    await expect(this.officer).toHaveText(/\S/);
  }

  /** Officer name as the bottom bar shows it (upper case, e.g. "TAN JUN YONG SHAWN"). */
  async officerName(): Promise<string> {
    return (await this.officer.getText()).trim();
  }

  /** Active role and cost centre from the bottom bar ("Stocktaker | 332600"). */
  async active(): Promise<{ role: string; costCentre: string }> {
    const [role, costCentre] = (await this.roleAndCostCentre.getText()).split('|').map((s) => s.trim());
    return { role, costCentre };
  }

  async tileNames(): Promise<string[]> {
    await expect(this.tiles.first()).toBeVisible();
    return this.textsOnScreen({ resourceId: 'menu_text' });
  }

  async openTile(name: string): Promise<void> {
    await this.tile(name).tap();
    await expect(this.roleAndCostCentre).toBeHidden({ timeout: 30_000 });
  }

  async openSwitch(): Promise<void> {
    await this.switchButton.tap();
    await expect(this.panelTitle).toBeVisible({ timeout: 30_000 });
  }

  async closeSwitch(): Promise<void> {
    await this.closePanelButton.tap();
    await expect(this.panelTitle).toBeHidden();
  }

  /** The value a spinner of the panel shows (its child text). */
  private selected(spinner: Locator): Locator {
    return spinner.getByTestId('text1');
  }

  /** Roles offered in the open Switch Role panel. */
  async roleOptions(): Promise<string[]> {
    return this.optionsOf(this.roleSpinner);
  }

  /** Pick a role in the open panel (no Confirm). */
  async pickRole(role: string): Promise<void> {
    if ((await this.selected(this.roleSpinner).getText()).trim() !== role) await this.pick(this.roleSpinner, role);
    await expect(this.selected(this.roleSpinner)).toHaveText(role);
  }

  /** Cost centres the open panel offers for the role picked in it (scrolls the whole list: slow). */
  async costCentreOptions(): Promise<string[]> {
    return this.optionsOf(this.costCentreSpinner);
  }

  /** The cost centres the open dropdown shows without scrolling (the first ten or so). */
  async firstCostCentreOptions(): Promise<string[]> {
    return this.firstOptionsOf(this.costCentreSpinner);
  }

  /** Switch role and cost centre: Switch > role > cost centre > Confirm; waits for the bottom bar. */
  async switchTo(role: string, costCentre: string): Promise<void> {
    await this.openSwitch();
    await this.pickRole(role);
    await this.pick(this.costCentreSpinner, costCentre);
    await expect(this.selected(this.costCentreSpinner)).toHaveText(costCentre);
    await this.confirmButton.tap();
    await expect(this.panelTitle).toBeHidden({ timeout: 30_000 });
    await expect(this.roleAndCostCentre).toHaveText(`${role} | ${costCentre}`, { timeout: 30_000 });
  }

  /**
   * Log out (Switch > Logout) when the app restored a session; returns when the login screen shows.
   * Unsent sightings make the app ask first ("... still not submitted, do you want to log out?"); the
   * answer is yes. A session the server already ended can send the app to the login screen by itself.
   */
  async ensureLoggedOut(login: LoginScreen): Promise<void> {
    await expect(login.loginButton.or(this.roleAndCostCentre)).toBeVisible({ timeout: 60_000 });
    if (await login.loginButton.isVisible()) return;
    await this.switchButton.tap();
    await expect(this.panelTitle.or(login.loginButton)).toBeVisible({ timeout: 30_000 });
    if (await this.panelTitle.isVisible()) {
      await this.logoutButton.tap();
      const unsent = this.screen.getByText(/still not submitted/);
      await expect(unsent.or(login.loginButton)).toBeVisible({ timeout: 30_000 });
      if (await unsent.isVisible()) await this.dialogLeftButton.tap();
    }
    await login.expectShown();
  }
}
