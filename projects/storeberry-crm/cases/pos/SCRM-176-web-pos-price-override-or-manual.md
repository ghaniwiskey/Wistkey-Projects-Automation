---
id: SCRM-176
title: "Web POS price override or manual discount needs permission and is recorded on the order"
feature: pos
priority: P1
tags: [regression, writes, security]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Cashiers cannot quietly sell below price.

## Preconditions
- Cash drawer selected; find at runtime whether POS offers price edit / manual discount

## Data
- A non-quota QA product, Cash

## Steps
1. Add the product, change its price or add a manual discount
2. Check out with Cash
3. Open the order in the CRM and the sales report

## Expected
- The change needs a permission or approval (or is limited per settings)
- The order shows the original price, the discount, and who gave it; reports show the discount
- Cleanup: refund/void the sale

## Notes
Gap from the 2026-10-29 review, sixth pass (no existing case found by search). Never tested.
