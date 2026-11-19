import { test, expect } from '../../fixtures/pages.fixture';
import { expect as webExpect } from '@playwright/test';

// Test cases: projects/htx-lims-mobile/cases/flows/HLM-011-*.md, HLM-012-*.md
// End-to-end item workflow across HTX LIMS web (browser `page`) and the handheld app (emulator `screen`).
// Every phone step is slow on this app (README > Speed), so these tests get a long timeout.
test.describe('Item workflow on the handheld', () => {
  test.describe.configure({ timeout: 30 * 60_000 });

  test('HLM-011: a new item is received on the handheld: pre check-in and check-in @smoke @writes', async ({ appDashboard, limsWeb, preCheckInScreen, checkInScreen }) => {
    const description = `QA hlm ${Date.now().toString().slice(-6)}`;
    let itemNo = '';
    await test.step('1. Web: register a Consumable and print its tag on printer "test"', async () => {
      itemNo = await limsWeb.registerItem({ category: 'Consumable', type: 'Glove', description, lot: 'QA-LOT' });
      await limsWeb.printTags([itemNo]);
    });
    const printed = await limsWeb.itemState(itemNo);
    await test.step('2. Handheld: pre check-in by chip code', async () => {
      await preCheckInScreen.open();
      await preCheckInScreen.addTag(printed.chipCode, itemNo);
      expect(await preCheckInScreen.verifyCountAndUpload(1)).toMatch(/All 1 tag\(s\) were pre checked-in\./);
      await preCheckInScreen.goHome();
    });
    await test.step('3. Web: the item is pre checked-in, not IN yet', async () => {
      webExpect((await limsWeb.itemState(itemNo)).status).not.toBe('IN');
    });
    await test.step('4. Handheld: check the item in (default room Airlock 1)', async () => {
      await checkInScreen.open();
      await checkInScreen.addItem(itemNo);
      expect(await checkInScreen.verifyCountAndUpload(1)).toMatch(/1 item\(s\) checked in\./);
      await checkInScreen.goHome();
    });
    await test.step('5. Web: the item is IN in Airlock 1 and not whitelisted', async () => {
      const s = await limsWeb.itemState(itemNo);
      webExpect(s.status).toBe('IN');
      webExpect(s.locationId).toBe(1); // Airlock 1, the check-in screen's default room
      webExpect(s.whitelisted).toBe(false);
    });
    void appDashboard;
  });

  test('HLM-012: an item is loaned out and returned on the handheld @smoke @writes', async ({ appDashboard, limsWeb, checkOutScreen, preCheckInScreen, checkInScreen }) => {
    const item = await limsWeb.findLoanableItem();
    test.skip(!item, 'No IN, non-chemical item that is not whitelisted (HTX LIMS web Item Information)');
    const { itemNo, chipCode } = item!;
    const due = new Date(Date.now() + 24 * 3600_000);
    await test.step(`1. Handheld: check out ${itemNo} on Loan, due tomorrow`, async () => {
      await checkOutScreen.open();
      await checkOutScreen.addLoan(itemNo, due, `QA hlm loan ${Date.now().toString().slice(-6)}`);
      expect(await checkOutScreen.verifyAndConfirm(1)).toMatch(/All 1 item\(s\) were checked out\./);
      await checkOutScreen.goHome();
    });
    await test.step('2. Web: OUT on loan and on the gantry whitelist', async () => {
      const s = await limsWeb.itemState(itemNo);
      webExpect([s.status, s.purpose, s.whitelisted]).toEqual(['OUT', 'LOAN', true]);
    });
    await test.step('3. Handheld: return it, pre check-in then check-in', async () => {
      await preCheckInScreen.open();
      await preCheckInScreen.addTag(chipCode, itemNo);
      expect(await preCheckInScreen.verifyCountAndUpload(1)).toMatch(/All 1 tag\(s\) were pre checked-in\./);
      await preCheckInScreen.goHome();
      await checkInScreen.open();
      await checkInScreen.addItem(itemNo);
      expect(await checkInScreen.verifyCountAndUpload(1)).toMatch(/1 item\(s\) checked in\./);
      await checkInScreen.goHome();
    });
    await test.step('4. Web: IN again, purpose cleared, off the whitelist', async () => {
      const s = await limsWeb.itemState(itemNo);
      webExpect([s.status, s.purpose, s.whitelisted]).toEqual(['IN', '', false]);
    });
    void appDashboard;
  });
});
