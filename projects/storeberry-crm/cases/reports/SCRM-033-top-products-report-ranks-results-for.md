---
id: SCRM-033
title: "Top-products report ranks results for the selected period"
feature: reports
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The Top 10 products report ranks products using the selected reporting period.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Reports > Top 10 products.
2. Select a date period and channel if available.
3. Review the ranked products and sales metric.

## Expected
- The report heading and selected period are visible.
- The results contain no more than ten ranked products and are ordered by the displayed sales metric.
- Product names and totals are taken from current data, not hard-coded.

## Notes
Read-only. Do not export report data.
