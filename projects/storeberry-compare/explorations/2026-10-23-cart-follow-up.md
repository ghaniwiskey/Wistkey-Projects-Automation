---
project: storeberry-compare
env: staging
charter: "Follow up the previously observed cart badge/drawer mismatch by repeating a guest add-to-cart and checking cart state after reload, without submitting an order."
date: 2026-10-23
timebox: targeted
status: done
---

## Scope
- In scope: staging product detail, add-to-cart confirmation, header badge, cart drawer, and reload persistence.
- Out of scope: checkout, payment, order submission, production storefront, CRM.

## Coverage notes
- Opened the staging product page for `偈油x10` (HKD 10.00), an item used in the previous follow-up attempt. In this guest session the header badge already showed 1 and the drawer said “You have no items in your cart !”.
- Clicked Add To Cart once. The storefront displayed “Item added successfully” and the header badge increased from 1 to 2.
- Opened the drawer: it again said “You have no items in your cart !”. Reloaded the product page; the badge remained 2. On one reload the drawer stayed on a spinner for at least 3.5 seconds; after another reload it again displayed the empty-cart message.
- This reproduces the same badge/drawer mismatch observed in the earlier staging pass. No order was placed.
- No JavaScript console errors or HTTP error responses were observed during the add-to-cart attempt. The cart drawer did not expose a product line to remove.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Add To Cart reports success and increments the badge, but the drawer has no product line and may stay loading after reload. | major | bugs/BUG-002-cart-drawer-stays-empty-after.md |

## New test ideas
- Existing `SBF-004` covers add/remove and asserts product line, quantity, badge reset, and no order submission (P0, regression, writes; staging only).

## Knowledge updates
- `BUG-002` is open and linked to `SBF-004`; cart checks should not proceed to order placement.
- The guest cart badge persisted across page reload while the drawer displayed no items or a stuck spinner.
- Evidence: `explorations/2026-10-23-cart-follow-up/01-cart-empty-after-successful-add.png`.
