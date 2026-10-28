---
id: SCRM-138
title: "A staff account with a limited role cannot see or open admin-only pages"
feature: auth
priority: P1
tags: [regression, security]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff roles restrict what each staff member can do in the CRM.

## Preconditions
- A second staff account with a limited role. Ask the user first: creating staff or changing staff mapping needs approval (README)

## Data
- Admin-only URLs read at runtime from the .env staff account menus (settings, staff, promotions, reports)

## Steps
1. Log in as the limited staff account and note the menus
2. Open each admin-only URL directly

## Expected
- Menus show only what the role allows
- Direct URLs are refused or redirected; no data is shown and nothing can be saved

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
