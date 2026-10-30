---
id: TWW-091
title: "Failed contacts are retried on the next send and sent contacts are not"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
Clicking send again retries failed messages only.

## Preconditions
- An isolated test app with a mocked Twilio transport; no real external message requests
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- An approved template with a mapped variable

## Data
- Use a mocked Twilio transport with two Pending contacts: one mock-success contact and one mock-API-failure contact.
- Add separate disposable contacts already in Sent, Delivered and Read states, and keep their original data for comparison.
- No external messages. Do not use a random phone number to provoke an error.

## Steps
1. Upload the file and send
2. Wait for the mocked batch to finish, click 刷新 and note each contact status
3. Click send again

## Expected
- The rejected contact is shown as failed, not 已發送
- The second send reports 1 contact and sends only to the failed one
- The mock-success contact receives only one send request in total
- Previously Sent, Delivered and Read contacts receive no requests and remain unchanged

## Notes
Safety review 2026-10-30: use controlled mock success/failure responses, not an arbitrary non-WhatsApp number. Failure callbacks are now supported; distinguish API rejection from later Undelivered. Executed on 2026-10-30 as a source-handler integration check, not browser/live Twilio delivery: actual /api/send and queue code with in-memory Prisma/auth and mocked Twilio. Initial Pending success/failure, retry-only-Failed, Sent/Delivered/Read exclusion and no-eligible 400 all passed. No real messages or database writes. See explorations/2026-10-30-retry-skip/.

From the code: the send route selects PENDING and FAILED contacts. Configure the mock failure at the send API call; a later Undelivered event exercises a different path.
