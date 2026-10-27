---
id: SCRM-115
title: "Web POS warns before selling an item with no stock and keeps the sale open when the cashier goes back"
feature: pos
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The cashier is warned before overselling, and choosing Back leaves stock untouched.

## Preconditions
- Web POS for a store with a cash drawer selected (README > Web POS)
- A product with 0 available in the store warehouse (e.g. product test 2 in TEST12 for Storeberry HK), found at runtime

## Data
- Tender: Cash only

## Steps
1. Add the product to the POS cart and press Total
2. On the stock warning choose Back
3. Read the product row in CRM Inventory

## Expected
- Step 1: a warning names the product and says it is out of stock / not enough stock, with Back and Continue
- Step 2: the cart is unchanged and no order is created
- Step 3: Available for the store warehouse unchanged
- Cleanup: clear the POS cart

## Notes
Whether Continue (selling below zero) should be allowed is asked in the question linked to this case; do not press Continue until it is answered. Seen 2026-10-27 (pos-order-lifecycle risk 8).
