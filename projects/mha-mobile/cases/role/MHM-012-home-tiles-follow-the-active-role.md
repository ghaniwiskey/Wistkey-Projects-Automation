---
id: MHM-012
title: "Home tiles follow the active role"
feature: role
priority: P2
tags: [regression]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
Each mobile role shows the modules it may use.

## Preconditions
- The mobile account holds LOGS1, URO and VET IC

## Data
- Cost centre: the first one the panel offers for each role

## Steps
1. Log in (lands as Agency Admin)
2. Switch to Logistics Officer 1
3. Switch to Unit Resource Officer
4. Switch to Verification Team IC/2IC

## Expected
- Step 1: Agency Admin shows no tiles
- Step 2: Asset Registration, Assign, Search Asset, Stocktake, New Asset, Settings
- Step 3: Assign, Search Asset, Stocktake, New Asset, Settings
- Step 4: Search Asset, Stocktake, New Asset, Settings

## Notes
Automated in tests/e2e/role/home-tiles.spec.ts.
FALO shows the same tiles as LOGS1 and Stocktaker the same as VET IC (seen 2026-10-16; Stocktaker covered by MHM-004).
