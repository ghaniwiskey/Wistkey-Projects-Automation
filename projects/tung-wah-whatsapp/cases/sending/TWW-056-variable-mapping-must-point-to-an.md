---
id: TWW-056
title: "Variable mapping must point to an existing Excel column"
feature: sending
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A mapping that would send blank or sample values cannot be saved.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Open attendance_confirmation with contacts uploaded
2. In 變數映射配置 save an empty value, then "   ", then "不存在的欄", then "姓名 先生"
3. Restore 姓名 and save

## Expected
- Empty / unknown column is rejected with a message
- Free text is either sent literally (as the placeholder "或手動輸入" suggests) or rejected, never silently dropped

## Notes
Related: BUG-017 (open), BUG-003 (open).
