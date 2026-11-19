---
id: HLM-013
title: "Check out For Use and No Return on the handheld"
feature: check-out
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
For Use and No Return

Verify that the handheld checks items out For Use (stays in the lab, not whitelisted) and No Return (leaves for good, whitelisted), and that stock goes down for both.

## Preconditions
- Two IN items of the same item type (not chemicals)

## Data
- Types: For Use, No Return; remarks QA <unique>

## Steps
1. On the web note the item type's stock (Report > Stock Level Report)
2. On the handheld tap Check-out, find the first item, choose For Use, add remarks, Add to list
3. Find the second item, choose No Return, add remarks, Add to list
4. Verify both, Review check-out, Confirm check-out
5. On the web check both items and the stock

## Expected
- For Use reads "Stays in the lab · Status changes to In use · Cannot pass gantry"; No Return reads "Leaves the lab permanently · Can pass gantry"
- "Check-out uploaded - All 2 item(s) were checked out."
- Web: both OUT; For Use not on the gantry whitelist, No Return on it
- The item type's stock is 2 lower

## Notes
Executed 2026-11-19 with 002000022 (For Use) and 002000024 (No Return): pass; Glove stock 3 -> 1. The type picker keeps the previous item's type.
