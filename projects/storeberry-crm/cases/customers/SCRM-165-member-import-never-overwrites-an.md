---
id: SCRM-165
title: "Member import never overwrites an existing member's points, level, spending or opt-in"
feature: customers
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
A bulk import cannot silently damage existing customer accounts.

## Preconditions
- A QA member we created, with points, a level and opt-in No; note them

## Data
- Import file: one row with the QA member's email/phone and different name, points, level and spending; include a conflicting opt-in only if the current template supports it; one new QA member

## Steps
1. Customers > Import > Import CSV > download the sample, fill it and upload the file once
2. Open the existing QA member and the new one

## Expected
- The existing member is refused as a duplicate (or only allowed fields change, as the screen states); points, level, spending and opt-in are unchanged
- The new member is created
- Cleanup: delete the new member only with explicit approval; retain it when the user requests this

## Notes
Related: SCRM-154. The current CSV template has no opt-in column: verify existing opt-in is unchanged, but do not claim a conflicting-consent overwrite was exercised. Import may send registration email; obtain specific approval for each run and retry. On 2026-10-30 the user approved one staging import and requested retaining the QA members and list. Business checks passed; cleanup was waived. Evidence: explorations/2026-10-30-member-import-protection.md.
