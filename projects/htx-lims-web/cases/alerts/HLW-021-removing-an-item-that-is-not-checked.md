---
id: HLW-021
title: "An IN item carried out through an exit gantry raises an unauthorized removal alert"
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

Verify that an item with status IN that is not whitelisted and passes an exit gantry (1a or 3b) is logged as unauthorized, moves to the gantry's room, keeps status IN and raises an Unauthorized removal alert on the Dashboard.

## Preconditions
- An item with status IN that is not on the gantry whitelist
- The exit gantries in Gantry > Gantry Setup (1a EXIT in Airlock 1, 3b EXIT in Airlock 2)
- Access to the HTX API Swagger page (/swagger) to send the gantry read, when no real gantry is available

## Data
- Gantry: 3b EXIT (its IP from Gantry Setup)

## Steps
1. Log in to HTX LIMS web with the administrator account and note the Dashboard alert count, the item's number and its location (Inventory > Item Information)
2. Send the gantry read: carry the tag through gantry 3b, or in Swagger call POST /api/Gantry/unauthorizerfid with the gantry IP and the item's 24-digit chip code (rfids: rfidTag, readStrength)
3. Wait one minute and refresh the Dashboard
4. Open Gantry > Unauthorized Log and Gantry > Gantry Log
5. Move the item back: send an authorized read at an inner gantry of its original room (e.g. 1b for Airlock 1)

## Expected
- The Dashboard count goes up by 1 and the newest alert reads "Unauthorized removal: <description> (Item Number <number>) passed exit gantry 3b EXIT." with the read time
- Unauthorized Log lists the item with Gantry 3b EXIT, Status IN, Location Airlock 2 and the time
- Item Information shows the item in Airlock 2 with status IN (a gantry never changes the status)
- After step 5 the item is back in its original room

## Notes
Executed through the API on 2026-11-18 (item 001000006): pass; the alert was left unacknowledged. The gantry decides authorized vs unauthorized itself: the server logs whatever it is told (Q-003). Gantry endpoints need no login. Explorations: explorations/2026-11-18-gantry-api.md.