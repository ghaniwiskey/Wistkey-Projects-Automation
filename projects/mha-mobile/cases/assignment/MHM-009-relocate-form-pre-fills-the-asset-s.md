---
id: MHM-009
title: "Relocate form pre-fills the asset's location remarks"
feature: assignment
priority: P1
tags: [regression]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
The phone's Relocate form shows the asset's current location remarks, so a relocation does not overwrite them.

## Preconditions
- The mobile account holds Logistics Officer 1
- The web account holds Logistics Officer 1

## Data
- Asset: first AVAILABLE asset of MHA web Asset Listing (LOGS1) that has location remarks and whose cost centre the phone offers

## Steps
1. MHA web: read the asset's location Remarks
2. Mobile (LOGS1, the asset's cost centre): Assign > Select Asset > the asset > RELOCATE
3. Leave the form without Complete

## Expected
- Step 2: Remarks shows the asset's location remarks from MHA web (not "No Remarks")

## Notes
Automated in tests/e2e/assignment/relocate.spec.ts (test.fail while BUG-002 is open).
Read-only (nothing is submitted). Fails on UAT 2026-10-16: BUG-002 (Remarks always "No Remarks"; Complete saves that text).
