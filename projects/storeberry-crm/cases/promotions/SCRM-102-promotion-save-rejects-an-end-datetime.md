---
id: SCRM-102
title: "Promotion save rejects an End Datetime earlier than the Start Datetime"
feature: promotions
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Staff cannot save a promotion whose date window is impossible.

## Preconditions
- None

## Data
- Promotion name and code `<unique>`, X = 700, Y = 50, Applied Shop = Online Shop

## Steps
1. Log in to the staging CRM and open Promotions > Add Promotion > "Promo Code: Get $Y off upon spending over $X with discount code"
2. Fill the data, type Start Datetime **today 00:00:00** and End Datetime **yesterday 09:00:00**
3. Click Save

## Expected
- A message says the end datetime must be after the start datetime
- The page stays on the form and no promotion is added (list count unchanged)

## Notes
Currently fails: BUG-024 (2026-10-27): saved silently and listed as expired. Empty Save shows a toast listing only name and start datetime ("The name is required.The start datetime is required.").
