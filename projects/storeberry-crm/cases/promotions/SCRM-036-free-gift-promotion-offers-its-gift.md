---
id: SCRM-036
title: "Free-gift promotion offers its gift when the threshold is met"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
An eligible cart displays the configured free gift when the promotion threshold is reached.

## Preconditions
- An active free-gift promotion with an attainable threshold and eligible products is available in staging.

## Data
- Promotion threshold and eligible product group selected from current staging data.

## Steps
1. Open the staging storefront in a clean, isolated test session.
2. Choose an active free-gift promotion and its eligible product group.
3. Add eligible products until the displayed promotion threshold is met.
4. Review the cart gift offer, then remove the test items.

## Expected
- The qualifying cart displays the gift selection or gift item specified by the promotion.
- The promotion is not offered before its threshold is met.
- Removing the test items leaves the isolated cart empty and no order is created.

## Notes
Cart-state write only. Use a clean isolated staging session, remove test items, and stop before checkout submission.
