---
id: BUG-021
title: "Create Stock Take saves nothing and shows no message for some items and periods"
severity: minor
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/stocktake"
updated: 2026-11-19T07:15:57.609Z
found: 2026-11-19T07:15:57.609Z
foundBy: "htx-lims-mobile run 2026-11-19 (test data setup)"
tests: [HLW-018]
frequency: always
---
## Summary
Submitting a stock take for 19-20/11 with Box9, Box10, Box11 (Airlock 1) saved nothing and showed no message; the same items for 18-21/12 saved as ST00000020. The Keyword search also returned nothing for IN items 002000023, 001000031 and 001000029. Probably these items are in an in-progress stock take for an overlapping period (ST00000008 / ST00000010), which used to give "Can't submit item that already exists on the same period".

## Steps to reproduce
1. Stock Take > Create Stock Take, Storage Location Airlock 1, Search
2. Tick Box9, Box10, Box11, Move to Selected, tick them again
3. Title, proposed dates today and tomorrow, Submit

## Expected
The stock take is saved, or a message says why not (e.g. item already in a stock take for that period).

## Actual
Nothing saved, no message.

## Evidence
- 

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/stocktake
- Env: staging

## History
- 2026-11-19: filed from htx-lims-mobile run 2026-11-19 (test data setup) in the Test Manager app.
