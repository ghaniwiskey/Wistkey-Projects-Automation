---
id: SBF-013
title: "Member edits profile and it syncs to the CRM"
feature: account
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Profile changes persist and reach the CRM.

## Data
- Last name: <unique>
- Mobile: 9123xxxx

## Steps
1. My Profile: clear First Name > Save Change
2. Restore it, change Last Name and Mobile > Save Change
3. Reload My Profile
4. Open the member in the CRM

## Expected
- Blank First Name is blocked (required)
- "Update successful"
- New values shown after reload
- CRM customer detail shows the new last name and mobile

## Notes
Email and Birthday are read-only on My Profile. Verified 2026-10-27.
