---
id: TWW-107
title: "A button tap after a free-text reply sets the member's answer"
feature: replies
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A member who first types a message (e.g. "maybe later") and then taps a quick-reply button is counted under that button, not stuck under 其它.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- ngrok tunnel running and the Twilio sender webhook pointing at it (README > Testing permissions)

## Data
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)
- An approved template with quick-reply buttons, e.g. 會出席 / 不出席

## Steps
1. Send the template to the QA contact
2. On the phone, type **maybe later**
3. Then type **thanks**
4. Then tap **會出席** on the same message
5. Open 回覆統計 and download the reply report

## Expected
- The QA Tester row is counted under 會出席 (the button answer), not 其它
- The 數據統計 counts and the report match the row
- The free-text messages are not lost (visible somewhere for staff, per the agreed rule)

## Notes
Read from app/api/webhook/whatsapp/route.ts on 2026-10-29: the first message is saved (free text as 其它 "maybe later"), and every later message, including the button tap, is ignored as a duplicate ("該手機號已回覆過"). Only the raw webhook log keeps them. Expected result depends on Q-007. Related: TWW-041, TWW-047.
