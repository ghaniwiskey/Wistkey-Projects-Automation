---
id: SCRM-163
title: "Staff user list and User Security Settings"
feature: auth
priority: P1
tags: [regression, security]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff accounts and their security rules are managed safely.

## Preconditions
- Ask the user first: this is a settings change (README > Testing permissions). Do not edit or delete other people's accounts.

## Steps
1. Open Setting > users; read the list and User Security Settings
2. Open the own account Edit and My Profile

## Expected
- The list shows staff with roles; security settings (password rules, 2FA, session) are readable
- Changing the own profile name saves and is reverted
- Delete is not offered on the logged-in account (or asks for confirmation)

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Related: SCRM-138 (role limits).
