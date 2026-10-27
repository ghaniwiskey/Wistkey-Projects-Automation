# Run report: storeberry-compare / exploratory-2026-10-27-promotions-stock / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-28_0514_staging_manual |
| Runner | manual |
| Base URL | https://storeberry-flower.stagingl10.storeberry.xyz/ |
| Started | 2026-10-28 05:14 |
| Duration | 0.1s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 1 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SBF-024 | Add To Cart refuses a quantity above online stock, including what is already in the cart | pass | 4/4 | 0.0s | - | - |
| SBF-025 | Checkout accepts the quantity that Add To Cart accepted | fail | 1/3 | 0.0s | product-bug; BUG-017 | [1](screenshots/SBF-025-m01-not-enough-stock-qty-10.png) |

## Failures and warnings

### SBF-025: Checkout accepts the quantity that Add To Cart accepted (fail)

- Failure type: product-bug (bug BUG-017)
- Source: `projects/storeberry-compare/cases/checkout/SBF-025-checkout-accepts-the-quantity-that-add-to.md`
- Failed: No "Not enough stock" on the line; Sub. Total = unit price x Q
- Failed: If the stock cannot fulfil Q, step 1 must already refuse it with the available quantity
- Note: 2026-10-27: 9 and 52 show "Not enough stock" (TaiPo 8). Evidence re-taken 2026-10-28 with TaiPo 9: qty 10 accepted by Add To Cart, checkout line "Not enough stock"; cart emptied.

![SBF-025](screenshots/SBF-025-m01-not-enough-stock-qty-10.png)

## Notes

Recorded 2026-10-28 for the 2026-10-27 evening exploration (promotions, stock limits).
