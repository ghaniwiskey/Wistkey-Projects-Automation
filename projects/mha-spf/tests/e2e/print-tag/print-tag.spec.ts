import { test, expect } from '../../fixtures/pages.fixture';

// Print Tag works on the first asset of the Choose Asset list (no fixed asset). The test machines have no
// Zebra printer, so a reprint ends with the asset in the "failed to print" list and nothing reprinted.
test.describe('Print Tag', () => {
  test.use({ role: 'logs1' });

  // Test case: projects/mha-spf/cases/print-tag/SPF-029-*.md
  test('SPF-029: logs1 reprints an rfid tag without a printer and the asset is listed as failed @regression @writes', async ({ printTagPage }) => {
    test.slow();
    let asset = '';
    let reason = '';

    await test.step('1-2. Choose Asset needs at least one asset', async () => {
      await printTagPage.start();
      asset = await printTagPage.firstAssetId();
      await printTagPage.next();
      expect(await printTagPage.acknowledge(/tick at least one asset/)).toBe('Please tick at least one asset to process.');
      await expect(printTagPage.stepHeading('Print Tag - Choose Asset')).toBeVisible();
    });

    await test.step('3. Review lists only the chosen asset', async () => {
      await printTagPage.goToReason(asset); // checks the single Review row
    });

    await test.step('4. Submit with the first reason: the printer is not reachable', async () => {
      [reason] = await printTagPage.reasons();
      await printTagPage.pickReason(reason);
      const printerError = await printTagPage.submitReprint();
      expect(printerError).toMatch(/^An error occured while attempting to connect to your Zebra Printer\./);
    });

    await test.step('5. End step: nothing reprinted, the asset is listed as failed', async () => {
      await expect(printTagPage.endHeading).toHaveText('RFID tag printed');
      await expect(printTagPage.endSummary).toHaveText('0 Asset has their RFID Tag reprinted.');
      await expect(printTagPage.failedHeading).toHaveText('Below are the asset(s) that failed to print:');
      await expect(printTagPage.failedRows).toHaveCount(1);
      await expect(printTagPage.failedRow(asset)).toHaveCount(1);
    });
  });

  // Test case: projects/mha-spf/cases/print-tag/SPF-030-*.md
  // Read-only: the wizard is never submitted with a valid reason.
  test('SPF-030: print tag reason is required and others needs remarks of at most 200 characters @regression', async ({ printTagPage }) => {
    await test.step('1. Go to the Reason step with the first asset', async () => {
      await printTagPage.start();
      await printTagPage.goToReason(await printTagPage.firstAssetId());
      await expect(printTagPage.selectedReason).toHaveText('WEAR & TEAR');
      expect(await printTagPage.reasons()).toEqual(expect.arrayContaining(['Defaced', 'Faulty Tag', 'LOST', 'OTHER', 'Printing Error', 'WEAR & TEAR']));
    });

    await test.step('2. An empty reason is refused', async () => {
      await printTagPage.pickReason('Select Reason');
      await printTagPage.submitReason();
      await expect(printTagPage.reasonRequired).toBeVisible();
      await expect(printTagPage.stepHeading('Print Tag - Reason')).toBeVisible();
    });

    await test.step('3. OTHER needs remarks', async () => {
      await printTagPage.pickReason('OTHER');
      await expect(printTagPage.remarks).toBeVisible();
      await printTagPage.submitReason();
      await expect(printTagPage.remarksRequired).toBeVisible();
      await expect(printTagPage.stepHeading('Print Tag - Reason')).toBeVisible();
    });

    await test.step('4. Remarks stop at 200 characters', async () => {
      await printTagPage.remarks.pressSequentially('x'.repeat(205));
      await expect(printTagPage.remarks).toHaveValue('x'.repeat(200));
      await expect(printTagPage.remarksCounter).toHaveText(/^\s*200 \/ 200\s*$/);
    });
  });
});
