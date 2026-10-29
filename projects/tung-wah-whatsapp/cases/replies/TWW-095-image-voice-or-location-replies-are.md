---
id: TWW-095
title: "Image, voice or location replies are recorded clearly"
feature: replies
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
A reply without text is shown as a non-text reply, not an empty answer.

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
- 回覆內容 is not empty; it says the member sent an image or similar

## Notes
From the code: an empty Body falls back to 其它 with empty text. BUG-015 verified 2026-10-29: typed text is now stored and shown in the report.
