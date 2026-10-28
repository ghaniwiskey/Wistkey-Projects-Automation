---
id: SCRM-178
title: "Staff marking an online order as paid without a receipt records the payment once and awards points"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Manual payment recording is controlled and keeps points and reports right.

## Preconditions
- An unpaid QA Bank Transfer eShop order; find at runtime whether the order detail offers a manual "paid"/add payment action

## Steps
1. Record the payment manually for the full amount
2. Read Payment History, order status, member points and the Payment report
3. Try recording it again

## Expected
- One payment with amount, method, staff and time; status Processing/Paid; points awarded once
- A second payment is not allowed or makes the order overpaid with a warning
- Cleanup: refund the order

## Notes
Gap from the 2026-10-29 review, sixth pass (no existing case found by search). Never tested. If no manual action exists, record that and close the case as not applicable.
