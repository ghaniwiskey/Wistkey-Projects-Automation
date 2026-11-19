---
id: HLW-059
title: "Stock Received & Utilised Report counts received and used items"
feature: reports
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Items received into stock and items checked out For use / No return are counted for their item type and period.

## Preconditions
- An item type with items received and used in the chosen period (e.g. after HLW-016 and HLW-049)

## Steps
1. Log in as administrator and open Report > Stock Received & Utilised Report
2. Pick the period covering today and search
3. Compare the item type's figures with the Check In Out Report for the same period

## Expected
- Received matches the items of the type checked in for the first time in the period
- Utilised matches the For use and No return check-outs; Loans are not counted as utilised
- Export downloads the columns shown

## Notes
Coverage review 2026-11-19: this report had no case. Confirm the meaning of Received / Utilised with the user if the figures differ.
