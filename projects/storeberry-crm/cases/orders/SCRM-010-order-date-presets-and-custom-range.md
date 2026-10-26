---
id: SCRM-010
title: "Order date presets and custom range constrain results"
feature: orders
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can restrict orders to a selected creation-date range.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- A valid custom start date and end date.

## Steps
1. Sign in to the staging CRM and open Orders.
2. Select Last 3 Months, Last 6 Months, and Last 12 Months in turn.
3. Choose Custom and enter a valid start and end date.

## Expected
- The selected date range is shown after each selection.
- Every visible order creation date is within the chosen range.
- The count updates with the range and is not a fixed number.

## Notes
Read-only; use current dates and do not hard-code expected counts.
