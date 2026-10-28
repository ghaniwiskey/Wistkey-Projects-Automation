---
id: TWW-024
title: "New template form is reset after cancel"
feature: templates
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Cancelling the create form does not keep half-typed data.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open 新建模板
2. Type a question title and a name, click 取消
3. Open 新建模板 again

## Expected
- The fields are empty (or the behavior agreed in the question)

## Notes
Currently the values are kept. Intended behavior is open (see question).
Related: Q-003.
