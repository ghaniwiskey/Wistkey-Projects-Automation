import { Page, expect } from '@playwright/test';

/**
 * Generic base for page objects of any project. Project-specific base pages
 * (shared header, hydration waits, cookie banners) extend this.
 */
export abstract class AppPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate relative to the project's baseURL and fail fast on an error response. */
  async navigate(path = '/'): Promise<void> {
    const res = await this.page.goto(path);
    expect(res?.status() ?? 200, `${path} responds without an HTTP error`).toBeLessThan(400);
  }
}
