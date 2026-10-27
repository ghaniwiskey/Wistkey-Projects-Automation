---
id: SCRM-081
title: "Adjust member points with admin endorsement"
feature: loyalty
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Staff can add and subtract member points with endorsement and see it in Point History.

## Preconditions
- A QA member with a known balance

## Data
- +100, then Subtract 100
- Endorsement: the shared CRM account from .env

## Steps
1. Customer detail > Membership points edit button
2. Leave the toggle on Add (+), enter 100 and a remark, Save without endorsement
3. Enter the endorsement username and password, Save
4. Repeat with the toggle on Subtract (-) and 100

## Expected
- Without endorsement: "The endorse username is required. The endorse user password is required."
- Adjusted Balance preview = balance + 100, then "Point updated."
- Membership points show the new balance and Point History lists the adjustment with the remark
- Subtract returns the balance to the start value

## Notes
Verified 2026-10-27. The toggle checkbox is checked in Subtract mode.
