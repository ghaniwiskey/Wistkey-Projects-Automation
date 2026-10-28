---
id: TWW-065
title: "AUTHENTICATION category: create shows the submission warning"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Every category in the dropdown can be submitted.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Open 新建模板, choose AUTHENTICATION, body 您的驗證碼是 {{code}}，請勿分享。, one button, Meta ticked
2. Submit

## Expected
- Accepted behavior (BUG-023, wont-fix): the alert "模板已創建！ 警告：模板已創建但審核提交失敗: Only whatsapp/authentication is valid for category AUTHENTICATION ..." appears and the template stays a draft in Twilio
- The draft is deleted afterwards with 刪除

## Notes
Submits to Meta (irreversible record): needs the user's approval per run. Delete the template afterwards.
BUG-023, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
