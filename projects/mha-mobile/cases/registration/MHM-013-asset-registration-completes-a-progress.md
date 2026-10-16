---
id: MHM-013
title: "Asset Registration completes a PROGRESS asset from the phone"
feature: registration
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
LOGS1/FALO completes the location of a partially registered (PROGRESS) asset on the phone; MHA web shows it registered with the new location and photo.

## Preconditions
- A PROGRESS asset in a cost centre the mobile account holds as Logistics Officer 1
- A photo in the emulator gallery (the test pushes one)

## Data
- Asset: the first PROGRESS asset of MHA web Asset Listing (LOGS1) whose cost centre the phone offers to LOGS1
- New Room No: R<unique> (max 5 characters); location remarks retyped as they are (BUG-004)

## Steps
1. MHA web: read the asset's Location
2. Mobile: Logistics Officer 1 | cost centre > Asset Registration; the asset is in "Register Asset (n)"
3. Open it; set Room, retype the remarks, Upload Image > the newest photo > Done, Save > OK
4. MHA web: the asset's status, Location and photo

## Expected
- Step 3: the form pre-fills Group/NPC/Base, postal code, building, address, block, level and room; Save shows "Success / Registration Success" and the asset leaves the list
- Step 4: status AVAILABLE (was PROGRESS), Room No is the new value, postal code, block, level and remarks unchanged, the photo is the asset's default photo

## Notes
Completing cannot be undone, so each run uses an asset up; the test skips when none is left. Explored 2026-10-16 on 111000011323 (the only PROGRESS asset in the officer's units; 16 more are in 332300, which the mobile account does not hold): Registration Success, AVAILABLE, Room and photo on web, but the remarks were erased (BUG-004; restored by a phone relocation). Empty postal code: toast "Please input postal code". Upload Image asks for the camera permission first. The registration left Current LOGS1 / FALO "-".
Automated in tests/e2e/registration/registration.spec.ts.