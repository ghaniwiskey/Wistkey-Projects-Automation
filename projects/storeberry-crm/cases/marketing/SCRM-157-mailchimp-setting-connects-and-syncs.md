---
id: SCRM-157
title: "Mailchimp setting connects and syncs opted-in members only"
feature: marketing
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Only members who opted in are pushed to the mailing list.

## Preconditions
- Ask the user first: this is a settings change (README > Testing permissions).
- A Mailchimp test audience/API key provided by the user

## Data
- One QA member opted in, one opted out

## Steps
1. Save the Mailchimp setting with the test key/audience
2. Trigger or wait for the sync

## Expected
- Only the opted-in member is in the audience; invalid keys get a clear error

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Blocked until the user provides a test Mailchimp account.
