---
id: BUG-012
title: "WhatsApp webhook accepts unsigned requests, so replies can be forged"
severity: major
status: open
env: local
url: "https://<ngrok-domain>/api/webhook/whatsapp"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:57:21.278Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-046]
frequency: always
---
## Summary
Twilio signs each webhook request it sends with an X-Twilio-Signature header. The app's WhatsApp webhook (POST /api/webhook/whatsapp) does not check this header and processes any form-encoded request. Anyone who knows the public URL can record a fake Yes/No answer for any member phone that was sent a template.

## Steps to reproduce
1. Run the app with the ngrok tunnel up (ngrok makes the local app reachable from the internet).
2. Send a POST to https://<ngrok-domain>/api/webhook/whatsapp with Content-Type application/x-www-form-urlencoded, body From=whatsapp:+85200000000&Body=QA unsigned probe&MessageSid=SMqa..., and no X-Twilio-Signature header.

## Expected
Requests without a valid Twilio signature are rejected (403) and not saved as replies.

## Actual
The app returns 200 (OK). The dev server log shows "Twilio Webhook 收到消息 ... QA unsigned probe" ("Twilio webhook received message") and then "未找到匹配的聯繫人" ("No matching contact found"). The reply was not saved only because +85200000000 belongs to no contact; with a member's phone, the fake answer is recorded.

Code: the function handleTwilioWebhook has no signature check. (The other branch, for the WhatsApp Cloud API, does check the x-hub-signature-256 header.)

## Evidence
- Screenshot: ![reply recorded](../explorations/2026-10-28-core-journeys/18-reply-recorded-via-ngrok.webp)

## Environment
- Base URL: https://<ngrok-domain>/api/webhook/whatsapp
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
