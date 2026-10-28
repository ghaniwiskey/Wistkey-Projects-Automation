---
id: TWW-034
title: "Reset a sent contact to pending"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
重置 lets a sent contact be sent again.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open 聯繫人 of a template with a 已發送 contact
2. Click 重置 on that contact

## Expected
- The status changes to 待發送 and the 重置 button disappears
- The old 發送時間 is cleared (or labelled as the previous send)

## Notes
On 2026-10-28 the old 發送時間 stayed visible after the reset (cosmetic).
Related: BUG-011 (open).
