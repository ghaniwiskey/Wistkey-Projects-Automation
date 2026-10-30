---
id: BUG-024
title: "Promotion saves with an End Datetime earlier than its Start Datetime"
severity: minor
status: wont-fix
env: staging
url: "https://www.stagingl10.storeberry.xyz/promotions/edit?pid=661"
updated: 2026-10-30T05:45:53.005Z
found: 2026-10-27T12:55:00.000Z
foundBy: "explorations/2026-10-27-promotions-transfers.md"
tests: []
frequency: always
---
## Summary
The Add/Edit Promotion form accepts an End Datetime before the Start Datetime. Save succeeds silently, redirects to the list, and the promotion is shown as "expired" with the impossible window. Staff get no hint that the dates are swapped, so a promotion meant to run can be dead on arrival.

## Steps to reproduce
1. CRM > Promotions > Add Promotion > "Promo Code: Get $Y off upon spending over $X with discount code"
2. Fill name, Applied Shop = Online Shop, X = 700, Y = 750, a single promotion code
3. Type Start Datetime **2026-10-27 00:00:00** and End Datetime **2026-10-26 09:00:00** (typed into the field, then click elsewhere)
4. Save, then reopen the promotion

## Expected
Save is refused with a message such as "End datetime must be after start datetime".

## Actual
Saved with no message. List row: start 2026-10-27 00:00:00, end 2026-10-26 09:00:00, status expired. Edit page shows the same values.

## Evidence
- Screenshot: ![end before start saved](../explorations/2026-10-27-promotions-transfers/05-promotion-end-before-start-saved.png)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/promotions
- Env: staging
- Test record: promotion 661 (ours, since deleted)

## History
- 2026-10-27: filed from explorations/2026-10-27-promotions-transfers.md.
- 2026-10-29: status open -> wont-fix.
- 2026-10-30: Closed as wont-fix: linked cases updated to the accepted behavior (SCRM-102 now expects the promotion to save as expired); tests list emptied..
