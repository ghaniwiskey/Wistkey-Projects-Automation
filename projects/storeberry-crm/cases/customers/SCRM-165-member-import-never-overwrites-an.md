---
id: SCRM-165
title: "Member import never overwrites an existing member's points, level, spending or opt-in"
feature: customers
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A bulk import cannot silently damage existing customer accounts.

## Preconditions
- A QA member we created, with points, a level and opt-in No; note them

## Data
- Import file: one row with the QA member's email/phone and different name, points, level and opt-in Yes; one new QA member

## Steps
1. Customer List Management > New Member List > upload the file
2. Open the existing QA member and the new one

## Expected
- The existing member is refused as a duplicate (or only allowed fields change, as the screen states); points, level, spending and opt-in are unchanged
- The new member is created
- Cleanup: delete the new member

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested. Related: SCRM-154.
