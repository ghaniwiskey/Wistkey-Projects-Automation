---
id: HLW-021
title: "Removing an item that is not checked out raises an unauthorized removal alert"
feature: alerts
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Unauthorized removal

Verify that an item passing an exit gantry without a check-out is logged as unauthorized and raises a Dashboard alert.

## Preconditions
- An item with status IN and an exit gantry (Gantry Setup, Exit Gantry) that can read its tag

## Steps
1. Carry the item's RFID tag through an exit gantry
2. Log in to HTX LIMS web with the administrator account
3. Open Gantry > Unauthorized Log
4. Open the Dashboard

## Expected
- Unauthorized Log lists the item with the gantry, location and time
- The Dashboard shows an Unauthorized removal alert naming the item, its number and the exit gantry

## Notes
Needs real gantry hardware (or a simulated gantry read): manual only.
