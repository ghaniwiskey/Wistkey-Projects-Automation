---
id: HLM-018
title: "All Assets filters by status"
feature: assets
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
All Assets filter

Verify that the All Assets status filter lists only items with the chosen status.

## Preconditions
- Items checked out (Loan / No Return) and in use (For Use)

## Steps
1. On the handheld open All Assets and Refresh list
2. Choose status Checked out, then In use, then Not check-in

## Expected
- Each filter shows only items with that status and the count of matching assets
- Checked out = Loan and No Return items; In use = For Use items

## Notes
Executed 2026-11-19: Checked out 13, In use 7, Not check-in 0: pass. Disposed items are not filterable (BUG-002).
