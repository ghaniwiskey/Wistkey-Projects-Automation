---
id: Q-009
title: "Which warehouse should new online orders use: Office or TaiPo?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: []
bugs: [BUG-010]
answered: ""
---
## Question
Is it intended that online orders placed after ~10:30 on 2026-10-27 are assigned to TaiPo Warehouse while the morning order used Office?

## Context
TXN0126102700002 (10:20) -> Office. TXN0126102700003 and TXN0126102700004 (~11:00) -> TaiPo Warehouse. Edit this order also preselected TaiPo (BUG-010). TaiPo has 0 stock of 偈油x10, so allocation went negative.

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-crm-eshop-critical.md.
