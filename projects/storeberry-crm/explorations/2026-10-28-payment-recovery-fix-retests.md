---
project: storeberry-crm
env: staging
charter: "Retest the critical flows behind the bugs the user set to verified (WebPOS online order, warehouse users, stock take) and explore around them to find regressions."
date: 2026-10-28
timebox: 25m
status: done
---

## Scope
- In scope: SCRM-092 (BUG-016), SCRM-095 (BUG-020), SCRM-030 (BUG-021); stock take create/count/review/reconcile; receipt Deny for storeberry-compare SBF-031.
- Out of scope: Save Users on warehouses (read-only), card payments.

## Coverage notes
- SCRM-095: Warehouses > TaiPo > Edit shows the "ghani" chip; get-warehouse-detail 200; no toast. Pass.
- SCRM-092: Orders > Add Order > Add Online Store Order via WebPOS (POS tab, viewport 1440x900 at DPR 1.25: screenshot pixels / 1.25 = click coordinates). Member via `#searchMemberInput`, product test 2 ($1,000 in the cart; tile says $49, storeberry-compare Q-004). Shipping 門市自取, address, 荔枝角 radio, Submit -> check-shipping 200. First Submit right after the radio click said "All Delivery info selection should be choose." (not repeated). Total 700 (basket promo), Bank Transfer, CHECK OUT -> TXN0126102800014 Pending Payment, Bank Transfer 700 outstanding. Pass; voided.
- SCRM-030: Create Job lists mapped assignees for Causeway Bay (admin123, Cashier123456, ghani, jacky, jared). Job #18: product test 2 snapshot 1, count 2, variance +1, approve 2, Reconcile (confirm "cannot be undone") -> Completed; Inventory Causeway Bay 1 -> 2; History "REPLENISHMENT +1 Stock Take #18 reconciliation". Pass.
- Open count chosen and shown on Review, but the job counts as Blind count (BUG-030, jobs #18 and #19). Created At shown in UTC on list and detail (BUG-031).
- Heuristics: retest + explore around the fix, settings carried through a multi-step wizard, time zone consistency.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Stock take created as Open count runs as Blind count | minor | bugs/BUG-030-stock-take-job-created-as-open-count.md |
| 2 | bug | Stock take Created At shown in UTC | minor | bugs/BUG-031-stock-take-created-at-is-shown-in-utc-8.md |
| 3 | risk | WebPOS shipping Submit right after picking the store once said "All Delivery info selection should be choose." | - | SCRM-092 run note |

## Test cases written
- SCRM-135 Stock take keeps Open count (P2) - fail, BUG-030
- SCRM-136 Stock take times in local time (P3) - fail, BUG-031
- Manual run `runs/2026-10-28_1155_staging_manual`: SCRM-030, SCRM-092, SCRM-095 pass (retests of BUG-021, BUG-016, BUG-020), SCRM-135 and SCRM-136 fail.

## Knowledge and data
- context.md: Stock (stock take flow), Orders (WebPOS online order now works).
- QA data: TXN0126102800014 voided; stock take #18 completed (+1 product test 2 at Causeway Bay, now 2); #19 cancelled.

## Continuation (same day): refunds, loyalty, shared stock, level-only codes
- SCRM-118: after a partial return Refund this order is gone; the next Exchange / Partial Return has a Refund pencil (Adjust balance due) that accepts any amount. 900 on 812.50 remaining (TXN0126102800015) and 2100 on a 2088 order (TXN0126102800017) both completed (BUG-032). Points went -90 and -210 and the member dropped to Level 1.
- SCRM-119: Level 1 -> Level 3 with one accepted 2,088.00 order (TXN0126102800016), +208 points, spending 88 / 3000, Gold 20% at checkout. Pass. No Upgrade Reward entry.
- SCRM-116: no mapping change needed (KN sells from Office, an Online Shop warehouse); Tee testing S-B Add To Cart cap 4 -> 3 after a KN cash sale; refunded.
- SBF-032 (eShop, partial): Level-5-only code refused for Level 1, applied after ticking Level 1; promotion 663 deleted.
- Risk: the eShop checkout's first Proceed click sometimes does nothing (second click places the order); seen again on TXN0126102800016.

| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 4 | bug | Partial return refund can be edited above the amount paid | major | bugs/BUG-032-exchange-partial-return-lets-staff.md |

- Manual run `runs/2026-10-28_1219_staging_manual`: SCRM-116 pass, SCRM-118 fail (BUG-032), SCRM-119 pass.
- QA data: TXN0126102800001 now has 1,387.50 refunded of 1,300.00 (015); TXN0126102800016 Processing with 1 C returned via 017 (2,100.00 refunded of 2,088.00); member MEMy001164526 Level 1, 648 points. POS TXN1226102800001 refunded. Promotion 663 deleted.
