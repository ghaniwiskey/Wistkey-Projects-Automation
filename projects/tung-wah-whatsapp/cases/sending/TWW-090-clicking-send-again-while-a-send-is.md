---
id: TWW-090
title: "Clicking send again while a send is running does not message anyone twice"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
A second send started while the first is still running (1 message per second) only sends to contacts not yet sent.

## Preconditions
- An isolated test app with a mocked Twilio transport; no real external message requests
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- An approved template with a mapped variable

## Data
- Use an isolated Twilio transport mock with multiple disposable contact records and delayed message completion.
- No requests may reach Twilio or random phone numbers. A separate live-phone variant requires its own approval and may use only the designated test phone.

## Steps
1. Upload the file to the template with 追加
2. Click send and confirm
3. Within 3 seconds reload the page and click send again
4. Wait 30 seconds, click 刷新 and check the mocked transport request log

## Expected
- Every phone gets at most one message in the mock request log
- Each intended mock recipient is sent at most one request
- The second click says a send is already running, or reports only the contacts still pending and sends nothing twice

## Notes
Safety review 2026-10-30: do not execute the old fake-HK-number recipe. Random-looking numbers may belong to real people. This overlap scenario requires a mocked transport that holds contacts pending while a second send starts. No new execution occurred.

From the code: /api/send picks every PENDING and FAILED contact and sends them in the background, so contacts still pending during the first run can be picked again. TWW-053 covers only a double click on the same button. Hold a mock contact pending until the second request starts.
