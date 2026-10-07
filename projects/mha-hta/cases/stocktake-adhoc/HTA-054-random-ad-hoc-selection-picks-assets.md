---
id: HTA-054
title: "Random ad hoc selection picks assets from at most Max Group / NPC / Base groups"
feature: stocktake-adhoc
priority: P2
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
Max Group / NPC / Base caps how many groups a random ad hoc selection draws its assets from.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Logistics Officer 1 active
- The unit has assets in more than 2 groups (Total Group / NPC / Base with no limit; checked when the test runs, skipped otherwise)

## Data
- Stocktake Name `QA auto adhoc random <unique>`, Periodic, MONTHLY
- Max Group / NPC / Base 1, then 2; up to 5 searches each (the pick is random)

## Steps
1. Open **Stocktake > Ad Hoc Setup**, **Create**, pick **Periodic** and **Random**, type the name, Recurrence Type **MONTHLY**, **Next**
2. Click **Search** with no filters and read Total Group / NPC / Base
3. Type Max Group / NPC / Base **1**, click **Search** up to 5 times and read Total Group / NPC / Base after each
4. Type Max Group / NPC / Base **2**, click **Search** up to 5 times and read Total Group / NPC / Base after each
5. Leave the wizard without submitting

## Expected
- Step 2: Total Group / NPC / Base is more than 2
- Step 3: Total Group / NPC / Base is 1 after every search
- Step 4: Total Group / NPC / Base is at most 2 after every search
- Nothing is created

## Notes
BUG-005 (open; mha-spf BUG-016 on SPF): the limit is exceeded now and then because an asset with no Group / NPC / Base is added as an extra group. The test stops at the first search over the limit. Marked test.fail while BUG-005 is open; the draw is random, so a run can miss the bug and report "passed unexpectedly" (HTA 2026-10-07: first run missed it, second run hit 4 assets from 3 groups with Max Group 1; on SPF UAT 2026-10-07 Max Group 1 went over in about 1 search in 7, Max Group 2 in about 1 in 3, so roughly 1 run in 15). Read-only: nothing is submitted.

Automated in tests/e2e/stocktake-adhoc/adhoc.spec.ts (AdHocCreatePage.randomSearch).
