import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '../../pages/app.page';

/** "Asset Tracking System (ATS)" login card. The base URL redirects here (/Account/LoginBk?ReturnUrl=%2F). */
export class LoginPage extends AppPage {
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly ssoButton: Locator;
  readonly userGuidesLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Asset Tracking System (ATS)', level: 1 });
    this.usernameInput = page.getByPlaceholder('User name');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.ssoButton = page.getByRole('button', { name: 'WOG SSO' });
    this.userGuidesLink = page.getByRole('link', { name: 'User Guides' });
  }

  async goto(): Promise<void> {
    await this.navigate('./'); // relative to baseURL
    await expect(this.page).toHaveURL(/\/Account\/Login/);
    await expect(this.heading).toBeVisible();
  }

  /** Username login (not WOG SSO). Passwordless UAT accounts leave the password empty. */
  async login(username: string, password = ''): Promise<void> {
    await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.page).not.toHaveURL(/\/Account\/Login/);
  }

  /**
   * Username login that the app refuses (e.g. an INACTIVE user): returns the error popup's message after
   * closing it. The popup is SweetAlert2 (no stable accessible name, so its class names are used).
   */
  async attemptLogin(username: string, password = ''): Promise<string> {
    await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
    const message = this.page.locator('.swal2-popup .swal2-html-container');
    await expect(message).toHaveText(/\S/);
    const text = (await message.innerText()).trim();
    await this.page.locator('.swal2-popup').getByRole('button', { name: 'Ok', exact: true }).click();
    return text;
  }

  /** Announcement text on the login page (HEADER banner at the top, FOOTER under the login card). */
  announcement(text: string): Locator {
    return this.page.getByText(text, { exact: false });
  }
}
