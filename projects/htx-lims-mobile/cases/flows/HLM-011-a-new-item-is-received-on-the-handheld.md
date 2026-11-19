---
id: HLM-011
title: "A new item is received on the handheld: pre check-in and check-in"
feature: flows
priority: P0
tags: [smoke, writes]
envs: [all]
automated: true
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Receive a new item

Verify the receiving part of the item workflow end to end: an item registered and printed on the web is pre checked-in and checked in on the handheld and is then IN in the lab.

## Preconditions
- The UAT tag printer "test" is available
- The handheld app is signed in

## Data
- Item: Consumable / Glove, description QA hlm <unique>, lot QA-LOT

## Steps
1. On the web, register the item in Item Register and print its tag in Asset Tag Printing (printer test)
2. On the handheld, open Pre Check-in, refresh the items, add the item's chip code, verify, count and upload
3. On the web, check the item's status
4. On the handheld, open Check-in, refresh, find the item by number, add, verify, count and upload
5. On the web, check the item's status and room

## Expected
- After pre check-in: "All 1 tag(s) were pre checked-in." and the item is NOT CHECKED IN on the web (not IN yet)
- After check-in: "1 item(s) checked in." and the item is IN in Airlock 1 (the default room)
- The item is not on the gantry whitelist

## Notes
End-to-end automation of HLM-003 and HLM-004 (tests/e2e/flows/item-lifecycle.spec.ts). Uses the dev build's QA simulation buttons instead of a reader.
