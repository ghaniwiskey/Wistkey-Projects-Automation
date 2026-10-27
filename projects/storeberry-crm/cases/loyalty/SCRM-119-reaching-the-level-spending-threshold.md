---
id: SCRM-119
title: "Reaching the level spending threshold upgrades the member, gives the upgrade reward and the new level discount"
feature: loyalty
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Member levels and their rewards follow the configured spending thresholds.

## Preconditions
- A QA member close to the next level (e.g. MEMy001164526: Level 2, $1176 or $717 / $2000 as of 2026-10-28)
- Thresholds and Upgrade Reward points read from Loyalty Setting at runtime

## Data
- Bank Transfer only

## Steps
1. Place an eShop order whose net total takes level spending just over the next threshold, upload a receipt and accept it in the CRM
2. Read My Account (Member Level, level spending, Point History) and the CRM customer profile
3. Add a product to the cart and open /checkout

## Expected
- Step 2: Member Level = next level; "Upgrade Reward" points = configured amount; spending = old + net total
- Step 2: the CRM customer profile shows the same level
- Step 3: the new level's basket promotion is applied instead of the old one

## Notes
Gap from the 2026-10-28 review. What a refund of the upgrading order should do to the level and reward is Q-001; run SCRM-112 style refund afterwards only to record the behavior. Spending just below the threshold (threshold - 0.10) must not upgrade: add as a boundary run if time allows.
