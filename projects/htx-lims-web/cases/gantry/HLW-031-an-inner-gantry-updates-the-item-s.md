---
id: HLW-031
title: "An inner gantry updates the item's location without changing its status"
feature: gantry
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Location tracking

Verify that an item passing an inner gantry (1b, 2a, 2b, 3a) moves to that gantry's room, keeps its status and raises no alert.

## Preconditions
- An item with status IN
- Access to the HTX API Swagger page (/swagger) when no real gantry is available

## Data
- Gantry: 2a (Chemistry)

## Steps
1. Log in to HTX LIMS web with the administrator account and note the item's location in Inventory > Item Information
2. Send a read at gantry 2a: carry the tag through it, or in Swagger call POST /api/Gantry/authorizerfid with gantry 2a's IP and the item's chip code
3. Open Gantry > Gantry Log and Dashboard > Latest location
4. Move the item back with a read at an inner gantry of its original room

## Expected
- Gantry Log lists the item with Gantry 2a, Location Chemistry, Log Type Authorized
- Item Information and Latest location show the item in Chemistry with its status unchanged
- No new alert on the Dashboard

## Notes
Executed through the API on 2026-11-18 (item 001000009): pass.
