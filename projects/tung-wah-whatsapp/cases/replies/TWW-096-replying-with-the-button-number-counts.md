---
id: TWW-096
title: "Replying with the button number counts as that button"
feature: replies
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Members who type 1 or 2 instead of tapping are counted under the right answer, and other numbers are not.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A QA contact on +852 6524 8661 that was sent attendance_confirmation (Yes/No) and has no reply

## Data
- Bodies: 1, then (after 重置 and resend) 3
- Recipient: WhatsApp +852 6524 8661 only

## Steps
1. Reply 1 from the phone (or POST Body = 1, From = whatsapp:+85265248661 to the local webhook)
2. Check 回覆統計
3. 重置 the contact, send again, then reply 3

## Expected
- Reply 1 is counted under Yes
- Reply 3 is counted under 其它 with the text 3

## Notes
Unsigned local POSTs work only while BUG-012 is open. 重置 deletes the recorded reply (BUG-016).
