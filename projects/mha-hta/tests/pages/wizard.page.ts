import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Shared parts of the ATS step wizards (KTStepper): Assignment Create, Registration, Rejection,
 * New Asset Create. Each has a Start step (type radios), a Choose Asset DataTable (#tblist) with
 * keyword search and an "N asset(s) selected" counter, a Review table, form steps and an End step
 * with an <h2> result message. Next/Back/Submit are shared buttons; Submit is the write step.
 * Some pages keep several copies of a field in hidden panels, so locators keep only visible ones.
 */
export abstract class WizardPage extends BasePage {
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly submitButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly selectedCount: Locator;
  readonly assetRows: Locator;
  readonly resultHeading: Locator;
  /** The End step (result heading plus its detail line, e.g. "1 Asset successfully registered."). */
  readonly endStep: Locator;

  constructor(page: Page) {
    super(page);
    this.nextButton = page.getByRole('button', { name: 'Next', exact: true });
    this.backButton = page.getByRole('button', { name: 'Back', exact: true });
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
    this.searchInput = page.getByPlaceholder('Asset ID/Asset ID2/Serial No/Desc').filter({ visible: true });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.selectedCount = page.getByRole('heading', { name: /asset\(s\) selected/ }).filter({ visible: true });
    this.assetRows = page.locator('#tblist tbody tr');
    this.resultHeading = page.locator('form').getByRole('heading', { level: 2 }).filter({ visible: true });
    this.endStep = page.locator('form').filter({ has: page.getByRole('heading', { level: 2 }).filter({ visible: true }) });
  }

  /** Step heading such as "Relocate - Choose Asset" (whitespace in the markup is normalised). */
  stepHeading(text: string | RegExp): Locator {
    return this.page.getByRole('heading', { name: text }).filter({ visible: true });
  }

  /** The clickable card of a Start-step radio (the radios are hidden `btn-check` inputs). */
  protected radioCard(radioId: string): Locator {
    return this.page.locator(`label[for="${radioId}"]`);
  }

  /** Next from the Start step: the Choose Asset table loads by ajax. */
  protected async nextToChooseAsset(heading: string): Promise<void> {
    await this.reloadsTable('#tblist', () => this.nextButton.click());
    await expect(this.stepHeading(heading)).toBeVisible();
  }

  async searchAsset(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.reloadsTable('#tblist', () => this.searchButton.filter({ visible: true }).first().click());
  }

  /** Tick an asset in the Choose Asset table (the app tracks the selection, not the checkbox state). */
  async selectAsset(assetId: string): Promise<void> {
    await this.assetRows.filter({ hasText: `Asset ID: ${assetId}` }).getByRole('checkbox').click();
    await expect(this.selectedCount).toHaveText(/^\s*1\s*asset\(s\) selected/);
  }

  /** Search, tick and go through Choose Asset and Review. */
  async pickAsset(assetId: string): Promise<void> {
    await this.searchAsset(assetId);
    await this.selectAsset(assetId);
    await this.next();
    await expect(this.stepHeading(/ - Review$/)).toBeVisible();
    await this.next();
  }

  async next(): Promise<void> {
    await this.nextButton.click();
  }

  /** Submit the last step and return the End-step message. */
  async submit(): Promise<string> {
    await this.submitButton.click();
    await expect(this.resultHeading).toBeVisible({ timeout: 30_000 });
    return (await this.resultHeading.innerText()).replace(/\s+/g, ' ').trim();
  }
}
