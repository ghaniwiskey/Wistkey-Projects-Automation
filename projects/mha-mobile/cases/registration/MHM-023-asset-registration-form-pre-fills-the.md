---
id: MHM-023
title: "Asset Registration form leaves location remarks empty"
feature: registration
priority: P1
tags: [regression]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-26
---

## Goal
Confirm the accepted empty Remarks field on the phone's Register Asset form even when the PROGRESS asset has location remarks on MHA web, without saving.

## Preconditions
- A PROGRESS asset with location remarks in a cost centre the mobile account holds as Logistics Officer 1

## Data
- Asset: among the first three in the phone's Register Asset list, the first that has location remarks on MHA web (read as Agency Admin)

## Steps
1. MHA web: read the asset's location Remarks
2. Mobile: Logistics Officer 1 | cost centre > Asset Registration > the asset
3. Leave the form without Save

## Expected
- Step 2: Remarks is empty and shows the "(Optional)" hint, rather than the asset's location remarks from MHA web

## Notes
Read-only (nothing is saved). BUG-004, closed as wont-fix on 2026-10-26: empty Remarks and clearing existing remarks if saved unchanged are accepted behavior. This case checks the empty hint only; MHM-013 explicitly retypes remarks to preserve them.
Automated in tests/e2e/registration/registration.spec.ts; no expected-failure marker.
