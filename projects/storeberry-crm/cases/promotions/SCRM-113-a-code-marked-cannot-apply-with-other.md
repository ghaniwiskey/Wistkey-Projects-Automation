---
id: SCRM-113
title: "A code marked \"Cannot apply with other promotions\" removes the other promotions from the basket"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Exclusive codes do not stack with member-level or basket promotions.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code with a code assigned to the QA member (e.g. 662), "Cannot apply with other promotions" ticked and saved
- A member whose level gives a basket promotion (e.g. Silver 15%)

## Steps
1. eShop: add a product, open /checkout and note the discounts
2. Apply the code

## Expected
- Step 1: the member promotion is applied
- Step 2: only the code promotion is listed; Total = sub-total minus the code discount

## Notes
2026-10-28 manual: pass (QCDupVR9): 600 - Silver 90 = 510 before; with the code 600 - 60 = 540. The code raises the total by HKD 30 with no notice: Q-018.
