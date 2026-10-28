---
id: BUG-013
title: "Delivery and read receipts are never tracked; undelivered messages stay 已發送"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2u0007kjy3stn25txd/contacts"
updated: 2026-10-28T06:57:21.409Z
found: 2026-10-28T06:57:21.409Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-039]
frequency: always
---
## Summary
The app does not set a Twilio status callback or handle MessageStatus in the webhook. As a result, deliveredAt and readAt remain null, an undelivered message can still appear as sent, and a delivered/read message is marked READ only after a reply.

## UI labels in English
- 聯繫人: Contacts
- 已發送: Sent

## Steps to reproduce
1. With the tunnel up, send attendance_confirmation to the QA contact
2. Let it be delivered and read (Twilio log: Delivered, then Read)
3. Open 聯繫人 / the contacts API before any reply
4. Check welcome_greetings contact the undelivered test contact (Twilio: Undelivered)

## Expected
Contact status and times follow Twilio (delivered, read, failed/undelivered).

## Actual
Status SENT with deliveredAt/readAt null until a reply arrives; then status READ, still without times. the undelivered test contact stays 已發送 although Twilio says Undelivered. Twilio sender status_callback_url is empty.

## Evidence
- Screenshot: ![twilio log](../explorations/2026-10-28-core-journeys/07-twilio-mapped-message.jpg)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2u0007kjy3stn25txd/contacts
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: reproduced with the tunnel up: +8520000000 Undelivered in Twilio, contact stays SENT (22-twilio-merged-and-invalid.jpg).
