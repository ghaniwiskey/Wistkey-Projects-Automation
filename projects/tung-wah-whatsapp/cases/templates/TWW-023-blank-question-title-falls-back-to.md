---
id: TWW-023
title: "Blank question title falls back to 未設定問題標題"
feature: templates
priority: P3
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Saving an empty or spaces-only question title clears it.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open a QA draft template with a question title
2. Click 編輯, replace the title with **"   "**, click 儲存

## Expected
- The header shows 未設定問題標題, not an empty "問題："

## Notes
Related: BUG-008 (open).
