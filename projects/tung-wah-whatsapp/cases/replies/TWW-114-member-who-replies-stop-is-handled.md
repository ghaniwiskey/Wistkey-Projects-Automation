---
id: TWW-114
title: "Member who replies STOP or blocks the number is handled"
feature: replies
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A member who asks to stop getting messages is not counted as an answer and is not messaged again by mistake.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- An approved template; tunnel up or signed simulated replies

## Data
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. Send to the QA contact, reply **STOP** (or 取消訂閱)
2. Open 回覆統計 and the report
3. Upload the same number again and send

## Expected
- The agreed business rule applies (ask the product owner): e.g. STOP is flagged as an opt-out, not counted as 其它, and later sends skip or warn about the number
- If Twilio refuses the send, the contact shows failed with the reason

## Notes
From the code (2026-10-29): there is no opt-out field; STOP is saved as a 其它 answer with text "STOP" and the number can be messaged again. Opt-out handling matters for real members (HK PDPO direct-marketing rules).