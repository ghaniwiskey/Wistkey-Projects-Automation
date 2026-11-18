---
id: HLW-022
title: "A whitelisted item passes the exit gantry without an alert"
feature: alerts
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Authorized exit

Verify that an item checked out on Loan or No return (whitelisted) passes an exit gantry as Authorized, moves to the gantry's room and raises no alert.

## Preconditions
- An item with status OUT and purpose Loan or No return that is on the gantry whitelist (Gantry > Gantry Whitelist)
- Access to the HTX API Swagger page (/swagger) when no real gantry is available

## Data
- Gantry: 1a EXIT (its IP from Gantry Setup)

## Steps
1. Log in to HTX LIMS web with the administrator account and note the Dashboard alert count
2. Send the gantry read: carry the tag through gantry 1a, or in Swagger call POST /api/Gantry/authorizerfid with the gantry IP and the item's 24-digit chip code
3. Wait one minute and refresh the Dashboard, then open Gantry > Authorized Log

## Expected
- Authorized Log lists the item with Gantry 1a EXIT, Status OUT, Location Airlock 1 and the time
- The Dashboard alert count is unchanged and there is no Unauthorized removal alert for the item

## Notes
Executed through the API on 2026-11-18 (item 001000003, Loan): pass.