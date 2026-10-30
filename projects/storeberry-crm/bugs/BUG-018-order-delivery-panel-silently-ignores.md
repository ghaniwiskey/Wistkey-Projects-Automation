---
id: BUG-018
title: "Order delivery panel silently ignores Dispatch with nothing packed and Save with packed qty above ordered"
severity: minor
status: wont-fix
env: staging
url: "https://www.stagingl10.storeberry.xyz/orders/detail?id=10969"
updated: 2026-10-30T05:45:52.592Z
found: 2026-10-27T09:05:39.178Z
foundBy: "explorations/2026-10-27-fulfilment-stock.md"
tests: []
frequency: always (Save 2/2, Dispatch 1/1)
---
## Summary
In the order Delivery panel, clicking Dispatch before packing and clicking Save with a parcel qty of 5 for a 1-item order both do nothing: no request, no message. Staff cannot tell why.

## Steps to reproduce
1. Open a Processing order > Delivery
2. Click Dispatch (nothing packed)
3. Pack All, type 5 in the parcel qty (order qty 1), click Save

## Expected
A message explains the problem (pack items first / qty exceeds ordered), or the qty is capped.

## Actual
Nothing happens, no XHR is sent, no message. With qty 1, Save works ("update successfully").

## Evidence
- Observed on TXN0126102700004, 2026-10-27

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/orders/detail?id=10969
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-fulfilment-stock.md in the Test Manager app.
- 2026-10-29: status open -> wont-fix.
- 2026-10-30: Closed as wont-fix: linked cases updated to the accepted behavior (SCRM-093 now expects both actions to be ignored); tests list emptied..
