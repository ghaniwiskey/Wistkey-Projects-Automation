---
id: HLW-002
title: "Administrator logs in and lands on the Dashboard"
feature: auth
priority: P0
tags: [smoke]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Log in to HTX LIMS web

Verify that an administrator can log in with username and password and lands on the Dashboard with the full menu.

## Preconditions
- An administrator account

## Steps
1. Open the HTX LIMS web home page and click Login
2. Enter the administrator username and password and click Login

## Expected
- The Dashboard opens with the heading HTX - LIMS and the sections Alerts requiring acknowledgement and Latest location
- The menu shows Dashboard, Inventory, Registration, Purchase Order, Check In / Out, Stock Take, Gantry, Report, Master Data, System and My Account
- The user button at the top shows the user's name and Role: Administrator

## Notes
Checked by hand 2026-11-18 (exploration explorations/2026-11-18-critical-flows.md).
