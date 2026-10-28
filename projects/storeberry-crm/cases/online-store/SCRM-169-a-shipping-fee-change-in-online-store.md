---
id: SCRM-169
title: "A shipping fee change in Online Store settings is charged at checkout and a disabled method disappears"
feature: online-store
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Shipping settings drive what customers actually pay.

## Preconditions
- Ask the user first: settings change on the shared staging shop (README > Testing permissions).
- A QA-only shipping method created for the test (preferred over editing Testing / ShipAnySF350free)

## Data
- Flat fee 30, then 45

## Steps
1. Create/enable the QA method at flat 30; check eShop checkout with a weighted item
2. Change it to 45; reload checkout
3. Disable it; reload checkout

## Expected
- Checkout shows 30, then 45, and the order total includes the fee
- After disabling, the method is not offered and an open checkout cannot submit it
- Cleanup: delete the QA method

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested. Related: SBF-029, SBF-030, BUG-021.
