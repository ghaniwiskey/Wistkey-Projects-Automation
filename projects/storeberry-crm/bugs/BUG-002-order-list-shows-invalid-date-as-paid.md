---
id: BUG-002
title: "Order list shows \"Invalid date\" as paid date for a fully eGift-paid order"
severity: minor
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/orders"
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-074]
frequency: always
---
## Summary
A Complete HKD 0.00 POS order paid entirely by eGift (TXN1226102600001, Storeberry KN) shows "Invalid date" in the Paid date / Payment approval date column. 1 of 100 rows in the last-12-month list.

## Steps to reproduce
1. Open Orders (Last 12 Months, 100 per page)
2. Find an order whose total is HKD 0.00 because it was paid by eGift (e.g. TXN1226102600001)
3. Read the Paid date column

## Expected
A dash or the eGift redemption time.

## Actual
The cell shows "Invalid date". Order detail shows Total $0.00, item paid by "eGift - teste $200.00", Payment methods empty.

## Evidence
- Order detail: /orders/detail?id=10957

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/orders
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
