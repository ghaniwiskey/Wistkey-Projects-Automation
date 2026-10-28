---
id: TWW-071
title: "Variable mapping and question title survive a sync"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
從 Twilio 同步 does not wipe local settings.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-two-variables.xlsx

## Steps
1. On a two-variable template upload the file
2. Map {{first_name}} -> 姓名 and {{event_date}} -> 活動日期, 儲存映射
3. Click 從 Twilio 同步 and reopen the template

## Expected
- Mapping and 問題 title are unchanged
