---
id: SCRM-040
title: "Loyalty settings display points, tiers, and redemption policy"
feature: loyalty
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can review the active loyalty program configuration.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Loyalty > Loyalty Setting.
2. Review the program active state, membership levels, point earning, redemption, wallet, and referral sections.
3. Reload the page and confirm the values are still displayed.

## Expected
- The loyalty setting page displays its active state, membership levels, point-earning policy, redemption conversion, wallet settings, and referral settings.
- The displayed configuration remains unchanged after reload.

## Notes
Read-only. Do not toggle settings or save changes.
