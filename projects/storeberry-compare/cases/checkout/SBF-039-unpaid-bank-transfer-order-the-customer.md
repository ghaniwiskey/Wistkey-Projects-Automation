---
id: SBF-039
title: "Unpaid bank transfer order: the customer sees the payment deadline and the order is handled when it passes"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Bank Transfer orders that are never paid do not hold stock forever and the customer knows how long they have to pay.

## Preconditions
- The payment deadline / auto-cancel setting read from the CRM at runtime (Online Store or payment settings); if none exists, record that as a question for the product owner

## Data
- A non-quota product found at runtime
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Place a Bank Transfer order as a QA member and note the thank-you page and Upload Receipt texts
2. Read the order and the product Available in the CRM
3. After the deadline passes (or the shortest configurable deadline), reopen the order on the eShop and in the CRM

## Expected
- Step 1: the customer is told the bank details and the deadline to pay
- Step 3: the order is cancelled/expired per the setting and its reserved stock is released; the customer sees the new status
- If no deadline exists: the order stays Pending Payment and keeps stock reserved (record a question)
- Cleanup: void the order if it is still open

## Notes
Gap from the 2026-10-29 critical-flow review (no existing case found by search). Never tested. Related: SCRM-110 (voiding an unpaid order releases stock).
