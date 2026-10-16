---
id: MHM-008
title: "Relocation made on the mobile app is approved and moves the asset on MHA web"
feature: assignment
priority: P0
tags: [smoke, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A LOGS1 relocates an asset from the phone; the relocation is auto-approved and MHA web shows the new location.

## Preconditions
- The mobile account holds Logistics Officer 1
- The web account holds Logistics Officer 1

## Data
- Asset: first AVAILABLE asset of MHA web Asset Listing (LOGS1) whose cost centre the phone offers for LOGS1
- New Room No: Q<unique> (max 5 characters); location remarks retyped as they are (BUG-002)

## Steps
1. MHA web: read the asset's Location (Postal Code, Block, Level, Room No, Remarks)
2. Mobile: log in, switch to Logistics Officer 1 and the asset's cost centre, tap Assign
3. Select Asset > search the Asset ID > + > close; Asset Selected shows 1
4. Transaction type RELOCATE; set Room to the new value, type the original remarks, tap Complete
5. MHA web: Asset > Assignment and the asset's Location
6. Cleanup: relocate it back from the phone (original Room and remarks)

## Expected
- Step 4: RELOCATE pre-fills the asset's postal code, building, block, level and room; after Complete the form resets (Asset Selected 0)
- Step 5: the newest transaction is RELOCATE, cost centre of the asset, created by the mobile officer, Status APPROVED (no approver needed)
- Step 5: the asset's Room No is the new value; postal code, block, level and remarks are unchanged
- Step 6: Room No and remarks are back to the original values

## Notes
Automated in tests/e2e/assignment/relocate.spec.ts.
Writes on UAT: two auto-approved RELOCATE transactions per run. Remarks are retyped because the phone does not pre-fill them (BUG-002).
