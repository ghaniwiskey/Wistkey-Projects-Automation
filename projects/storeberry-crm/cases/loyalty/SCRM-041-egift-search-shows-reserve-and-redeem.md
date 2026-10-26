---
id: SCRM-041
title: "eGift search shows reserve and redeem periods and status"
feature: loyalty
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can find an eGift and review its reservation and redemption periods.

## Preconditions
- At least one eGift exists in staging.

## Data
- Existing eGift name, selected dynamically.

## Steps
1. Sign in to the staging CRM and open Loyalty > eGift.
2. Select an existing eGift and search by its exact name.
3. Review its reserve period, redeem period, and status.

## Expected
- The search returns the selected eGift.
- The matching row displays its reserve period, redeem period, and current status.

## Notes
Read-only. Do not create, edit, suspend, or redeem eGifts.
