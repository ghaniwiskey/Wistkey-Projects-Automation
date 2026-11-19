---
project: storeberry-crm
env: staging
charter: Explore the Web POS buy-two-get-one-free offer with mixed prices, quantity changes, and overlapping item discounts.
date: 2026-11-19
timebox: 20m
status: done
---

## Scope
- Promotion 668 (testss), Storeberry HK and KN staging Web POS; cart only. No payment or order submission.

## Coverage notes
- KN (store 12): one HKD 520 Mix Rose (Small / Red / a) plus one HKD 100 snack01 showed a HKD 620 subtotal with no free item. Adding a second rose left both roses at HKD 520 each and reduced snack01 to HKD 0 under testss. Subtotal was HKD 1,040 before a separate HKD 300 basket discount. Returning to two units restored snack01 to HKD 100. [Mixed-price cart](2026-11-19-web-pos-buy-x-get-y/02-mixed-price.png).
- HK (store 11): three HKD 520 Mix Rose units yielded two paid lines and one free line under testss. [Rose-only cart](2026-11-19-web-pos-buy-x-get-y/01-free-item.png).
- HK: the same mixed-price basket as KN instead charged HKD 50 for snack01 under item offer named 100 and showed a HKD 1,090 subtotal before the separate HKD 300 basket discount. Reproduced after clearing and rebuilding the cart. [Overlapping offer](2026-11-19-web-pos-buy-x-get-y/03-overlapping-discount.png).

## Findings
- Core promotion works. Item-promotion precedence in the HK mixed-price cart remains a product question (Q-024), not a confirmed defect.

## Test cases written
- SCRM-183 passed in manual run 2026-11-19_1551_staging_manual.

- SCRM-184 covers the overlap; not included in the run because expected priority is unconfirmed.

## Knowledge and data
- Cleared both carts. No order placed and no promotion settings changed.


