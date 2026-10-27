---
id: BUG-014
title: "Web POS Total silently does nothing when no cash drawer is selected"
severity: minor
status: wont-fix
env: staging
url: "https://www.stagingl10.storeberry.xyz/webpos?store_id=11"
found: 2026-10-27
foundBy: "explorations/2026-10-27-pos-order-lifecycle.md"
tests: []
frequency: always
---
## Summary
With no cash drawer selected, clicking Total does not open the payment screen and shows nothing. The only feedback is console.error "Pleas select a cash drawer in setting page first!" (typo). A short toast with the same text appears only once on page load.

## Steps to reproduce
1. Open Web POS for Storeberry HK with no cashDrawerConfig in localStorage
2. Dismiss/miss the load toast, add a product, click Total

## Expected
A visible message tells the cashier to select a drawer in Settings > Cash In Out.

## Actual
Nothing happens; console.error only. Seen twice (first load, and after the drawer selection was lost once mid-session).

## Evidence
- Console: "Pleas select a cash drawer in setting page first!"

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/webpos?store_id=11
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-pos-order-lifecycle.md in the Test Manager app.
- 2026-10-27: status open -> wont-fix.
- 2026-10-27: updated SCRM-088 to assert the accepted no-cash-drawer no-op then proceed after selecting a drawer; cleared linked tests.
