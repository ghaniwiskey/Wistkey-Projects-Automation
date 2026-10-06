---
id: SPF-002
title: "Switch the active role from the header Role dropdown"
feature: auth
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A user holding several roles can change the active role from the header, and the side menu follows the role access rights.

## Preconditions
- Logged in as SPF-A2216GA with Agency Admin active

## Data
- User name: `SPF-A2216GA` (.env `SPF_AGENCY_ADMIN_USER`)
- Roles: Agency Admin, Logistics Officer 1

## Steps
1. Open the Dashboard as Agency Admin. -> Expect: the Role dropdown shows "Agency Admin" and the side menu shows **User**.
2. Open the **Role** dropdown and pick **Logistics Officer 1**.
3. Open the **Role** dropdown again and pick **Agency Admin**.

## Expected
- After step 2 the page reloads on `/IndexBk`, the Role dropdown shows "Logistics Officer 1" and the side menu no longer shows **User** (Dashboard, Asset, Stocktake, Report, Settings remain).
- After step 3 the Role dropdown shows "Agency Admin" and the side menu shows **User** again.

## Notes
Role is server-side state for the account, so later tests set their own role (test.use({ role })).

Automated in tests/e2e/auth/roles.spec.ts (page objects in tests/pages). Passed 2 runs in a row on 2026-10-06.
