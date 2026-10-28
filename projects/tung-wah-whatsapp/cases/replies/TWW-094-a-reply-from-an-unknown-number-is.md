---
id: TWW-094
title: "A reply from an unknown number is ignored"
feature: replies
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Messages from numbers that were never sent anything do not change any statistics.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- App running locally

## Data
- From: whatsapp:+85200000000 (matches no contact)

## Steps
1. Note the reply count on every template card
2. POST a form-encoded Twilio message to http://localhost:3000/api/webhook/whatsapp with From = whatsapp:+85200000000 and Body = Yes
3. Reload /templates

## Expected
- The webhook answers 200 (so Twilio does not retry)
- No reply count changes

## Notes
Unsigned POSTs work only while BUG-012 is open.
