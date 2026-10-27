---
id: SCRM-074
title: "Order list paid date never shows Invalid date"
feature: orders
priority: P3
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
The paid date column shows a date or a dash for every order.

## Data
- Last 12 Months, 100 per page

## Steps
1. Open Orders, Last 12 Months, 100 items per page
2. Scan the Paid date / Payment approval date column, including HKD 0.00 eGift-paid orders

## Expected
- No cell reads "Invalid date"

## Notes
Read-only.
