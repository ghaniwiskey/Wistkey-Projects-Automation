---
id: TWW-036
title: "Send a WhatsApp message with a mapped variable"
feature: sending
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The template is sent with the contact's own data in the variables.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. Log in as admin, open an approved template with {{first_name}} (attendance_confirmation)
2. Upload the valid HK file (or reset the QA contact to 待發送)
3. Under 變數映射配置 click 姓名, then + 插入, then 儲存映射
4. Click 發送到 WhatsApp and confirm
5. Check the message in the Twilio console (Monitor > Logs > Messaging)

## Expected
- Alert "變數映射已儲存", then "發送任務已啟動！"
- The contact turns 已發送 with a 發送時間
- Twilio shows the outbound message "Hi QA Tester, do you confirm your attendance?" to +85265248661 as Delivered

## Notes
Sends a real WhatsApp message; Twilio only delivers to HK numbers.
