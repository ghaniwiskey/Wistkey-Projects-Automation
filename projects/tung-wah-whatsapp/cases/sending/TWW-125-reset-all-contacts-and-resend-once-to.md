---
id: TWW-125
title: "Reset all contacts and resend once to every reset contact"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Reset a complete contact list and resend

Verify that confirming Reset all clears previous sending states and the next send contacts each reset recipient once.

## Preconditions
- An admin account, an approved template and an isolated mocked sending transport are available.
- The template contains disposable contacts in sent, read and failed states, with a disposable recorded reply.

## Data
- Use only controlled disposable data and mocked delivery. No real recipient requests.

## Steps
1. Log in with your admin account and open the template’s contact list.
2. Click 全部重置 (Reset all), read the warning and confirm it for the disposable list.
3. Refresh and inspect every contact’s status, old message ID and send/error times.
4. Send the template once and wait for the mocked batch to finish.
5. Inspect the transport request log and final contact statuses.

## Expected
- Every contact becomes Pending and old sending/message/error state is cleared.
- Reply removal follows the confirmation warning.
- The resend makes exactly one request per reset phone number and updates the statuses without duplicating sends.

## Notes
Source: attached requirements Saas Function 7b/7c. TWW-055 verifies warning/cancel and TWW-034 verifies an individual reset; neither records confirming Reset all followed by a complete resend. Destructive to reply data, so fresh scenario-specific approval is required before execution. No real sends authorized.
