---
id: TWW-092
title: "A send stopped by a server restart can be finished without duplicates"
feature: sending
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
If the app restarts or is redeployed during a long send, the rest can still be sent and nobody gets the message twice.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- The user's OK to restart the local dev server
- An approved template with a mapped variable

## Data
- Excel: 20 fake HK numbers 852<unique 8 digits>, then +852 6524 8661 last
- Recipient: WhatsApp +852 6524 8661 only

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
Sending runs inside the server process at 1 message per second (1000 contacts take about 17 minutes), so a restart or deploy during a send is realistic.
