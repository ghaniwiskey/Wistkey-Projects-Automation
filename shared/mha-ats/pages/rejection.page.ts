import { Page, expect } from '@playwright/test';
import { WizardPage } from './wizard.page';

/**
 * Asset > Rejection (/Asset/Rejection): Reinstate wizard for REJECTED assets.
 * Start (Reinstate) > Asset (columns include Rejected By) > Review > Reason (select2) > End.
 * A reinstated asset gets its status from before the rejection (NEW, TRANSFER or PROGRESS).
 */
export class RejectionPage extends WizardPage {
  constructor(page: Page) {
    super(page);
  }

  async start(): Promise<void> {
    await this.navigate('Asset/Rejection');
    await expect(this.stepHeading('Reinstate - Start')).toBeVisible();
    await this.nextToChooseAsset('Reinstate - Choose Asset');
  }

  /** Row of a rejected asset in the Choose Asset step (after start() and searchAsset()). */
  rejectedRow(assetId: string) {
    return this.assetRows.filter({ hasText: `Asset ID: ${assetId}` });
  }

  async isRejected(assetId: string): Promise<boolean> {
    await this.start();
    await this.searchAsset(assetId);
    return (await this.rejectedRow(assetId).count()) > 0;
  }

  /** From the Choose Asset step: tick the asset, review, pick the reason and submit. */
  async reinstateSelected(assetId: string, reason: string): Promise<string> {
    await this.selectAsset(assetId);
    await this.next();
    await expect(this.stepHeading(/ - Review$/)).toBeVisible();
    await this.next();
    await this.pickSelect2(this.page.locator('form'), 'Reason', reason);
    return this.submit();
  }

  async reinstate(assetId: string, reason: string): Promise<string> {
    await this.start();
    await this.searchAsset(assetId);
    return this.reinstateSelected(assetId, reason);
  }
}
