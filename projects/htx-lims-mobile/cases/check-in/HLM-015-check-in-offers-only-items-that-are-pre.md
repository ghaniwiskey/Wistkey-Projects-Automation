---
id: HLM-015
title: "Check-in offers only items that are pre checked-in"
feature: check-in
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Check-in candidates

Verify that Check-in on the handheld only finds items waiting for check-in (pre checked-in), not items that are IN, OUT For Use or not pre checked-in.

## Preconditions
- Items in the states IN, OUT For Use, printed only, and pre checked-in

## Steps
1. On the handheld open Check-in
2. Enter each item number and tap Find item

## Expected
- IN, For Use and printed-only items: "No item waiting for check-in matches this input."
- The pre checked-in item: "Pre Check-in done · Ready for check-in" with Add to check-in

## Notes
Executed 2026-11-19 (001000031, 002000022, 002000020, 002000023): pass; 002000023 was checked in afterwards.
