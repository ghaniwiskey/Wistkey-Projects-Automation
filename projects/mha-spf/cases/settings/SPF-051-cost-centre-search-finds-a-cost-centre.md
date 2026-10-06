---
id: SPF-051
title: "Cost centre search finds a cost centre by its description"
feature: settings
priority: P2
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The Cost Centre keyword box ("Cost Centre Code/Cost Centre Desc") matches codes and descriptions.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Agency Admin active

## Data
- The first cost centre in the list and its Description (read from its form)

## Steps
1. Settings > Cost Centre, open the first cost centre and note Code and Description
2. Back on the list, search the code
3. Search the description

## Expected
- Step 2 lists the cost centre
- Step 3 lists the cost centre

## Notes
BUG-012: description search returns no records (expected failure).

Automated in tests/e2e/settings/admin-settings.spec.ts.
