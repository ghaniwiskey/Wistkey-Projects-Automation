---
id: HLW-032
title: "A new item passes gantry 1a before check-in without an alert"
feature: gantry
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Gantry 1a before check-in

Verify that a pre checked-in item (status NOT CHECKED IN) passing gantry 1a is logged as NOT CHECKED IN, moves to Airlock 1 and raises no alert.

## Preconditions
- An item with status NOT CHECKED IN (pre checked in and counted on the handheld)

## Data
- Gantry: 1a EXIT

## Steps
1. Log in to HTX LIMS web with the administrator account and note the Dashboard alert count
2. Send a read of the item at gantry 1a (real gantry, or Swagger POST /api/Gantry/authorizerfid)
3. Open Gantry > Gantry Log and refresh the Dashboard after one minute

## Expected
- Gantry Log lists the item with Gantry 1a EXIT, Status NOT CHECKED IN, Location Airlock 1
- No alert is raised for the item

## Notes
Not executed: no item was NOT CHECKED IN on 2026-11-18. Workflow step 7.
