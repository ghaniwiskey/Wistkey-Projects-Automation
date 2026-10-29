---
id: TWW-110
title: "Reply rate stays between 0% and 100% at the start of a month"
feature: dashboard
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
回覆率 is a sensible percentage when replies this month answer messages sent last month.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A requires-reply template whose contacts were sent last month and replied this month (or move the server clock past the 1st)

## Steps
1. Open 儀表板 on the first days of the month

## Expected
- 回覆率 is never above 100% and shows "-" or 0% instead of an error when nothing was sent this month
- "This month" follows Hong Kong time

## Notes
From the code: sent = contacts with sentAt this month, replied = responses with respondedAt this month, so replies to last month's messages can push the rate past 100%. The month start uses the server's local time (the test PC is Asia/Jakarta, 1 hour behind HK).