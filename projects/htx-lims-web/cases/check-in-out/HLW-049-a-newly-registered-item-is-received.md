---
id: HLW-049
title: "A newly registered item is received into stock through pre check-in, count and check-in"
feature: check-in-out
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
The main receiving flow end to end: a new item goes from NOT PRE CHECK IN to IN and only then counts in stock and can be checked out.

## Preconditions
- The handheld app signed in (emulator is fine)
- Printer "test" in Asset Tag Printing

## Data
- Item category: Consumable, first item type of that category with no Max set
- Item description: QA receive <unique>, Number of units: 1

## Steps
1. Log in to HTX LIMS web as administrator and note the item type's Stock in Report > Stock Level Report
2. Register the item in Registration > Item Register and print its tag in Asset Tag Printing
3. Look for the item in Check In / Out > Check Out and in Stock Level Report
4. On the handheld, pre check-in the item (scan its tag) and count it
5. Check the item in at a storage location (handheld check-in, or web Check In if it lists the item)
6. Open Item Information, Check Out and Stock Level Report again

## Expected
- Before check-in the item is not offered in Check Out and the Stock does not include it
- After pre check-in and count the status is NOT CHECKED IN and the item is listed under Tagged Not Checked In and Count Item
- After check-in the status is IN at the chosen storage location and the item is offered in Check Out
- The item type's Stock is 1 higher than in step 1
- Audit Trail has entries for registration, tag printing, pre check-in, count and check-in

## Notes
Coverage review 2026-11-19: each step was tested on its own (HLW-010, 013, 032, HLM-003, HLM-004) but never one item from registration to stock. Web Check In only lists OUT items today (Q-006), so the handheld check-in may be the only way in.
