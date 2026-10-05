import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailTab: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // Form labels are not linked to inputs, so use stable name/autocomplete attributes.
    this.emailTab = page.getByRole('link', { name: 'Email', exact: true });
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[autocomplete="current-password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
    await expect(this.page.getByRole('heading', { name: 'Log In', level: 1 })).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Successful login redirects away from /login and marks the account icon as logged in.
    await expect(this.page).not.toHaveURL(/\/login/);
    await expect(this.page.locator('a.icon-button.loggedIn').filter({ visible: true }).first()).toBeVisible();
  }
}
