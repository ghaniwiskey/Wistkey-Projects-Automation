---
id: BUG-019
title: "Transfer Receive with no product toggled silently does nothing"
severity: minor
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/inventory/transfer-detail?id=308"
updated: 2026-10-27T09:51:38.724Z
found: 2026-10-27T09:51:38.724Z
foundBy: "explorations/2026-10-27-stock-movement.md"
tests: [SCRM-094]
frequency: always
---
## Summary
On an In-transit transfer, clicking Receive > OK while no product row toggle (Received All) is on sends POST /inventory/transfer-receive (HTTP 200) but nothing changes and no message is shown. Staff are not told they must toggle the rows first; Receive Qty has no input, so the toggle is the only way to receive.

## Steps to reproduce
1. Create a transfer Office -> TaiPo Warehouse, product test 2 qty 2, and click Transfer > OK (In-transit)
2. On the detail page leave the row toggle and Received All off
3. Click Receive, then OK in "Are you sure to receive this transfer order?"

## Expected
A message asks to select the products to receive (or Receive is disabled until a row is toggled).

## Actual
Dialog closes, status stays In-transit, Receive Qty 0, no message. Reproduced twice on QA-TO-mvqhvu1l (id 308). Toggling the row and repeating Receive works (Received, TaiPo +2).

## Evidence
- Screenshot: ![receive nothing toggled](../explorations/2026-10-27-stock-movement/03-transfer-receive-nothing-toggled.jpg)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/inventory/transfer-detail?id=308
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-stock-movement.md in the Test Manager app.
