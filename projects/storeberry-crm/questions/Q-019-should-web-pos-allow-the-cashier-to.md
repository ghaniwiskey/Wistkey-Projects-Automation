---
id: Q-019
title: "Should Web POS allow the cashier to Continue selling an item with no stock?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27T22:35:20.690Z
foundBy: "explorations/2026-10-27-pos-order-lifecycle.md"
tests: [SCRM-115]
bugs: []
updated: 2026-10-27T22:35:20.690Z
answered: ""
---
## Question
When a POS cart contains an item with 0 available in the store warehouse, Total shows "out of stock/not enough stock now" with Back and Continue. Continue would complete the sale and push stock below zero. Is overselling in-store intended (e.g. stock arrives later), should it need a manager override, or should it be blocked?

## Context
Seen 2026-10-27 with product test 2 in TEST12 (Storeberry HK). Not continued. The CRM order list shows some rows with negative available stock.

## Answer
Not answered yet.

## History
- 2026-10-28: asked from explorations/2026-10-27-pos-order-lifecycle.md.
