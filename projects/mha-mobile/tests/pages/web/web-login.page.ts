import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';

/** MHA web login card (/Account/LoginBk?ReturnUrl=%2F; the base URL redirects here). Lands on /IndexBk. */
export class WebLoginPage extends AppPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('User name');
    this.passwordInput = page.getByPlaceholder('Password');
    // The button reads "Login" (plus a hidden "Please wait..." label while the page loads).
    this.loginButton = page.getByRole('button', { name: /^Login/ });
  }

  async goto(): Promise<void> {
    await this.navigate('./');
    await expect(this.page).toHaveURL(/\/Account\/Login/);
    await expect(this.usernameInput).toBeVisible();
  }

  /** Username login; a server error shows in a SweetAlert popup, whose text becomes the failure message. */
  async login(username: string, password = ''): Promise<void> {
    await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
    const error = this.page.locator('.swal2-popup .swal2-html-container');
    try {
      await expect(this.page).not.toHaveURL(/\/Account\/Login/, { timeout: 30_000 });
    } catch (e) {
      if (await error.isVisible()) throw new Error(`MHA web login failed: ${(await error.innerText()).slice(0, 200)}`);
      throw e;
    }
  }
}
