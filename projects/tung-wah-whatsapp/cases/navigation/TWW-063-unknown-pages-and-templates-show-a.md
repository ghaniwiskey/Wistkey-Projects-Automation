---
id: TWW-063
title: "Unknown pages and templates show a friendly Chinese error"
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
- Each shows a Traditional Chinese "not found" message with a link back to 消息模版
- No contacts tools (全部重置, 刷新) are shown for a missing template

## Notes
Currently: detail shows "模板不存在" (OK); contacts page renders empty tools; /nope shows the English Next.js 404.
Related: BUG-021 (open).
