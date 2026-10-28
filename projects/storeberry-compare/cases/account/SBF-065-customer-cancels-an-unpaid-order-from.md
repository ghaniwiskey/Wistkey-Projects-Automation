---
id: SBF-065
title: "Customer cancels an unpaid order from My Orders and its stock is released"
feature: account
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers can cancel orders they no longer want before paying, if the shop allows it.

## Preconditions
- An unpaid QA Bank Transfer order; find at runtime whether My Orders offers Cancel

## Steps
1. My Orders > the order > Cancel
2. Read the order on the eShop and in the CRM and the product Available

## Expected
- The order is Cancelled for both; Available goes back up; Upload Receipt is no longer offered
- If there is no Cancel option, record it and close the case as not applicable

## Notes
Gap from the 2026-10-29 review, sixth pass (no existing case found by search). Never tested.
