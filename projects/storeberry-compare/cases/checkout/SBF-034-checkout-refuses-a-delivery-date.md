---
id: SBF-034
title: "Checkout date picker offers only the shipping method's allowed delivery dates"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
The delivery date picker lets customers choose only the dates the shop allows (date window, minimum preparation days), and the chosen date reaches the order.

## Preconditions
- A shipping method whose Delivery Info has a date field with a date range and/or 'minimum preparation days', read from CRM Online Store > Shipping > edit method at runtime (e.g. Testing: field 'test', range and 5 prep days)
- A QA member with a weighted product in the cart

## Data
- Bank Transfer only

## Steps
1. Open /checkout, choose the method and click the date field -> note which dates the picker allows
2. Pick the first allowed date with the picker
3. Tick the agreement and Proceed to checkout
4. CRM: open the order and read Delivery Info

## Expected
- Step 1: dates before the minimum preparation days and outside the method's date range are greyed out and cannot be clicked
- Step 3: the order is placed
- Step 4: Delivery Info shows the date picked in step 2
- Cleanup: void the order

## Notes
Found in explorations/2026-10-28-shipping-fees-last-unit.md. BUG-020, closed as wont-fix (accepted behavior): the field is a plain, editable text input and a typed date (blocked, out of range or not a date) is accepted as typed, so typed values are not checked here.
