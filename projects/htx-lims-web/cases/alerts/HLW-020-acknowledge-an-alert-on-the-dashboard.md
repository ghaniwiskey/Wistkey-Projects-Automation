---
id: HLW-020
title: "Acknowledge an alert on the Dashboard"
feature: alerts
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Alert acknowledgement

Verify that acknowledging an alert removes it from the Dashboard and Alert History shows it as acknowledged.

## Preconditions
- At least one alert requiring acknowledgement

## Steps
1. Log in to HTX LIMS web with the administrator account
2. On the Dashboard note the count of alerts requiring acknowledgement and the first alert's text
3. Click Acknowledge on that alert

## Expected
- The alert disappears from the list and the count drops by 1
- Report > Alert History shows the alert as acknowledged with the user and time

## Notes
Acknowledging cannot be undone and the alerts are shared test data: run only with approval.
