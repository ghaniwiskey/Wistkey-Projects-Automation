# Run report: storeberry-compare / exploratory-2026-10-27-course-egift-delivery / staging

| Field | Value |
|---|---|
| Result | **FAIL (2 failed)** |
| Run | 2026-10-27_1838_staging_manual |
| Runner | manual |
| Base URL | https://storeberry-flower.stagingl10.storeberry.xyz/ |
| Started | 2026-10-27 18:38 |
| Duration | 39.0s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 3 | 1 | 2 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SBF-021 | Course page only lets customers book upcoming sessions and books the chosen one | fail | 0/2 | 0.0s | product-bug; BUG-014 | [1](screenshots/SBF-021-m01-enrolment-4-nov.jpg) |
| SBF-022 | Expired eGift cannot be reserved and the customer is told why | fail | 1/3 | 0.0s | product-bug; BUG-015 | [1](screenshots/SBF-022-m01-expired-egift.jpg) |
| SBF-023 | Member places a home-delivery order and staff deliver it | pass | 3/3 | 0.0s | - | - |

## Failures and warnings

### SBF-021: Course page only lets customers book upcoming sessions and books the chosen one (fail)

- Failure type: product-bug (bug BUG-014)
- Source: `projects/storeberry-compare/cases/courses/SBF-021-course-page-only-lets-customers-book.md`
- Failed: Past dates are disabled, or Apply is refused with a message
- Failed: If a date is accepted, the enrolment and cart show that same date
- Note: Picked 21 Oct and 14 Oct; both enrolled on 4 Nov.

![SBF-021](screenshots/SBF-021-m01-enrolment-4-nov.jpg)

### SBF-022: Expired eGift cannot be reserved and the customer is told why (fail)

- Failure type: product-bug (bug BUG-015)
- Source: `projects/storeberry-compare/cases/loyalty/SBF-022-expired-egift-cannot-be-reserved-and.md`
- Failed: A message says the gift is out of its reserve period (or Reserve is disabled)
- Failed: The API response contains no stack trace or server paths
- Note: No message; points untouched; response has a stack trace (BUG-016).

![SBF-022](screenshots/SBF-022-m01-expired-egift.jpg)

## Notes

Course, eGift, home delivery
