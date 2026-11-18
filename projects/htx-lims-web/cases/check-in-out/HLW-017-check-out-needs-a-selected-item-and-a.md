---
id: HLW-017
title: "Check Out needs a selected item and a due date for loans"
feature: check-in-out
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Check Out validation

Verify that Check Out stays disabled with no item selected and that a loan needs a due date.

## Preconditions
- At least one item with status IN

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Check In / Out > Check Out
3. Look at the Check Out button with no item ticked
4. Tick one item, keep Purpose Loan, leave Due Date empty and click Check Out

## Expected
- With no item ticked the button reads Check Out 0 item(s) selected and is disabled
- Without a due date a message asks for the Due Date and the item stays IN
