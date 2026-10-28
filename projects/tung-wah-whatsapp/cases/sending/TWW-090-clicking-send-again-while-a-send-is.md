---
id: TWW-090
title: "Clicking send again while a send is running does not message anyone twice"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A second send started while the first is still running (1 message per second) only sends to contacts not yet sent.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- An approved template with a mapped variable

## Data
- Excel: 1 row with +852 6524 8661 and 10 rows with fake HK numbers 852<unique 8 digits> (each a different phone, so they are not merged)
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. Upload the file to the template with 追加
2. Click send and confirm
3. Within 3 seconds reload the page and click send again
4. Wait 30 seconds, click 刷新 and check Twilio Monitor > Logs > Messaging

## Expected
- Every phone gets at most one message in Twilio's log
- +852 6524 8661 receives exactly one message
- The second click says a send is already running, or reports only the contacts still pending and sends nothing twice

## Notes
From the code: /api/send picks every PENDING and FAILED contact and sends them in the background, so contacts still pending during the first run can be picked again. TWW-053 covers only a double click on the same button. Put +852 6524 8661 last in the file so it is still pending at the second click.
