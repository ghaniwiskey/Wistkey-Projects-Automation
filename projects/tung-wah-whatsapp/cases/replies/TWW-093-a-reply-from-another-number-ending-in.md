---
id: TWW-093
title: "A reply from another number ending in the same 8 digits is not credited"
feature: replies
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
A reply counts only for the contact whose full phone number sent it.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A QA contact on +852 6524 8661 that was sent attendance_confirmation and has no reply
- App running locally

## Data
- From numbers: whatsapp:+8613965248661 (mainland number with the same last 8 digits) and whatsapp:+8665248661

## Steps
1. POST a form-encoded Twilio message to http://localhost:3000/api/webhook/whatsapp with From = whatsapp:+8613965248661 and Body = Yes
2. POST the same with From = whatsapp:+8665248661
3. Open the template's 回覆統計 tab

## Expected
- Neither reply is recorded for the +852 6524 8661 contact
- The contact still shows 未回覆

## Notes
From the code: the webhook also matches the last 8 digits and swaps 86/852, so another number with the same 8 digits may be credited. Unsigned POSTs are rejected with 403 since BUG-012 was fixed (2026-10-29); use a real reply or a signed request.; once fixed, sign the request with the Twilio auth token. 重置 the contact afterwards (deletes the reply, BUG-016).
