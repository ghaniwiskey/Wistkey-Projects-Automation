---
id: HLW-060
title: "Stock Transaction Report lists an item's check-out and check-in"
feature: reports
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Each stock movement of an item appears in the Stock Transaction Report with type, user and time.

## Preconditions
- An item with status IN

## Steps
1. Log in as administrator, check the item out on Loan and check it in again on the handheld
2. Open Report > Stock Transaction Report and search for the item number

## Expected
- The report lists the check-out and the check-in in time order with the purpose, user and time
- The item type and location are shown for each row

## Notes
Coverage review 2026-11-19: this report had no case.
