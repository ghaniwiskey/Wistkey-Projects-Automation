---
id: SCRM-068
title: "Reject redemption of an expired or unavailable eGift"
feature: loyalty
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
An expired or unavailable eGift cannot be reserved or redeemed.

## Preconditions
- An expired or unavailable staging eGift is visible and a QA member can be used without sending messages.

## Data
- Expired/unavailable eGift selected dynamically.
- QA member only.

## Steps
1. Sign in to the staging CRM and open the expired or unavailable eGift.
2. Attempt the supported reserve or redeem action for the QA member.
3. Review the eGift and member histories.

## Expected
- The action is blocked with an expired/unavailable validation state.
- No reservation, redemption, or points change is recorded.

## Notes
Validation scenario. Use only QA data and an already expired/unavailable eGift; do not alter its dates or status.
