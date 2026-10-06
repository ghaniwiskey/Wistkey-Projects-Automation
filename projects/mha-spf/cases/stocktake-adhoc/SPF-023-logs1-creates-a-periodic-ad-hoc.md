---
id: SPF-023
title: "LOGS1 creates a periodic ad hoc stocktake and cancels it with a reason"
feature: stocktake-adhoc
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A periodic ad hoc stocktake that has not started yet stays CREATED and its owner can cancel it with a reason.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active

## Data
- Asset `<asset>`: the first asset in Choose Asset
- Stocktake Name `QA auto adhoc periodic <unique>`
- Recurrence MONTHLY, Number of Recurrence 1, Start Date tomorrow (default)
- Cancel reason Others, remarks `QA test, please ignore`

## Steps
1. Open **Ad Hoc Setup > Create**, keep **Periodic**, pick **Manual**, type the name, pick Recurrence Type **MONTHLY**, keep the start date, **Next**
2. Tick the first asset, **Next**, **Submit**
3. Open the new number from **Ad Hoc Setup**
4. Click **Cancel**, open the **Reason** dropdown
5. Pick **Others**, type the remarks, **Submit**

## Expected
- The End step shows "Ad Hoc Stocktake No. ADST<number> has been created"; Ad Hoc Setup shows it with MONTHLY, PERIODIC and status CREATED
- The details page shows a **Cancel** button
- The Reason dropdown offers a readable reason (Others)
- Picking Others shows a mandatory Remarks box; Submit shows "Stocktake Ad Hoc has been cancelled." and the status becomes CANCELLED

## Notes
BUG-001: the only Reason option has an empty label, so a user cannot pick it by name and gets "Reason is required". The automated test is marked as an expected failure until the bug is fixed; its cleanup cancels the setup by selecting the hidden option value OTHER.

Automated in tests/e2e/stocktake-adhoc/adhoc.spec.ts, marked test.fail() for BUG-001 (it counts as passing while the bug is open; when the bug is fixed the run reports an unexpected pass: remove test.fail()). Cleanup fixture cancelCreatedAdHocs cancels CREATED periodic QA setups.
