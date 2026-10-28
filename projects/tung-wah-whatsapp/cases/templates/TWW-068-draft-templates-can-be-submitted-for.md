---
id: TWW-068
title: "Draft templates can be submitted for review later"
feature: templates
priority: P3
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A template saved as draft can be sent to Meta without recreating it.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Create a template with Meta unticked
2. Open its detail page

## Expected
- A "提交審核" action is available

## Notes
Currently there is none; drafts can only be deleted.
Related: BUG-025 (open).
