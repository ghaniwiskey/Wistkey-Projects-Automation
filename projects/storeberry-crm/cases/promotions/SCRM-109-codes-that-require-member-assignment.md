---
id: SCRM-109
title: "Codes that require member assignment work only after they are assigned to the member"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
"Require Member assignment before use" stops unassigned codes, and Assign validates the member.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code (created during the test, e.g. 662), "Require Member assignment before use" ticked, two Generated codes
- QA member logged in on the eShop with a product in the cart

## Steps
1. On the eShop apply unassigned code 1
2. In the CRM click Assign on code 1 and enter a Member ID that does not exist
3. Assign code 1 to the QA member
4. On the eShop apply code 1 again

## Expected
- Step 1: refused, no discount
- Step 2: "Target Member Not found"; the code stays unassigned
- Step 3: "Assigned"; Member ID and Member Reserved At filled, status still Generated
- Step 4: "Applied: <code>" with the promotion discount

## Notes
2026-10-28 manual: pass (QC39DgTk, member MEMy001164526). Times in the row disagree: BUG-026 / SCRM-111. The member cannot see assigned codes on the eShop: storeberry-compare BUG-019.
