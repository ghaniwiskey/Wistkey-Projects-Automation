---
project: storeberry-crm
env: staging
charter: Diagnose why the minimum-spend Web POS code does not appear for snack01.
date: 2026-11-20
timebox: 15m
status: done
---

## Findings
- CRM product 3214 (snack01) has both promotion exclusion switches off.
- KN guest test cart: HKD 100 snack01 qualified for HKD 20 off under abovexcode; total HKD 80 with Gold inactive. With Gold enabled, it applied another HKD 16 off after abovexcode, not before it.
- HK guest test cart: the item offer named 100 reduced the snack to HKD 50. abovexcode still took HKD 10 off with Gold inactive, consistent with the inclusive cutoff in Q-025.
- The user's open KN cart showed test-100 deducting the full HKD 100 subtotal. No payable amount remained, and abovexcode was not displayed. The open cart was inspected only.

## QA records and cleanup
- SCRM-187 passed in manual run 2026-11-20_0715_staging_manual; no duplicate case added. Both separate test carts cleared; no setting changes or sale.
