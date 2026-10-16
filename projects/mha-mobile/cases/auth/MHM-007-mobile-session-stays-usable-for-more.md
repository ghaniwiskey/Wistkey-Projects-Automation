---
id: MHM-007
title: "Mobile session stays usable for more than 10 minutes"
feature: auth
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A stocktaker can keep working after 10 minutes without being thrown out or losing sightings.

## Preconditions
- A FAVE asset is assigned to the mobile officer as stocktaker (see MHM-005)

## Steps
1. Log in, switch to Stocktaker and the cost centre, open the FAVE online
2. Wait 11 minutes after the login (or keep working)
3. Open the asset, turn on Sighted, SAVE and CONFIRM

## Expected
- Step 3: the sighting is saved (REVIEW 1) and the app stays logged in
- If the session must end, the app says so and keeps the unsent sighting for upload after the next login

## Notes
Manual for now (an 11-minute wait per run). Fails on UAT 2026-10-16: BUG-001.
