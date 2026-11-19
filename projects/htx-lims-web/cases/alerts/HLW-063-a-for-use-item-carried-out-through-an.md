---
id: HLW-063
title: "A For use item carried out through an exit gantry raises an unauthorized removal alert"
feature: alerts
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
An item checked out For use is OUT but not whitelisted, so passing exit gantry 1a or 3b is logged as unauthorized and raises an Unauthorized removal alert.

## Preconditions
- An item checked out For use (HLW-016) and not on Gantry > Gantry Whitelist
- Access to the HTX API Swagger page (/swagger) when no real gantry is available

## Data
- Gantry: 3b EXIT (its IP from Gantry Setup)

## Steps
1. Log in to HTX LIMS web as administrator, note the Dashboard alert count and confirm the item is not on Gantry Whitelist
2. Send the gantry read: carry the tag through gantry 3b, or in Swagger call POST /api/Gantry/unauthorizerfid with the gantry IP and the item's 24-digit chip code
3. Wait one minute and refresh the Dashboard
4. Open Gantry > Unauthorized Log
5. Move the item back with an authorized read at an inner gantry of its original room

## Expected
- The Dashboard count goes up by 1 with "Unauthorized removal: <description> (Item Number <number>) passed exit gantry 3b EXIT."
- Unauthorized Log lists the item with Gantry 3b EXIT, Status OUT and Location Airlock 2
- The item keeps status OUT (a gantry never changes the status)

## Notes
Coverage review 2026-11-19: workflow step 11 says For use items are not whitelisted and raise the alert at the exit; HLW-021 covers only an IN item and HLW-022 a whitelisted one. The gantry decides authorized vs unauthorized itself (Q-003): through Swagger this checks the server side only. Do not acknowledge the alert without asking (README > Testing permissions).
