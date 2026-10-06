---
id: SPF-050
title: "Agency Admin updates a cost centre and Name is required"
feature: settings
priority: P2
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Settings > Cost Centre saves changes to a cost centre; the code is read-only and mandatory fields are checked.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Agency Admin active

## Data
- The first cost centre in the list
- Building: original + " QA"

## Steps
1. Settings > Cost Centre, pencil of the first cost centre
2. Clear Name, Update
3. Reload; append " QA" to Building, Update
4. Reload the form
5. Cleanup: put the original Building back, Update

## Expected
- Cost Centre (code) is read-only
- Step 2 shows "Name is required" and nothing is saved
- Step 3 shows "Cost Center has been successfully updated."
- Step 4 shows the new Building value
- Step 5 restores the original value

Automated in tests/e2e/settings/admin-settings.spec.ts.
