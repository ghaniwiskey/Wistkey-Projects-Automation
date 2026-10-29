---
id: TWW-083
title: "Editor cannot open the user management page"
feature: security
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Admin-only pages are hidden and blocked for editors.

## Preconditions
- A QA editor created by the admin (delete afterwards)

## Steps
1. Log in as the QA editor
2. Look at the nav
3. Open /users directly

## Expected
- 用戶管理 is not in the nav
- /users shows a no-permission message or redirects; no 添加用户 button

## Notes
Nav part passes; the page itself renders with 添加用户.
Related: BUG-032 verified 2026-10-29 (dev fix af9a789).
