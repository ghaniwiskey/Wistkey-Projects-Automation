---
id: TWW-042
title: "Reply filters include each quick-reply button"
feature: replies
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
For a template with buttons, 回覆統計 can filter by each answer.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open attendance_confirmation > 回覆統計

## Expected
- Filter chips show 全部, 其它, 未回覆 plus one chip for each answer that has at least one reply (after a Yes reply: 全部, Yes, 其它, 未回覆)
- Clicking Yes lists only the contacts that answered Yes

## Notes
Chips are built from received replies (Q-006, closed).
Related: Q-006.
