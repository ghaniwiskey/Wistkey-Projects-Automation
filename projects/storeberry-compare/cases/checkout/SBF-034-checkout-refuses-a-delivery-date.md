---
id: SBF-034
title: "Checkout refuses a delivery date outside the shipping method's allowed dates"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Customers cannot book a delivery date the shop has blocked (date window, minimum preparation days) by typing it instead of using the picker.

## Preconditions
- A shipping method whose Delivery Info has a date field with a date range and/or 'minimum preparation days', read from CRM Online Store > Shipping > edit method at runtime (e.g. Testing: field 'test', range and 5 prep days)
- A QA member with a weighted product in the cart

## Data
- Bank Transfer only

## Steps
1. Open /checkout, choose the method and click the date field -> note which dates the picker allows
2. Type a blocked date with the keyboard (today, or a date after the range), Tab out
3. Type text that is not a date, Tab out
4. Tick the agreement and Proceed to checkout with a blocked date
5. CRM: open the order (if one was created) and read Delivery Info

## Expected
- Step 2-3: a blocked or invalid value is cleared or flagged; it never becomes a different date silently
- Step 4: refused with a message about the delivery date; no order
- Step 5: no order exists; if one does, its date is within the allowed dates
- Cleanup: void any order created

## Notes
Found in explorations/2026-10-28-shipping-fees-last-unit.md. The picker greys out blocked dates but the field is a plain, editable text input.
