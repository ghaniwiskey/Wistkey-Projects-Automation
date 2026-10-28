---
id: SBF-041
title: "Customer receives order notifications when the order is placed and when the payment is accepted"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers are told their order was received and later that payment was accepted.

## Preconditions
- A QA member whose email (or WhatsApp/SMS) we can read, from .env or created at runtime
- The notification channels enabled on staging, read from the CRM settings

## Data
- A non-quota product found at runtime
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Place a Bank Transfer order as the QA member
2. Check the QA inbox
3. Upload a receipt (SBF-012) and accept it in the CRM (SCRM-075)
4. Check the QA inbox again

## Expected
- Step 2: an order confirmation with the order number, items, total and bank transfer instructions
- Step 4: a payment accepted / order status message for the same order
- Cleanup: void or refund the order

## Notes
Gap from the 2026-10-29 critical-flow review (no existing case found by search). Never tested. Sending customer messages is allowed by the storeberry-crm README permissions.
