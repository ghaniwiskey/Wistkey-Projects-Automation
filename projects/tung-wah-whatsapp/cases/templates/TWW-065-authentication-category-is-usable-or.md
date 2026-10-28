---
id: TWW-065
title: "AUTHENTICATION category is usable or not offered"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Every category in the dropdown can be submitted.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Open 新建模板, choose AUTHENTICATION, body 您的驗證碼是 {{code}}，請勿分享。, one button, Meta ticked
2. Submit

## Expected
- Either the template is submitted successfully, or AUTHENTICATION is not offered
- No orphan draft is left in Twilio

## Notes
Submits to Meta (irreversible record): needs the user's approval per run. Delete the template afterwards.
Related: BUG-023 (open).
