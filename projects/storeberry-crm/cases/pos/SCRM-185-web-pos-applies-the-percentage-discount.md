---
id: SCRM-185
title: "Web POS applies the percentage discount only for the configured membership level"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-20
updated: 2026-11-20
---

## Goal
Verify that selecting an eligible member applies the configured basket discount and removing the member removes that offer.

## Preconditions
- An active membership basket promotion, an eligible member and a member at another level.

## Data
- For example, 10% off for Level 3 and an eligible HKD 100 item.

## Steps
1. Log in to Storeberry with a staff account.
2. Open Web POS for the store covered by the offer.
3. Add an eligible item as a guest and disable competing basket discounts in this cart if needed.
4. Select the eligible member.
5. Remove the member, then select a member at a different level.
6. Clear the test cart.

## Expected
- The named offer is absent for the guest.
- The eligible member receives the exact configured discount. A 10% offer on HKD 100 deducts HKD 10.
- Removing the member removes that offer; it remains absent for a member at another level.
