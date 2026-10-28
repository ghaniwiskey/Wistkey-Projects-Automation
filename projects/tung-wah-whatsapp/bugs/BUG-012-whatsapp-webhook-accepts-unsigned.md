---
id: BUG-012
title: "WhatsApp webhook accepts unsigned requests, so replies can be forged"
severity: major
status: open
env: local
url: "https://<ngrok-domain>/api/webhook/whatsapp"
updated: 2026-10-28T06:57:21.278Z
found: 2026-10-28T06:57:21.278Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-046]
frequency: always
---
## Summary
The WhatsApp webhook accepts form-encoded requests without checking the X-Twilio-Signature header. Someone who knows the public URL could forge a reply for a member phone that was sent a template.

## UI labels in English
- 聯繫人: Contacts

## Steps to reproduce
1. Run the app with the ngrok tunnel up
2. POST to https://<ngrok-domain>/api/webhook/whatsapp, Content-Type application/x-www-form-urlencoded, body From=whatsapp:<unmatched test phone>&Body=QA unsigned probe&MessageSid=SMqa..., no X-Twilio-Signature header

## Expected
Requests without a valid Twilio signature are rejected (403) and not logged as replies.

## Actual
200; dev log shows "Twilio Webhook 收到消息 ... QA unsigned probe" then "未找到匹配的聯繫人" (only because <unmatched test phone> matches no contact; with a member phone the forged answer is recorded). Code: handleTwilioWebhook has no signature validation (the Cloud API branch does check x-hub-signature-256).

## Evidence
- Screenshot: ![reply recorded](../explorations/2026-10-28-core-journeys/18-reply-recorded-via-ngrok.webp)

## Environment
- Base URL: https://<ngrok-domain>/api/webhook/whatsapp
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
