---
id: SCRM-107
title: "Generating promotion codes is limited by the promotion code quota"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff cannot create more single-use codes than the quota set on the promotion.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code (created during the test, e.g. 662), quota Q (e.g. 2), no codes yet

## Steps
1. Open the promotion with the pencil icon (edit, not the view icon) > Multiple Promotion Code > Generate
2. Prefix QA, No. of Promotion Code = Q + 1, Generate
3. Generate again with No. = Q
4. Raise the quota by 1 in Promotion Setting, Save, and reopen

## Expected
- Step 2: "Not enough code quota to generate code"; no code is created (Total 0 | Stock Q)
- Step 3: "Success"; Q codes with the prefix, status Generated; Total Q | Stock 0
- Step 4: "Edited rule successfully." and Current Stock: 1

## Notes
2026-10-28 manual: pass (promotion 662, quota 2 -> 3 -> 5). In the view page (file icon) the Generate dialog opens but every field is read-only and nothing explains why.
