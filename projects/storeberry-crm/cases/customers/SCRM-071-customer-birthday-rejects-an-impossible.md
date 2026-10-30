---
id: SCRM-071
title: "Customer birthday saves the chosen valid date"
feature: customers
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
A valid MM-DD birthday saved on a customer is kept.

## Preconditions
- A QA customer created for this test (email @example.com, opt-in No)

## Data
- Birthday 05-15 (any valid MM-DD different from the current value)

## Steps
1. Open the QA customer > Edit
2. Pick 05-15 in Birthday (MM-DD), close the picker and Save
3. Reopen Edit and read Birthday

## Expected
- Save succeeds
- Birthday shows 05-15 after reopening

## Notes
BUG-001, closed as wont-fix (accepted behavior): impossible dates such as 02-30 or 13-45 are saved silently as today, so they are not checked here.
