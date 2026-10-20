---
id: MHM-018
title: "FAVE sighting at a wrong location on the mobile app raises a relocation for LOGS1"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A stocktaker sights an asset but marks the location as wrong and enters the new one; MHA web keeps the location open and creates a RELOCATE transaction with the new location for LOGS1 to approve.

## Preconditions
- As MHM-017
- The web account also holds Logistics Officer 1 on the cost centre

## Data
- FAVE asset: fixture faveTarget
- New location: Group/NPC/Base and postal code of the asset's current location, Room No Q<unique>, location remarks QA auto mobile new location
- Remarks: QA auto mobile wrong location <unique>

## Steps
1. Mobile: Stocktaker | cost centre > the FAVE (online) > the asset
2. Sighted on, Correct Location off; pick the Group/NPC/Base, type the postal code (building and address fill in), Room No, location remarks and remarks; SAVE > CONFIRM
3. REVIEW > Submit
4. MHA web (VET IC): FAVE Details / Update Result of the asset
5. MHA web (LOGS1): Asset > Assignment, open the newest transaction
6. Cleanup: Reject it (Others, remarks), set the FAVE result back to PENDING

## Expected
- Step 2: turning Correct Location off shows the new-location fields; the postal code fills Building Name and Address
- Step 4: Result SIGHTED WORKING, Correct Location unticked, Location Status OPEN, FAVE Status CLOSED, remarks as typed
- Step 5: RELOCATE by the mobile officer, Approver Role Logistics Officer 1, Status SUBMITTED; Asset Location shows the postal code, Room No and location remarks from the phone
- Step 6: "Assignment has been rejected." and the result is PENDING again

## Notes
Same as the web flow SPF-039 but raised from the phone. The test rejects the relocation (an approved one locks the FAVE result, mha-spf BUG-009 wont-fix).
Automated in tests/e2e/stocktake/fave-outcomes.spec.ts. The new address is picked like in MHM-010: the asset's own row when the list has it, else the first row of its postal code (HTA).
