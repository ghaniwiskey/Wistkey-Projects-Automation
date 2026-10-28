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
- Filter chips show 全部, Yes, No, 其它, 未回覆 (matching the report's 回覆內容1/2)

## Notes
On 2026-10-28 only 全部 / 其它 / 未回覆 were shown with 0 replies; may appear once replies exist (see question).
Related: Q-006.
