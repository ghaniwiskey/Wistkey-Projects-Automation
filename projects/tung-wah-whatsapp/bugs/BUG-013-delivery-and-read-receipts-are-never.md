---
id: BUG-013
title: "Delivery and read receipts are never tracked; undelivered messages stay 已發送 (Sent)"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/<template id>/contacts"
updated: 2026-10-29T09:31:31.151Z
found: 2026-10-28T06:57:21.409Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-039]
frequency: always
---
## Summary
The app never tracks delivery, read or failure from Twilio, so a message that was never delivered still shows 已發送 (Sent) and delivery/read times stay empty.

## Steps to reproduce
1. Send an APPROVED template to your number 852<P>. Open the message on your phone, but do not reply.
2. In Twilio Console > Monitor > Logs > Messaging, the message shows Delivered, then Read.
3. Open 聯繫人 (Contacts), and in the browser console run `await fetch('/api/templates/<template id>/contacts').then(r => r.json())`
4. Send to a number that cannot receive WhatsApp (e.g. a contact with phone 00000000) and check Twilio again.

## Expected
Contact status and times follow Twilio (delivered, read, failed/undelivered).

## Actual
- Step 3: status SENT (已發送), deliveredAt and readAt null. They stay that way until the member replies; then the status becomes READ, still without times.
- Step 4: Twilio says Undelivered; the contact stays 已發送 (Sent).
- Cause: sends set no status callback (Twilio's status_callback_url for the sender is empty) and the webhook has no MessageStatus handling.

Our run: contact Ghani (+6287721956119) on welcome_greetings: Undelivered in Twilio, 已發送 in the app. Also +8520000000: Undelivered in Twilio, SENT in the app.

## Evidence
- Screenshot: ![twilio log](../explorations/2026-10-28-core-journeys/07-twilio-mapped-message.jpg)

## Environment
- Base URL: http://localhost:3000/templates/<template id>/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: reproduced with the tunnel up: +8520000000 Undelivered in Twilio, contact stays SENT (22-twilio-merged-and-invalid.jpg).
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: Still fails in runs/2026-10-29_1630_local_manual: af9a789 only records send errors (errorCode/errorMessage/failedAt); no Twilio status callback is set, so a message Twilio reports delivered/read stays 已發送 until the member replies..
