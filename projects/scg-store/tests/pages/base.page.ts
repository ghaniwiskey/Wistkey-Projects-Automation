import { Page, Locator, expect } from '@playwright/test';

/**
 * Shared header elements. The site renders the header twice (desktop + mobile),
 * so every header locator is filtered to the visible copy.
 */
export abstract class BasePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly cartBadge: Locator;
  readonly accountLink: Locator;
  /** Header account icon in its logged-in state. */
  readonly loggedInIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('searchbox', { name: 'Search' }).filter({ visible: true }).first();
    this.searchButton = page.locator('button.quick-search-submit').filter({ visible: true }).first();
    this.searchResults = page.getByRole('listbox', { name: 'Search results' });
    this.cartBadge = page.locator('a.icon-button[href="/checkout"]').filter({ visible: true }).first();
    this.accountLink = page.locator('a.icon-button[href="/my-account"], a.icon-button[href^="/login"]').filter({ visible: true }).first();
    this.loggedInIcon = page.locator('a.icon-button.loggedIn').filter({ visible: true }).first();
  }

  /**
   * First-time visitors get a "Choose your location" modal that blocks the page.
   * Register once per test; Playwright auto-confirms it whenever it appears.
   */
  static async handleLocationModal(page: Page): Promise<void> {
    const modal = page.getByRole('dialog').filter({ hasText: 'Choose your location' });
    await page.addLocatorHandler(modal, async () => {
      await modal.getByRole('button', { name: 'Confirm' }).click();
      await expect(modal).toBeHidden();
    });
  }

  /** Navigate and wait for the client-side app to finish hydrating. */
  async navigate(path = '/'): Promise<void> {
    const res = await this.page.goto(path);
    // The store's WAF returns a bare 403 page when it rate-limits/blocks an IP.
    expect(res?.status(), `${path} is not blocked by the site firewall (got HTTP ${res?.status()})`).not.toBe(403);
    await this.waitForHydration();
  }

  /**
   * The site is an Astro app: server-rendered HTML, then React "islands" hydrate.
   * Interacting too early does nothing (Add to Cart) or triggers a native form submit
   * (login -> /login?email=...). Astro removes the `ssr` attribute from each
   * <astro-island> once it has hydrated, so wait until none are left.
   */
  async waitForHydration(): Promise<void> {
    await this.page.waitForLoadState('load');
    await expect(this.page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15_000 });
    await expect(this.page.locator('html')).not.toHaveClass(/nprogress-busy/);
  }

  /** Total item quantity shown on the header cart icon. */
  async cartCount(): Promise<number> {
    await expect(this.cartBadge).toHaveText(/\d+/);
    return Number((await this.cartBadge.innerText()).trim());
  }

  /** Submit a search and land on the search results page. */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await expect(this.page.getByText(`Search '${query}'`)).toBeVisible();
    await expect(this.page.getByText(/Items \d+ to \d+ of \d+/)).toBeVisible();
  }

  /** Search, then open the product whose title matches exactly. */
  async searchAndOpenProduct(productName: string): Promise<void> {
    await this.search(productName);
    await this.page.getByRole('link', { name: productName, exact: true }).filter({ visible: true }).first().click();
  }
}
