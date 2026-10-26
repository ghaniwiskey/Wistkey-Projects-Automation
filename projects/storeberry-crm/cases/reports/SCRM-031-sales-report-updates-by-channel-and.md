---
id: SCRM-031
title: "Sales report updates by channel and date period"
feature: reports
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The sales report refreshes its metrics when the channel or date period changes.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Reports > Sales.
2. Review the default report and note its displayed date period and total.
3. Select Online, a retail channel, and a different date preset or custom range.

## Expected
- The selected channel and date period are visible.
- Sales totals/chart data refresh for each selection and remain within the selected period.
- No report totals are hard-coded.

## Notes
Read-only. Do not export report data.
