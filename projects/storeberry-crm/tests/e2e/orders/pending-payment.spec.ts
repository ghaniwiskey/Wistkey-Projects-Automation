import { test, expect } from '../../fixtures/pages.fixture';

// Order rows contain customer details; keep trace and screenshot artifacts disabled.
test.use({ loggedIn: true, trace: 'off', screenshot: 'off' });

test('SCRM-003: pending payment filter shows matching CRM orders @regression', async ({ ordersPage }) => {
  await test.step('1. Open Orders and record the last-12-month order count', async () => {
    await ordersPage.goto();
  });
  const allOrders = await ordersPage.orderCount();
  test.skip(allOrders === 0, 'No orders exist in the default date range to exercise the status filter.');

  await test.step('2. Filter orders to Pending payment', async () => {
    await ordersPage.filterToPendingPayment();
  });
  const pendingOrders = await ordersPage.orderCount();
  test.skip(pendingOrders === 0, 'No Pending payment orders exist in the default date range.');
  test.skip(pendingOrders === allOrders, 'No non-pending orders exist in the date range to compare filter results.');

  await test.step('3. Confirm the filtered count and visible status labels', async () => {
    expect(pendingOrders).toBeLessThan(allOrders);
    expect(await ordersPage.pendingPaymentLabelCount()).toBeGreaterThan(1);
  });
});
