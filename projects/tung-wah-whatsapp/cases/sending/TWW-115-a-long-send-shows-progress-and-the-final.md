---
id: TWW-115
title: "A long send shows progress and the final result"
feature: sending
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
Staff can see how a large send is going and when it is finished.

## Preconditions
- An isolated test app with a mocked Twilio transport; no real external message requests
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- An approved template

## Data
- Use about 30 disposable contacts with a mocked Twilio transport that returns controlled success/failure results over time.
- No external messages or random-number recipients.

## Steps
1. Upload about 30 contacts and send
2. Watch the contacts page and 儀表板 without reloading, then leave the page and come back

## Expected
- The page shows progress (sent, failed, remaining) or refreshes on its own
- At the end staff see how many were sent and how many failed
- Leaving the page does not stop the send

## Notes
Safety review 2026-10-30: a load/progress test requires mocked recipients, not numbers assumed not to be on WhatsApp. No large real-message run is authorized. No new execution occurred.

From the code: /api/send answers "發送任務已啓動" at once and sends in the background at about 1 message per second (Twilio), with no progress reported to the page; 1000 contacts take about 17 minutes. Related: TWW-090, TWW-092.