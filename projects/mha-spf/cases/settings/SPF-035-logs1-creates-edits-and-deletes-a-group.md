---
id: SPF-035
title: "LOGS1 creates, edits and deletes a Group"
feature: settings
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Settings > Group (Group / NPC / Base locations used by registration and assignment) supports create, update and delete, with the mandatory fields checked.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Cost centre: the first one offered in the form (found at runtime)
- Name (Short) `<unique>` (max 25), Name (Long) `<unique> long`

## Steps
1. Settings > Group > Create, click Update with an empty form
2. Fill cost centre, Name (Short), Name (Long), Update
3. Search `<unique>` and open it; change Name (Long) to `<unique> edited`, Update
4. Open it again, Delete, answer **Yes, delete it!**
5. Search `<unique>`

## Expected
- Step 1 shows "Cost Center is required", "Code is required" and "Name is required"
- Step 2 shows "Group has been successfully created." and the list shows the group with the chosen cost centre
- Step 3 shows "Group has been successfully updated." and the list shows `<unique> edited`
- Step 4 asks "Are you sure?" and then shows "Group has been successfully deleted"
- Step 5 shows no records

## Notes
Name (Short) must fit 25 characters, so the spec uses a short unique code. BUG-008: Description is cut to 200 characters silently (not asserted). Cleanup deletes leftover groups whose name starts with "QA auto".

Automated in tests/e2e/settings/group.spec.ts.
