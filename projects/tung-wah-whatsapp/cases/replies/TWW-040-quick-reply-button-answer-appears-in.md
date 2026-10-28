---
id: TWW-040
title: "Quick-reply button answer appears in reply stats"
feature: replies
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A Yes/No button reply is recorded against the contact.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- ngrok tunnel running
- Someone with the +852 6524 8661 phone to reply

## Data
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. Make sure the Twilio incoming-message webhook reaches the app (ngrok tunnel up)
2. Send attendance_confirmation to the QA contact (mapped)
3. On the phone, tap **Yes**
4. Open the template's 回覆統計 tab

## Expected
- The header shows 1 回覆
- The QA Tester row shows 回覆內容 Yes and the 回覆日期
- The report's 數據統計 counts 1 under "回覆內容1：Yes"

## Notes
Passed on 2026-10-28 once the tunnel was up (murmuring-amused-diaper.ngrok-free.dev). Only the first reply per phone and template is recorded (Q-007).
