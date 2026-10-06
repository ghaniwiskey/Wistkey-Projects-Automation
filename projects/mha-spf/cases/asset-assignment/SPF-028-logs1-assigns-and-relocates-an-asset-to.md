---
id: SPF-028
title: "LOGS1 assigns and relocates an asset to a FALO in one transaction"
feature: asset-assignment
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The combined Assign & Relocate wizard (6 steps) changes the owner and the location in one auto-approved transaction (LOGS1 > FALO and relocation are both auto-approved).

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active
- The test account also holds the FALO role

## Data
- Asset `<asset>`: the shared writable asset (first asset in Assign > Choose Asset owned by the test account as LOGS1, found at runtime, fixture writableAsset)
- FALO: the test account's officer name (read from the header)
- Location remarks `<unique>`

## Steps
1. Asset > Assignment > Create, choose **Assign & Relocate**, Next
2. Search and tick `<asset>`, Next, Next (Review)
3. Assign step: Role **Fixed Asset Liaison Officer (FALO)**, Assignee = the test account's officer, Next
4. Location step: wait for the current location to load, set Remarks to `<unique>`, Submit
5. Asset > Assignment: search the transaction number from the message
6. Asset > Listing: open `<asset>`, tabs Ownership and Location

## Expected
- Step 4 shows "Asset Assignment #ASG<n> is created and approved." (no approval needed)
- The transaction is APPROVED and its type is ASSIGN & RELOCATE
- Ownership > Current FALO is the test account's officer; Location > Remarks is `<unique>`

## Notes
Cleanup: any SUBMITTED transaction on the asset is cancelled before and after (shared assignment hooks).
