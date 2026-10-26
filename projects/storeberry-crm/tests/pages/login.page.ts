import { Page, Locator, expect } from '@playwright/test';
import { AppPage } from '@shared/pages/app.page';
import type { StoreberryAdmin } from '../utils/test-data';

/** Storeberry CRM sign-in form; root redirects to /auth/login. */
export class LoginPage extends AppPage {
  readonly heading: Locator;
  readonly companyInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Log in to your store', level: 2 });
    this.companyInput = page.getByPlaceholder('Company name', { exact: true });
    this.usernameInput = page.getByPlaceholder('Username / Email', { exact: true });
    this.passwordInput = page.getByPlaceholder('Password', { exact: true });
    this.loginButton = page.getByRole('button', { name: 'LOGIN', exact: true });
    this.getStartedLink = page.getByRole('link', { name: /Get Started/ });
  }

  async goto(): Promise<void> {
    await this.navigate('./');
    await expect(this.page).toHaveURL(/\/auth\/login$/);
    await this.expectLoginForm();
  }

  async expectLoginForm(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.companyInput).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(admin: StoreberryAdmin): Promise<void> {
    await this.companyInput.fill(admin.company);
    await this.usernameInput.fill(admin.username);
    await this.passwordInput.fill(admin.password);
    await this.loginButton.click();
    await expect(this.page).not.toHaveURL(/\/auth\/login/);
    await expect(this.getStartedLink).toBeVisible();
  }
}
