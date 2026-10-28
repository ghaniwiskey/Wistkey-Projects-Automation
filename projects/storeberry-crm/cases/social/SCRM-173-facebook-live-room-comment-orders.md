---
id: SCRM-173
title: "Facebook live room comment orders reserve stock and create one order per buyer"
feature: social
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Live selling never oversells or double-charges.

## Preconditions
- A connected test Facebook page and a test buyer (user provides); ask before going live: it is public

## Data
- A QA product with stock 2

## Steps
1. Create a live room with the QA product and a comment keyword
2. Buyer A comments the keyword twice; buyer B and C comment once
3. Read the orders and stock

## Expected
- A gets one order (or quantity per the rule), B gets one, C is told it is sold out
- Available never goes below 0
- Cleanup: void the orders, end the live room

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested. Blocked until a test page is connected. Related: SCRM-159.
