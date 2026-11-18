---
id: HLM-006
title: "Check out an item on loan on the handheld"
feature: check-out
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Handheld check-out

Verify that an IN item can be checked out on loan on the handheld with a due date and remarks, and is then OUT on loan and whitelisted.

## Preconditions
- An item with status IN

## Data
- Type: Loan
- Due date: one week ahead
- Remarks: QA loan <unique>

## Steps
1. On the handheld tap Check-out, enter the item number and tap Find item
2. Select type Loan, pick the due date, enter remarks and tap Add to list
3. Verify the tag (scan, or QA: simulate verify scan), tap Review check-out, then Confirm check-out
4. On the web open Report > Loan Out Report and Gantry > Gantry Whitelist

## Expected
- Past days are disabled in the due date picker
- "Check-out uploaded - All 1 item(s) were checked out."
- The web shows the item OUT, on loan, with the due date and remarks, and on the gantry whitelist
- Audit Trail: "Check-out Item <n> (Handheld) Loan"

## Notes
Executed 2026-11-18 with 002000017 (loan 28): pass. Add to list without due date or remarks gives no message (BUG-006).
