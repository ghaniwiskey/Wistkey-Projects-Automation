---
id: SCRM-141
title: "Web POS cash drawer totals match the day's cash sales, refunds and voids"
feature: pos
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Cashiers can close the day with a cash total that matches what happened at the till.

## Preconditions
- Cash drawer selected (POS menu > Settings > Cash In Out)

## Data
- Cash only

## Steps
1. Note the drawer balance
2. Make a cash sale, a cash refund (SCRM-086) and a void (SCRM-087)
3. Record a Cash In and a Cash Out
4. Read the drawer balance / closing report and the Payment report

## Expected
- Drawer balance = start + sale - refund + cash in - cash out; the void follows the rule in Q-002
- The Payment report shows the same sale and refund amounts

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested. Related: Q-002.
