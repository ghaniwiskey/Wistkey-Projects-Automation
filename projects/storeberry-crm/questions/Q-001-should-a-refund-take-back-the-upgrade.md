---
id: Q-001
title: "Should a refund take back the Upgrade Reward and tier earned by the refunded sale?"
status: open
askedTo: "Product owner"
env: staging
found: 2026-10-27
foundBy: "explorations/2026-10-27-pos-order-lifecycle.md"
tests: [SCRM-086]
bugs: []
updated: 2026-10-28T02:42:45.046Z
answered: ""
---
## Question
When a sale that triggered a member upgrade is fully refunded, should the +100 point Upgrade Reward and the new tier (Silver, 15% off) be taken back?

## Context
Member MEMy001164525 (Level 2). POS cash sale TXN1126102700001 (HKD 10) on 2026-10-27 gave Point Earned +1 and Upgrade Reward +100 (500 -> 601).

Full refund (TXN1126102700001R) only reversed the 1 earned point (Refund - Transaction -1, balance 600).

The next POS sale automatically applied "Silver -$1.50" (15%), so the member keeps the reward and the tier although the purchase that earned them was refunded.

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-27-pos-order-lifecycle/01-pos-complete-points-601.png)

## Answer
Not answered yet.

## History
- 2026-10-27: asked from explorations/2026-10-27-pos-order-lifecycle.md.
