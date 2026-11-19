---
id: HLW-066
title: "A stock adjustment that sets a loaned item IN takes it off the gantry whitelist"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
An item set back to IN through the stock-take adjustment is no longer whitelisted and its loan is closed, like a normal check-in.

## Preconditions
- A completed stock take where a QA item checked out on Loan was located (proposed IN)

## Data
- Reason: QA adjust <unique>

## Steps
1. Log in as administrator, open the stock take's Stock Take Detail
2. Tick the item under Stock-take adjustment, keep New status IN, enter the reason and click Adjust
3. Open Gantry > Gantry Whitelist and Report > Loan Out Report

## Expected
- The item is IN
- It is no longer on the gantry whitelist
- The loan shows Returned with a Returned On date

## Notes
Found 2026-11-19 (HLW-055): 002000017 adjusted OUT -> IN stayed whitelisted with purpose LOAN. Same gap as BUG-001 (web check-in).
