# Run report: storeberry-compare / exploratory-2026-10-28-promo-code-orders / staging

| Field | Value |
|---|---|
| Result | **FAIL (2 failed)** |
| Run | 2026-10-28_0516_staging_manual |
| Runner | manual |
| Base URL | https://storeberry-flower.stagingl10.storeberry.xyz/ |
| Started | 2026-10-28 05:16 |
| Duration | 0.1s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 0 | 2 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SBF-026 | Checkout drops a promotion code that became invalid after it was applied | fail | 0/2 | 0.0s | product-bug; BUG-018 | [1](screenshots/SBF-026-m01-summary-keeps-revoked-code.png) |
| SBF-027 | My Account > My Promotion Codes lists the codes assigned to the member | fail | 0/2 | 0.0s | product-bug; BUG-019 | [1](screenshots/SBF-027-m01-my-promotion-codes-404.png) |

## Failures and warnings

### SBF-026: Checkout drops a promotion code that became invalid after it was applied (fail)

- Failure type: product-bug (bug BUG-018)
- Source: `projects/storeberry-compare/cases/checkout/SBF-026-checkout-drops-a-promotion-code-that.md`
- Failed: Step 2 or 3 removes the code and shows the total without it
- Failed: The message names the code that was removed
- Note: QBgH2nw9: after revoke and shipping change still Applied, HKD 459.00; Proceed -> "Invalid promotion code."; after OK unchanged until reload.

![SBF-026](screenshots/SBF-026-m01-summary-keeps-revoked-code.png)

### SBF-027: My Account > My Promotion Codes lists the codes assigned to the member (fail)

- Failure type: product-bug (bug BUG-019)
- Source: `projects/storeberry-compare/cases/account/SBF-027-my-account-my-promotion-codes-lists-the.md`
- Failed: The page loads (no 404) and lists each assigned code with its promotion and validity
- Failed: Used codes are marked as used
- Note: Member MEMy001164526 with 2 assigned codes: /my-account/promotion-codes -> 404 Page Not Found (menu link and direct URL).

![SBF-027](screenshots/SBF-027-m01-my-promotion-codes-404.png)

## Notes

Exploration 2026-10-28: promo codes at checkout, member promotion codes page.
