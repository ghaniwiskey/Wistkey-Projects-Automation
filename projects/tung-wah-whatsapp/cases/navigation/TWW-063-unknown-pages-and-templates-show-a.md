---
id: TWW-063
title: "Unknown templates show 模板不存在"
feature: navigation
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Bad links lead to a clear message and a way back.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Open /templates/doesnotexist123
2. Open /templates/doesnotexist123/contacts
3. Open /nope

## Expected
- /templates/<unknown id> shows 模板不存在
- Accepted behavior (BUG-021, wont-fix): /nope shows the English Next.js 404, and /templates/<unknown id>/contacts shows the empty 聯繫人管理 page with 全部重置 and 刷新

## Notes
BUG-021, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
