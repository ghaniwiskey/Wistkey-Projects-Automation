---
id: Q-002
title: "How is the cash drawer reconciled when a paid cash POS sale is voided?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27
foundBy: "explorations/2026-10-27-pos-order-lifecycle.md"
tests: [SCRM-087]
bugs: [BUG-012]
answered: ""
---
## Question
Voiding a paid Cash POS sale adds no reversal entry to the order Payment History. Is the drawer balance adjusted somewhere else (Cash In Out), or should the void record a cash-out line?

## Context
POS sale TXN1126102700002 (HKD 8.50, Cash, drawer HK, Storeberry HK) voided from the CRM order detail on 2026-10-27: status Canceled.

Payment History still shows only "Cash $ 8.50" and no refund order is created, unlike Refund this order which creates <TXN>R with Cash -<amount>.

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-27-pos-order-lifecycle/03-voided-pos-order-delivery-pending.png)

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-pos-order-lifecycle.md.
