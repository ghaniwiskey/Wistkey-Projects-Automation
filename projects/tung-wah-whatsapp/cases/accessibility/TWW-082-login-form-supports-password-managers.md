---
id: TWW-082
title: "Login form supports password managers and screen readers"
feature: accessibility
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Login fields are labelled and autofill-friendly without exposing real accounts.

## Steps
1. Open /login and inspect the fields

## Expected
- 郵箱 and 密碼 labels are linked to their inputs
- Inputs have autocomplete="username" / "current-password"
- The email placeholder is a generic example, not the real admin address

## Notes
Related: BUG-031 (open).
