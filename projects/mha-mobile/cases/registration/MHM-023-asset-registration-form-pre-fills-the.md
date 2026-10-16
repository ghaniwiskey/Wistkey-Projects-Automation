---
id: MHM-023
title: "Asset Registration form pre-fills the asset's location remarks"
feature: registration
priority: P1
tags: [regression]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
The phone's Register Asset form shows the PROGRESS asset's current location remarks, so completing the registration does not erase them (MHA web Complete Register loads them).

## Preconditions
- A PROGRESS asset with location remarks in a cost centre the mobile account holds as Logistics Officer 1

## Data
- Asset: among the first three in the phone's Register Asset list, the first that has location remarks on MHA web (read as Agency Admin)

## Steps
1. MHA web: read the asset's location Remarks
2. Mobile: Logistics Officer 1 | cost centre > Asset Registration > the asset
3. Leave the form without Save

## Expected
- Step 2: Remarks shows the asset's location remarks from MHA web (not the empty "(Optional)" hint)

## Notes
Read-only (nothing is saved). Fails on UAT 2026-10-16: BUG-004 (Remarks empty; Save clears them).
Automated in tests/e2e/registration/registration.spec.ts (expected to fail while BUG-004 is open).
