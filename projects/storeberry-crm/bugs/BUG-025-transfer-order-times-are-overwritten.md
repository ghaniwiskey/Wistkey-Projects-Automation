---
id: BUG-025
title: "Transfer order Transfer time and Receive Time are overwritten by later actions (cancel, second receive)"
severity: minor
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/inventory/transfer-detail?id=312"
updated: 2026-10-27T12:55:00.000Z
found: 2026-10-27T12:55:00.000Z
foundBy: "explorations/2026-10-27-promotions-transfers.md"
tests: [SCRM-105, SCRM-104]
frequency: always
---
## Summary
The transfer detail keeps one Transfer time and one Receive Time, and later actions overwrite them:
- "Cancel Transfer" on an In-transit transfer writes the cancel moment into Transfer time. The order goes back to Pending (and later Canceled) but still shows a Transfer time, and that time is not when it was shipped.
- A second Receive after a Partial Received overwrites Receive Time, so the first receipt time is lost from the detail page.
Inventory History still has the correct timestamps, so the detail page contradicts the history.

## Steps to reproduce
1. Add Transfer Order Office -> TaiPo Warehouse, product test 2 x1, Submit > Confirm (Pending)
2. Transfer > OK at 20:46:30 (In-transit, Transfer time 20:46:30)
3. Cancel Transfer > OK at 20:46:38 -> status Pending
4. Cancel Transfer Orders > OK -> status Canceled
5. Second case: a transfer with two products, receive one row (Partial Received at 20:45:44), later receive the other (Received at 20:47:37)

## Expected
- After step 3 Transfer time is cleared (or the cancel is shown separately); it never shows the cancel time as the shipping time.
- Receive Time keeps the first receipt or the detail shows each receipt.

## Actual
- Transfer 312 (QA-TO-mvqoiwwt): Status Canceled, Transfer time 2026-10-27 20:46:38 (= cancel time). History: IN_TRANSIT 20:46:30, CANCEL_TRANSFER 20:46:38, CANCEL_TRANSFER_ORDER 20:47:02.
- Transfer 311 (QA-TO-mvqodhe9): Receive Time 20:45:44 after the partial receive, 20:47:37 after the final receive.

## Evidence
- Detail pages for transfer-detail?id=311 and id=312; Inventory History for product test 2 (filter by QA-TO-mvqoiwwt).

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/inventory/transfer-order
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-promotions-transfers.md.
