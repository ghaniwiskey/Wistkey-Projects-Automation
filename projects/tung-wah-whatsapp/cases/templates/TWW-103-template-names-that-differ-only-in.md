---
id: TWW-103
title: "Template names that differ only in letter case are rejected"
feature: templates
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A template name is not reused with different letter case.

## Preconditions
- An admin account (TWW_QA_ADMIN_USER / TWW_QA_ADMIN_PASS)
- An existing template name, e.g. attendance_confirmation
- Approval: if the check is missing this creates a Twilio draft (README > Testing permissions); delete it afterwards

## Data
- Name: the existing name with different letter case, e.g. Attendance_Confirmation

## Steps
1. Open 消息模版 and click 新建模板
2. Enter the name with different letter case, a body and a button, untick 創建後立即提交 Meta 審核
3. Click 創建模板

## Expected
- The form rejects the name as already used (or forces lowercase), nothing is created in Twilio

## Notes
Depends on Q-010. 2026-10-29: accepted and created in Twilio (draft deleted right after).
