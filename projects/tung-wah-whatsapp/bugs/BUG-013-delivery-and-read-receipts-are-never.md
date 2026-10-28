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
Sends set no status callback and the webhook has no MessageStatus handling, so deliveredAt/readAt stay null. A message Twilio marks Undelivered (Ghani, +6287721956119) shows 已發送; a delivered/read message only changes to READ when the member replies.

## Steps to reproduce
1. With the tunnel up, send attendance_confirmation to the QA contact
2. Let it be delivered and read (Twilio log: Delivered, then Read)
3. Open 聯繫人 / the contacts API before any reply
4. Check welcome_greetings contact Ghani (Twilio: Undelivered)

## Expected
Contact status and times follow Twilio (delivered, read, failed/undelivered).

## Actual
Status SENT with deliveredAt/readAt null until a reply arrives; then status READ, still without times. Ghani stays 已發送 although Twilio says Undelivered. Twilio sender status_callback_url is empty.

## Evidence
- Screenshot: ![twilio log](../explorations/2026-10-28-core-journeys/07-twilio-mapped-message.jpg)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2u0007kjy3stn25txd/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: reproduced with the tunnel up: +8520000000 Undelivered in Twilio, contact stays SENT (22-twilio-merged-and-invalid.jpg).
