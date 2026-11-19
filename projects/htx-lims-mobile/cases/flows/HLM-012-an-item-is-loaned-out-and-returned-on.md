---
id: HLM-012
title: "An item is loaned out and returned on the handheld"
feature: flows
priority: P0
tags: [smoke, writes]
envs: [all]
automated: true
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Loan and return

Verify the loan part of the item workflow end to end: an IN item checked out on loan on the handheld is whitelisted, and after the return (pre check-in and check-in) it is IN again and off the whitelist.

## Preconditions
- An IN item that is not a chemical and not whitelisted
- The handheld app signed in

## Data
- Due date: tomorrow
- Remarks: QA hlm loan <unique>

## Steps
1. On the handheld, open Check-out, find the item, choose Loan with the due date and remarks, verify and confirm
2. On the web, check the item
3. On the handheld, pre check-in the item (it shows as Loan), verify, count and upload
4. On the handheld, check the item in
5. On the web, check the item

## Expected
- After the check-out: "All 1 item(s) were checked out."; the item is OUT, purpose LOAN, on the gantry whitelist
- After the return: the item is IN, the purpose is cleared and it is no longer on the gantry whitelist

## Notes
End-to-end automation of HLM-006 and HLW-034 (tests/e2e/flows/item-lifecycle.spec.ts). The item is picked at run time.
