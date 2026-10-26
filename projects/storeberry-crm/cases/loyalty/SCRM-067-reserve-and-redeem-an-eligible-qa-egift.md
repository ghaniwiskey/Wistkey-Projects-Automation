---
id: SCRM-067
title: "Reserve and redeem an eligible QA eGift"
feature: loyalty
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A QA member can reserve and redeem an active eGift within its configured periods.

## Preconditions
- An active staging eGift is reservable and redeemable, and a dedicated QA member is available.
- Notification routing is confirmed safe.

## Data
- Active eGift and periods selected dynamically.
- QA member only.

## Steps
1. Sign in to the staging CRM and open the active eGift.
2. Reserve it for the QA member within the reserve period.
3. Redeem the reservation within the redeem period.
4. Reopen the eGift and member history.

## Expected
- The eGift reservation is linked to the QA member.
- The redemption state and time are recorded within the configured period.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. eGift inventory may be limited; verify no real person is notified.
