---
id: SCRM-151
title: "Message Centre lists sent member notifications with type, status and send time"
feature: notifications
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff can see which notifications reached members.

## Preconditions
- A member notification triggered by our QA order (e.g. order placed / payment accepted, SBF-041)

## Data
- Filters: Type, Status, Last 3 Month

## Steps
1. Open Message Centre > Notifications and filter
2. Find the notification of our QA order

## Expected
- The row shows the right member, type, status and Send Out Time in local time
- Filters narrow the list correctly

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Related: SBF-041 and the eShop member notification inbox case.
