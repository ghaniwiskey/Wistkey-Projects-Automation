---
id: TWW-084
title: "Editor cannot change contacts of another user's template"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Contacts can only be reset or deleted by the template owner (or admin).

## Preconditions
- A QA editor created by the admin (delete afterwards)
- A QA contact on an admin template

## Steps
1. Log in as the QA editor
2. Open /templates/<admin template>/contacts
3. Click 全部重置, then delete the contact

## Expected
- The page does not show the contacts; reset and delete are refused (403/404)

## Notes
Use only QA contacts: the actions really change data when the bug is present.
Related: BUG-001 (open).
