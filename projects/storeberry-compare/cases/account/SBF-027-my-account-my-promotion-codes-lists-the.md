---
id: SBF-027
title: "My Account > My Promotion Codes lists the codes assigned to the member"
feature: account
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Members can find the promotion codes the shop gave them.

## Preconditions
- A member with at least one code assigned in the CRM (storeberry-crm SCRM-109)

## Steps
1. Log in, open My Account, click My Promotion Codes

## Expected
- The page loads (no 404) and lists each assigned code with its promotion and validity
- Used codes are marked as used

## Notes
Currently fails: BUG-019 (2026-10-28): /my-account/promotion-codes returns 404 "Page Not Found".
