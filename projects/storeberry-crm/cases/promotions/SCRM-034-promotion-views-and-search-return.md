---
id: SCRM-034
title: "Promotion views and search return matching rule types"
feature: promotions
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Promotion category views and name search narrow the list to matching rules.

## Preconditions
- At least one promotion exists in each category selected for review.

## Data
- Names of existing staging promotions, selected dynamically.

## Steps
1. Sign in to the staging CRM and open Promotions.
2. Review All Promotions, Discount Promotions for Specific Products, General Discount Promotions, and Free Gifts.
3. Search for an existing promotion by its exact name.

## Expected
- Each category view displays rules of the selected promotion type.
- Exact-name search returns the matching rule and its type, shop, dates, and status.

## Notes
Read-only. Do not add, edit, activate, suspend, or delete promotions.
