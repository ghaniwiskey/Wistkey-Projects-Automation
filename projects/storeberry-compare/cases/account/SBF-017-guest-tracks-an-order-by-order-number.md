---
id: SBF-017
title: "Guest tracks an order by order number and email"
feature: account
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Order Tracking shows a guest order only to someone who knows its email, and reflects later status changes.

## Preconditions
- A guest order (SBF-016)

## Data
- Order number and email of that order; a different email; another order number

## Steps
1. Footer > Order Tracking (/guest-order-tracking): order number + correct email
2. Same order + a different email
3. Same order with upper-case email and lower-case order number
4. Another order number + this email
5. Cancel the order in the CRM, track it again

## Expected
- Correct pair shows the order (date, payment, total, status, details, delivery info)
- Wrong email and other order: "The related order does not exist." with no order data
- Case differences are ignored
- After cancellation the status shows CANCELED

## Notes
Verified 2026-10-27. Member orders are not trackable here ("If you're a member, please login"). Typo "Receipient" on the result (BUG-008).
