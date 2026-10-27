---
id: SCRM-114
title: "A promo code limited to Online Shop is refused in Web POS"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Applied Shop limits where a code can be used.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code with a code assigned to the QA member (e.g. 662) (Applied Shop = Online Shop only)
- A code valid for the store (e.g. VIP888 for Storeberry HK) as a control

## Steps
1. Web POS Storeberry HK: add a product and select the QA member
2. Enter the Online-only code and Apply
3. Enter the control code and Apply
4. Clear the POS cart (no sale)

## Expected
- Step 2: "Invalid promotion code." and no discount
- Step 3: the control promotion is listed with its discount

## Notes
2026-10-28 manual: pass (QDvjYpU2 refused; VIP888 -20.00 applied, Silver recalculated -4.35). The message does not say the code is for another shop (risk).
