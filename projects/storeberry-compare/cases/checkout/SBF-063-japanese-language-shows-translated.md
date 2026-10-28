---
id: SBF-063
title: "Japanese language shows translated pages and a working checkout"
feature: checkout
priority: P3
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
The Japanese option offered in the language switcher works.

## Preconditions
- Logged-in QA member, cart empty

## Data
- A non-quota product

## Steps
1. Switch to /lang/ja
2. Browse, add to cart and open checkout

## Expected
- Labels are Japanese (or fall back consistently to English); no missing keys; the cart is kept
- Cleanup: empty the cart

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. SBF-047 covers en/zh only.
