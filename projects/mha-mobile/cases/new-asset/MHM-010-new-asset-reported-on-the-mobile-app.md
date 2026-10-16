---
id: MHM-010
title: "New Asset reported on the mobile app shows on MHA web"
feature: new-asset
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A potential asset reported from the phone (condition, description, remarks, location, photo) arrives on MHA web as an OPEN New Asset request with the same data.

## Preconditions
- The mobile account holds Logistics Officer 1
- The web account holds Logistics Officer 1 on the same cost centre
- A photo under 3 MB is in the emulator gallery (the test pushes one)

## Data
- Cost centre and address: the first AVAILABLE asset of MHA web Asset Listing (LOGS1) whose cost centre the phone offers; its postal code and address
- Description QA auto mobile <unique>; Remarks QA auto mobile test, please ignore; Level 1; location remarks QA auto mobile location

## Steps
1. Mobile: log in, switch to Logistics Officer 1 and the cost centre, tap New Asset
2. Tap SAVE on the empty form
3. Pick Asset Condition WORKING, type description and remarks
4. Type the postal code, pick the address in "Select Address:-", OK; type Level and location remarks
5. Upload Image > pick the newest photo > Done
6. Tap SAVE
7. MHA web: Asset > New Asset, search the description; open the request
8. Cleanup: Cancel Item, reason Others, remarks QA cleanup

## Expected
- Step 2: the form stays and the app toasts "Please select asset condition" (toasts are not readable by the automation, which checks that the form stays)
- Step 5: the photo preview shows with "Change Image"
- Step 6: the app returns to the home screen
- Step 7: one OPEN request RNA<n> with the description, the cost centre and the mobile officer as Created By
- Step 7: the request shows condition WORKING, the remarks, postal code, address, Level 1, the location remarks and a photo
- Step 8: "The reported new asset has been cancelled." and Status CANCELLED

## Notes
Automated in tests/e2e/new-asset/new-asset.spec.ts.
Writes on UAT and emails all LOGS1 and VET IC of the unit (like mha-spf SPF-016); the request is cancelled at the end. A tiny image (85-byte PNG) is dropped by the app without a message.
