---
id: SBF-035
title: "After a receipt is denied, Upload Receipt tells the customer it was rejected and asks for a new one"
feature: account
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A customer whose payment proof was denied sees that state where they upload, not an old 'waiting for approval' message.

## Preconditions
- A QA member Bank Transfer order with an uploaded receipt that staff denied with a comment (SCRM-076)

## Steps
1. eShop My Orders > the order > Upload Receipt tab
2. Read the message under the receipt and the Remark history
3. Order Detail tab: read STATUS

## Expected
- Step 2: the message says the receipt was rejected (with the staff comment) and asks for a new receipt; it does not say 'waiting for approval'
- Step 3: STATUS Rejected
- Cleanup: void the order

## Notes
Found in explorations/2026-10-28-payment-recovery.md. Related: SBF-031 (re-upload after deny).
