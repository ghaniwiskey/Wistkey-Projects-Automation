---
id: TWW-041
title: "Free-text reply is recorded under 其它"
feature: replies
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A typed reply that is not a button counts as 其它.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- ngrok tunnel running

## Data
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. With the tunnel up, send the template to the QA contact
2. On the phone, type **maybe later?**
3. Open 回覆統計 and click 其它

## Expected
- The QA Tester row shows 回覆內容 "maybe later?" under 其它
- 未回覆 no longer lists the contact

## Notes
Blocked on 2026-10-28: ngrok endpoint offline (ERR_NGROK_3200).
