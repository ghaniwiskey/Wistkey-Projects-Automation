---
id: TWW-067
title: "Rejected template shows the reason and can be fixed"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff can see why Meta rejected a template and act on it.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Submit a template whose body starts and ends with a variable: {{first_name}} 你好，你的會員編號是 {{member_no}}
2. After 從 Twilio 同步, open its card and detail page

## Expected
- Card shows 已拒絕
- The rejection reason is shown (Meta: "Variables can't be at the start or end of the template.")
- There is a way to edit and resubmit, or a clear hint to create a new one

## Notes
Submits to Meta (irreversible record): needs the user's approval per run. Delete the template afterwards.
Related: BUG-025 (open).
