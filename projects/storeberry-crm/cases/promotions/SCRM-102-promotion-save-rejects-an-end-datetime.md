---
id: SCRM-102
title: "A promotion with an End Datetime earlier than its Start Datetime saves as expired"
feature: promotions
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
Documents the accepted behavior for an impossible date window: the promotion saves and is listed as expired, so it never applies.

## Preconditions
- None

## Data
- Promotion name and code `<unique>`, X = 700, Y = 50, Applied Shop = Online Shop

## Steps
1. Log in to the staging CRM and open Promotions > Add Promotion > "Promo Code: Get $Y off upon spending over $X with discount code"
2. Fill the data, type Start Datetime **today 00:00:00** and End Datetime **yesterday 09:00:00**
3. Click Save
4. Cleanup: delete the QA promotion

## Expected
- Step 3: saved without a message
- The list row shows the typed start and end and status expired

## Notes
BUG-024, closed as wont-fix (accepted behavior). Empty Save shows a toast listing only name and start datetime ("The name is required.The start datetime is required.").
