---
id: SBF-026
title: "Checkout drops a promotion code that became invalid after it was applied"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The checkout never shows a discount the order cannot get.

## Preconditions
- Member logged in; a CRM single-use code (storeberry-crm SCRM-108) applied at /checkout

## Steps
1. Revoke the code in the CRM
2. Change the shipping method (re-pricing)
3. Fill the rest and Proceed to checkout, then close the warning

## Expected
- Step 2 or 3 removes the code and shows the total without it
- The message names the code that was removed

## Notes
Currently fails: BUG-018 (2026-10-28): code stays "Applied" with HKD 459.00 until reload; Proceed only says "Invalid promotion code." The server refuses the order (no money lost).
