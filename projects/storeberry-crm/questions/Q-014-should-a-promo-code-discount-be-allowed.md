---
id: Q-014
title: "Should a minimum-spend promo code allow a discount larger than the minimum spend (free orders)?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27T12:55:00.000Z
foundBy: "explorations/2026-10-27-promotions-transfers.md"
tests: [SCRM-098]
bugs: []
updated: 2026-10-27T12:55:00.000Z
answered: ""
---
## Question
The "Get $Y off upon spending over $X with discount code" form saves Y greater than X without a warning (X 100 / Y 150, then X 700 / Y 750). On the eShop the discount is capped at the sub-total, so a $700.00 basket becomes HKD $0.00 (also $700.10 -> $0.00). Should the CRM block or warn when Y >= X? Also: is "over $X" meant as >= X? The code applied at exactly $700.00 with X = 700.

## Context
Promotion 661 (ours, deleted after the test), Online Shop only, code QA1027NQ3T8. Totals never went negative. No order was placed with it.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-promotions-transfers.md.
