---
id: TWW-092
title: "A send stopped by a server restart can be finished without duplicates"
feature: sending
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
If the app restarts or is redeployed during a long send, the rest can still be sent and nobody gets the message twice.

## Preconditions
- An isolated test app with a mocked Twilio transport; no real external message requests
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- The user's OK to restart the local dev server
- An approved template with a mapped variable

## Data
- Use about 20 disposable mock-recipient contacts with delayed mocked delivery.
- No transport requests may reach Twilio or real phone numbers.

## Steps
1. Upload the file and send
2. After 5 seconds stop and restart the dev server
3. Open the contacts page and note the statuses
4. Click send again

## Expected
- Contacts not reached before the restart are still 待發送 (not lost or stuck)
- The second send sends only to those contacts
- No phone gets the message twice

## Notes
Safety review 2026-10-30: requires an isolated app instance and mocked transport; do not restart the shared app or send to fake-looking phone numbers. Obtain fresh approval for the interruption scenario. No new execution occurred.

Sending runs inside the server process at 1 message per second (1000 contacts take about 17 minutes), so a restart or deploy during a send is realistic.
