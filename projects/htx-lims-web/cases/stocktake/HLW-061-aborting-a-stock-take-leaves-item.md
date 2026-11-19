---
id: HLW-061
title: "Aborting a stock take leaves item statuses unchanged and frees its items"
feature: stocktake
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
An aborted stock take changes no item status and its items can be put in a new stock take for the same period.

## Preconditions
- A QA stock take in Draft or In Progress with IN items (HLW-018)

## Steps
1. Log in as administrator, open Stock Take List, Show the QA stock take and click Abort (confirm)
2. Open Item Information for its items
3. Create a new stock take with the same items and an overlapping period

## Expected
- The stock take shows status Aborted
- Its items keep their status (no NOT FOUND)
- The new stock take is accepted (no "Can't submit item that already exists on the same period")

## Notes
Coverage review 2026-11-19: abort was used for clean-up but never checked. Related BUG-010.
