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
Level thresholds (Loyalty Setting): Level 2 ## Notes
, Level 3 $2000, Level 4 $3000, Level 5 $5000 ... with carryover. 2026-10-28: a member at Level 1 showed "Member level spending: ## Notes
.00 / ## Notes
.00, Upgrade to Level 2 require: ## Notes
" and was not upgraded until an order was accepted; no Upgrade Reward points appeared when going 1 -> 3 in one order (reward config not readable on the settings page; check before expecting one).
Gap from the 2026-10-28 review. What a refund of the upgrading order should do to the level and reward is Q-001; run SCRM-112 style refund afterwards only to record the behavior. Spending just below the threshold (threshold - 0.10) must not upgrade: add as a boundary run if time allows.
