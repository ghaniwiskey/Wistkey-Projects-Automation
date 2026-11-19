---
id: BUG-010
title: "Create Stock Take offers items that it then refuses for the same period"
severity: minor
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/stocktake"
updated: 2026-11-19T02:20:27.221Z
found: 2026-11-19T02:20:27.221Z
foundBy: "explorations/2026-11-18-web-testing.md"
tests: [HLW-018]
frequency: always
---
## Summary
Unselected Items lists items that are already in another stock take for an overlapping period; Submit then fails with 'Can't submit item that already exists on the same period'.

## Steps to reproduce
1. Stock Take > Create Stock Take, Storage Location Airlock 1, Search
2. Select 001000009 (in another stock take this week), Move to Selected, title, dates this week, Submit

## Expected
Items already in a stock take for the period are not offered (or are marked), so the list only shows items that can be submitted.

## Actual
'Failed Can't submit item that already exists on the same period : 001000009' (19/11/2026); same on 18/11 for Biology, Office and Chemistry items.

## Evidence
- 

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/stocktake
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-18-web-testing.md in the Test Manager app.
