---
id: HLW-022
title: "Whitelisted and loaned items pass the exit gantry without an alert"
feature: alerts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Authorized exit

Verify that an item on the Gantry Whitelist or checked out on loan passes the exit gantry as authorized, with no alert.

## Preconditions
- One item on the Gantry Whitelist and one item checked out on loan
- An exit gantry that can read their tags

## Steps
1. Carry both items through an exit gantry
2. Log in to HTX LIMS web with the administrator account
3. Open Gantry > Authorized Log and the Dashboard

## Expected
- Authorized Log lists both items with the gantry and time
- No new Unauthorized removal alert for either item

## Notes
Needs real gantry hardware: manual only.
