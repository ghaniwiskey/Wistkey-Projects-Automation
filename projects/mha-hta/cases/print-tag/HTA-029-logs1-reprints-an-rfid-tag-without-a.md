---
id: HTA-029
title: "LOGS1 reprints an RFID tag without a printer and the asset is listed as failed"
feature: print-tag
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
The Print Tag wizard (Start > Asset > Review > Reason > End) reaches the End step and, with no Zebra printer attached, reports the asset as not printed instead of failing silently.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Logistics Officer 1 active
- No Zebra Browser Print service on the test machine

## Data
- Asset `<asset>`: the first asset in Print Tag > Choose Asset (found at runtime)
- Reason: the first real reason in the dropdown

## Steps
1. Asset > Print Tag, keep **Reprint RFID Tag**, Next
2. Click Next with no asset ticked
3. Tick `<asset>`, Next; Review lists only `<asset>`; Next
4. Pick the reason and Submit
5. Close the printer error message

## Expected
- Step 2 shows "Please tick at least one asset to process."
- Review shows exactly one row, `<asset>`
- Step 4 shows the printer error "An error occured while attempting to connect to your Zebra Printer. ..."
- The End step shows "RFID tag printed", "0 Asset has their RFID Tag reprinted." and lists `<asset>` under "Below are the asset(s) that failed to print:"

## Notes
The Choose Asset list also offers Tag Type NA assets (the manual says ASSET or FILE only); accepted: mha-spf BUG-004 closed as wont-fix. Not asserted here.

Automated in tests/e2e/print-tag/print-tag.spec.ts.
