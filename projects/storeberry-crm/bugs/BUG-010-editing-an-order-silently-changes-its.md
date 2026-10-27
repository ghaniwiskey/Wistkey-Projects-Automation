---
id: BUG-010
title: "Editing an order silently changes its warehouse and corrupts order data"
severity: major
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/orders/detail?id=10967"
updated: 2026-10-27T22:49:21.348Z
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-077]
frequency: always
---
## Summary
Order Detail > Actions > Edit this order (web POS) replaces the order with a new one (TXN...A) and voids the original, as warned. The replacement differs from the original in ways the user did not change: warehouse Office -> TaiPo Warehouse (the POS preselects TaiPo), which reserved 偈油x10 from a warehouse with 0 stock (available -1 / 0); the Shipping Store field (Storeberry KN) is dropped; the customer remark is duplicated; product names switch from the English "test product EN 1" to the Chinese-locale "test product CN 1", and the customer sees these in My Orders.

## Steps to reproduce
1. Open a pending online order whose Warehouse is Office (TXN0126102700002)
2. Actions > Edit this order > Use order creation date
3. Note the POS warehouse selector shows TaiPo Warehouse; reduce one line qty by 1
4. Total > Bank Transfer > CHECK OUT > OK (new order will be created, original voided) > Done
5. Open the new order TXN0126102700002A in the CRM and in eShop My Orders

## Expected
Only the changed quantity differs; warehouse, shipping store, remark and product names stay as they were.

## Actual
Warehouse TaiPo Warehouse (was Office), 偈油x10 available at TaiPo -1 / 0, Shipping Store missing, Customer remark "Aside QA exploratory test order - please ignore" shown twice (CRM and eShop), item names "test product CN 1" (CRM and eShop).

## Evidence
- Screenshot: ![order edit result](../explorations/2026-10-27-crm-eshop-critical/06-order-edit-result.png)
- Also in the POS payment step: Balance due shows "$ -390.00" before payment and a "Custom1" payment tile with a blank image.
- Internal remark was carried over correctly with "原訂單 Original order: TXN0126102700002".

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/orders/detail?id=10967
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
- 2026-10-28: Retested 2026-10-28 06:45-06:50 HKT, still open, all four symptoms reproduced. TXN0126102700027 (Online Shop, Shipping Store Storeberry KN, Warehouse Office, test product EN 1 large-red x2, customer remark) edited to qty 1 -> TXN0126102700027A: Warehouse TaiPo Warehouse (POS preselected it), Shipping Store missing, customer remark shown twice (CRM and eShop), item "test product CN 1" (CRM, POS and eShop My Orders). New detail: TaiPo has no large-red, so the replaced line became "Pre-order Qty: 1" while Office released 2 (Office 20 -> 22, TaiPo 34 -> 33, Pre-order 1 -> 2). POS still showed "Balance due $ -161.50" and a blank Custom1 tile. Internal remark "原訂單 Original order" is correct. Evidence: ../explorations/2026-10-28-order-edit-retest/. 027A voided afterwards (stock back).
