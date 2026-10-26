---
id: SCRM-065
title: "Award loyalty points once for an eligible QA purchase"
feature: loyalty
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A completed eligible QA purchase awards the configured loyalty points exactly once.

## Preconditions
- A dedicated staging QA member has a visible points balance.
- A documented sandbox checkout method and eligible product are available.

## Data
- QA member selected dynamically.
- Eligible product and qualifying order amount selected from current loyalty rules.

## Steps
1. Record the QA member points balance and current earn rule.
2. Complete one qualifying sandbox purchase for the QA member.
3. Reopen the member loyalty balance and order history.
4. Refresh the balance and confirm the same order did not award points twice.

## Expected
- The points increase by the amount defined in the current earn rule.
- The completed order is linked to the point entry.
- Reloading does not duplicate the points entry.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Requires a sandbox payment method; do not make a live purchase.
