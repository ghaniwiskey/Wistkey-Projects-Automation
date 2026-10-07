---
id: HTA-007
title: "LOGS1 walks the Relocate wizard up to the location step"
feature: asset-assignment
priority: P1
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
A Logistics Officer 1 can start a Relocate transaction: choose an asset, review it, and reach the location form prefilled with the current location. Read-only: the test stops before Submit.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Logistics Officer 1 active
- The asset is not part of an ongoing assignment transaction

## Data
- Asset `<asset>`: the first asset in the Relocate > Choose Asset list (only selectable assets are listed)

## Steps
1. Open **Asset > Assignment**. -> Expect: heading "Assignment", a transactions table and a **Create** button.
2. Click **Create**. -> Expect: step "Assign - Start" with Assign (checked), Relocate and Assign & Relocate.
3. Choose **Relocate** and click **Next**. -> Expect: "Relocate - Choose Asset" with "0 asset(s) selected".
4. Note the first asset in the list (`<asset>`) and its Group, search for it, tick its checkbox and click **Next**.
5. On the Review step click **Next**.

## Expected
- After ticking the asset the counter shows "1 asset(s) selected".
- The Review step ("Relocate - Review") lists exactly 1 asset: <asset>.
- The location step shows Group / NPC / Base equal to the Group shown for the asset in Choose Asset and a 6-digit Postal Code prefilled, plus a **Submit** button.
- Nothing is submitted: no new transaction is created (the test leaves the wizard without clicking Submit).

## Notes
HTA UAT data: many assets carry a group of another cost centre (e.g. a 338000 asset in "CCS - EMSB"). The location step offers only the groups of the asset's cost centre, so then the group is not prefilled; the test checks the prefill only when the asset's group is offered and otherwise records a note.

Submitting is a write (moves the asset, may send emails); cover it in a separate @writes case once a safe asset and revert path are agreed.

Automated in tests/e2e/asset-assignment/relocate-wizard.spec.ts (page objects in tests/pages).
