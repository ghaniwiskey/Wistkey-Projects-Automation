---
id: SPF-009
title: "LOGS1 assigns an asset to a FALO and it is auto-approved"
feature: asset-assignment
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Assignment from LOGS1 to FALO needs no approval (manual > Asset Assignment rules) and sets the asset FALO owner.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active
- Asset 111000010979 is not in an ongoing transaction

## Data
- Asset ID: `111000010979`
- Assignee: Fixed Asset Liaison Officer (FALO) "Wong Pui Lai Annie" (SPF-A2216GA (holds both LOGS1 and FALO; officer "Wong Pui Lai Annie"))

## Steps
1. Open **Asset > Assignment**, click **Create**, keep **Assign** and click **Next**.
2. Search for `111000010979`, tick it and click **Next** twice.
3. Pick Role **Fixed Asset Liaison Officer (FALO)**, Assignee **Wong Pui Lai Annie** and click **Submit**.
4. Open asset 111000010979 and go to the **Ownership** tab.

## Expected
- The End step shows "Asset Assignment #ASG<number> is created and approved."
- The transaction is listed as ASSIGN with status APPROVED.
- Ownership shows Current FALO "Wong Pui Lai Annie".

## Notes
Before and after: cancel any SUBMITTED assignment transaction on asset 111000010979 (owner Cancel, reason Others "QA cleanup").
