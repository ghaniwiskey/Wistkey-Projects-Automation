---
id: TWW-095
title: "Image, voice or location replies are recorded clearly"
feature: replies
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
A media reply is counted once and shown under Other or a media label.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- ngrok tunnel running
- Someone with the +852 6524 8661 phone to reply
- A QA contact on +852 6524 8661 that was sent attendance_confirmation and has no reply

## Data
- Recipient: WhatsApp +852 6524 8661 only

## Steps
1. On the phone, reply with a photo without a caption
2. Open 回覆統計 and download the report

## Expected
- The reply is counted once (under 其它 or a media label)
- 回覆內容 may show 其它 (Other); a separate image/sticker label or preview is not required

## Notes
User confirmed on 2026-10-30 that generic Other for sticker/image replies is expected. BUG-046 closed as wont-fix. TWW-117 covered one actual image/webp sticker-style reply, not all image/voice/location variants; this broader case remains unrun. BUG-015 verified for typed-text preservation.
