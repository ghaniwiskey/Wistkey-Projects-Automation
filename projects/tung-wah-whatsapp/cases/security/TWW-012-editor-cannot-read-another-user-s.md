---
id: TWW-012
title: "Editor cannot read another user's contacts or report"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Contacts and reports of a template are visible only to its owner (and admins).

## Preconditions
- An editor account
- A template owned by another user with contacts

## Steps
1. As admin, make sure a template owned by the admin has at least one contact
2. Log in as a QA editor
3. Request that template, its contacts and its export (report) by template ID

## Expected
- All three return 404 or 403
- No names or phone numbers of the admin's contacts are returned

## Notes
Template detail correctly returns 404 for the editor; contacts and export do not.
Related: BUG-001 (open).
