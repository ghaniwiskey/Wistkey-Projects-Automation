---
id: TWW-068
title: "Draft templates can only be deleted (no later submission)"
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
- Accepted behavior (BUG-025, wont-fix): a draft has no 提交審核 action; 刪除 is available

## Notes
BUG-025, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
