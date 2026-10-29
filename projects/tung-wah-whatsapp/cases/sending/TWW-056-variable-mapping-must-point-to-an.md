---
id: TWW-056
title: "Variable mapping must point to an existing Excel column"
feature: sending
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
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
- A spaces-only mapping is rejected on save (變數 {{first_name}} 的映射不能只含空白字元)
- An empty mapping cannot be sent: 發送 is blocked with 部分聯繫人缺少變數映射，無法發送 (BUG-003)
- Words that are not a column name are sent as typed text, never dropped ("姓名 先生" -> "Hi QA Tester 先生")

## Notes
BUG-017 and BUG-003 verified 2026-10-29 (dev fix af9a789). Unknown words are sent as typed text by design (the fix treats any non-column word as literal), so a misspelled column name is also sent literally.
