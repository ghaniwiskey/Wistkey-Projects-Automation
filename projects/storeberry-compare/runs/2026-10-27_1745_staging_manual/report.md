# Run report: storeberry-compare / exploratory-2026-10-27-promotions / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-27_1745_staging_manual |
| Runner | manual |
| Base URL | https://storeberry-flower.stagingl10.storeberry.xyz/ |
| Started | 2026-10-27 17:45 |
| Duration | 0.0s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SBF-020 | Checkout add-on offers refresh correctly after removing a cart item | fail | 0/2 | 0.0s | product-bug; BUG-013 | [1](screenshots/SBF-020-m01-stale-addon.jpg) |

## Failures and warnings

### SBF-020: Checkout add-on offers refresh correctly after removing a cart item (fail)

- Failure type: product-bug (bug BUG-013)
- Source: `projects/storeberry-compare/cases/checkout/SBF-020-checkout-add-on-offers-refresh.md`
- Failed: The "promotion" add-on lists its own Group B products (9吋公仔 A/B, 巨寶 A/B, Shoes C at HKD 100)
- Failed: No product from a promotion the cart no longer qualifies for is offered
- Note: Stale 水晶手串1 HKD 0.00 shown under "promotion" after removing product test 2 (twice).

![SBF-020](screenshots/SBF-020-m01-stale-addon.jpg)

## Notes

Exploratory: promotions at checkout
