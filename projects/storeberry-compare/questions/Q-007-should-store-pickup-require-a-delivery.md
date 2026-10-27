---
id: Q-007
title: "Should 門市自取 (store pickup) require a Delivery Address?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27T09:51:38.850Z
foundBy: "explorations/2026-10-27-cart-payment-review.md"
tests: []
bugs: []
updated: 2026-10-27T09:51:38.850Z
answered: ""
---
## Question
Guest checkout with 門市自取 shows "Address *" as required and refuses to proceed without it, although the parcel is collected at the chosen store. Is a home address meant to be mandatory for pickup?

## Context
Empty Address -> generic "Please fill all required info" (no field named). The Remark textarea also uses name="address" (id shipping-address-customer-remarks), the same name as the Address textarea, which may confuse validation or the posted data. The CRM stored the address correctly for TXN0126102700016.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-cart-payment-review.md.
