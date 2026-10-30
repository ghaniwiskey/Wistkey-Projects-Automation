# Run report: tung-wah-whatsapp / isolated-source-integration-retry-skip / local

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-30_1503_local_manual |
| Runner | manual |
| Base URL | http://localhost:3000/ |
| Started | 2026-10-30 15:03 |
| Duration | 59.4s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 2 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| TWW-091 | Failed contacts are retried on the next send and sent contacts are not | pass | 4/4 | 0.0s | - | - |
| TWW-126 | Resending a reset contact skips other sent, delivered and read contacts | pass | 3/3 | 0.0s | - | - |

## Notes

Two controlled source-integration cases passed; 10 assertions. Actual send/reset/queue code at app commit 1cdd076, mocked in-memory Prisma/auth and Twilio. Zero real messages or DB writes. Evidence/harness: explorations/2026-10-30-retry-skip/. No live UI/provider verification or concurrent-send test was performed.
