---
id: BUG-028
title: "Exchange / Partial Return deducts member level spending twice the refunded amount"
severity: major
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/orders/detail?id=11018"
updated: 2026-10-28T02:43:54.012Z
found: 2026-10-28T02:41:59.593Z
foundBy: "explorations/2026-10-28-paid-order-changes.md"
tests: [SCRM-117]
frequency: always
---
## Summary
After a partial return through order detail > Exchange / Partial Return, the member level spending goes down by twice the refunded amount. Points are taken back correctly. Members lose progress toward the next level (and can be downgraded) for money they actually spent.

## Steps to reproduce
1. QA member at level spending HKD 1,042.00 (Level 2), no level threshold crossed in this test
2. eShop: order C (HKD 600) + NAKAJIMA cake (HKD 0.10), Silver 15%, Total HKD 510.00, Bank Transfer; CRM accept the receipt -> spending 1,552.00, points +51 (correct)
3. CRM order detail > Exchange / Partial Return > Online Shop; select C (share HKD 509.92), Next, Cancel the Shipping popup, Exchange & refund, Bank Transfer (refund order TXN0126102800004, HKD 510.00)
4. Read Member level spending on eShop My Account and CRM customer profile

## Expected
Level spending 1,552.00 - 510.00 = 1,042.00 (refund taken back once, as a full refund does: SCRM-112).

## Actual
Level spending 532.00 (-1,020.00 = 2 x 510). Reproduced 3 times: TXN0126102800002 (refund 487.50, spending expected 1,529.50, shown 1,042.00, member also downgraded Level 3 -> 2), TXN0126102800004 (refund 510.00, 1,552.00 -> 532.00), TXN0126102800005 (refund 0.10, 532.00 -> 531.80). Points were right each time (-49, -51, -1).

## Evidence
- ![Refund order 004 HKD 510.00](../explorations/2026-10-28-paid-order-changes/01-partial-return-refunds-full-total.png)
- Point History / level spending read on eShop My Account and CRM customers/detail?id=MEMy001164526 after each step (session notes)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/orders/detail?id=11018
- Env: staging

## History
- 2026-10-28: filed from explorations/2026-10-28-paid-order-changes.md in the Test Manager app.
