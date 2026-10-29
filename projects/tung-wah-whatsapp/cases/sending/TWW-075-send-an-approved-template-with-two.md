---
id: TWW-075
title: "Send an approved template with two variables"
feature: sending
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Each variable is filled from its own Excel column.

## Preconditions
- An admin account (admin@tungwah.org)
- qa_event_reminder_<unique> approved by Meta

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-two-variables.xlsx
- Recipient: WhatsApp +852 6524 8661 only

## Steps
1. Map {{first_name}} -> 姓名 and {{event_date}} -> 活動日期
2. Click 發送到 WhatsApp and confirm
3. Check the message in Twilio and reply 會出席 on the phone
4. Open 回覆統計

## Expected
- Twilio shows "您好 QA Tester，提醒您 11月5日（三） 的活動，請問您會出席嗎？"
- The reply 會出席 is recorded with a 會出席 filter chip

## Notes
Passed 2026-10-29 on qa_event_reminder_357859 (approved by Meta). To rerun: reset QA Tester on its 聯繫人 page, send, run the reply-routing check (README) before asking for the tap.
