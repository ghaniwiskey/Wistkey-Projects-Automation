---
id: HLW-057
title: "Stock at or above maximum raises a High stock alert"
feature: alerts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
An item type whose stock reaches its Max. stock raises a High stock alert on the Dashboard.

## Preconditions
- A QA item type with Max. stock equal to its current stock + 1 (Master Data > Item Type), Min empty (Q-008)

## Steps
1. Log in as administrator and note the Dashboard alert count
2. Bring one more item of that type to IN (receive one, or check a loaned one back in)
3. Wait one minute and refresh the Dashboard
4. Open Report > Stock Level Report for the type

## Expected
- A High stock alert names the item type, its stock and the maximum
- Stock Level Report shows the type at or above Max
- Report > Alert History lists the alert

## Notes
Coverage review 2026-11-19: Low stock is HLW-046; High stock (>= Max) had no case.
