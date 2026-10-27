# Run report: storeberry-crm / exploratory-2026-10-28-promo-codes-paid-pos / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-28_0530_staging_manual |
| Runner | manual |
| Base URL | https://www.stagingl10.storeberry.xyz/ |
| Started | 2026-10-28 05:30 |
| Duration | 0.2s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 3 | 3 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SCRM-112 | Paid eShop order with a promo code earns points on the net total, and a full refund reverses points, level spending and stock | pass | 4/4 | 0.0s | - | - |
| SCRM-113 | A code marked "Cannot apply with other promotions" removes the other promotions from the basket | pass | 2/2 | 0.0s | - | - |
| SCRM-114 | A promo code limited to Online Shop is refused in Web POS | pass | 2/2 | 0.0s | - | - |

## Notes

Exploration 2026-10-28 (round 2): paid code order + refund, exclusive code, Online-only code in Web POS.
