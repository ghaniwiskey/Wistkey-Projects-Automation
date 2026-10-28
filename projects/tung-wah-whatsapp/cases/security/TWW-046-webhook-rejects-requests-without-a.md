---
id: TWW-046
title: "Webhook rejects requests without a valid Twilio signature"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Only Twilio can record replies.

## Preconditions
- App running with the ngrok tunnel up

## Steps
1. POST a form-encoded message to the public /api/webhook/whatsapp URL without an X-Twilio-Signature header, From a phone that matches no contact (e.g. whatsapp:+85200000000)
2. POST the same with a wrong signature

## Expected
- Both return 403 and nothing is logged or recorded
- A real reply from WhatsApp (valid signature) is still accepted

## Notes
Use a From number that matches no contact so a missing check cannot record a fake reply. Related: BUG-012 (open).
