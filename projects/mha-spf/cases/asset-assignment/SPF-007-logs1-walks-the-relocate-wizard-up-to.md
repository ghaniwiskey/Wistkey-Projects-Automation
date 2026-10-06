---
id: SPF-007
title: "LOGS1 walks the Relocate wizard up to the location step"
feature: asset-assignment
priority: P1
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A Logistics Officer 1 can start a Relocate transaction: choose an asset, review it, and reach the location form prefilled with the current location. Read-only: the test stops before Submit.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active
- The asset is not part of an ongoing assignment transaction

## Data
- Asset ID: `111000010978` (current location: Group APD, postal code 819645)

## Steps
1. Open **Asset > Assignment**. -> Expect: heading "Assignment", a transactions table and a **Create** button.
2. Click **Create**. -> Expect: step "Assign - Start" with Assign (checked), Relocate and Assign & Relocate.
3. Choose **Relocate** and click **Next**. -> Expect: "Relocate - Choose Asset" with "0 asset(s) selected".
4. Search for `111000010978`, tick its checkbox and click **Next**.
5. On the Review step click **Next**.

## Expected
- After ticking the asset the counter shows "1 asset(s) selected".
- The Review step ("Relocate - Review") lists exactly 1 asset: 111000010978.
- The location step shows Group / NPC / Base "APD" and Postal Code "819645" prefilled, plus a **Submit** button.
- Nothing is submitted: no new transaction is created (the test leaves the wizard without clicking Submit).

## Notes
Submitting is a write (moves the asset, may send emails); cover it in a separate @writes case once a safe asset and revert path are agreed.

Automated in tests/e2e/asset-assignment/relocate-wizard.spec.ts (page objects in tests/pages). Passed 2 runs in a row on 2026-10-06.
