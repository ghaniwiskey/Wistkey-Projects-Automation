---
id: SCRM-032
title: "Payment report separates payments, refunds, and net amounts"
feature: reports
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The payment report displays payment, refund, and net figures by payment method.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Reports > Payments.
2. Select a date period and channel.
3. Review payment and refund views and the payment-method summary.

## Expected
- Payment and refund views are selectable.
- The report shows payment frequency/amount, refund frequency/amount, net amount, and percentage by payment method.
- Displayed net amounts reconcile to payment amounts less refunds for the selected period.

## Notes
Read-only. Do not export report data or expose customer/order details.
