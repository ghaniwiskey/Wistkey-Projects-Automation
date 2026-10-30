# Run report: storeberry-crm / member-import-protection / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-30_1452_staging_manual |
| Runner | manual |
| Base URL | https://www.stagingl10.storeberry.xyz/ |
| Started | 2026-10-30 14:52 |
| Duration | 1.4s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 1 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SCRM-165 | Member import never overwrites an existing member's points, level, spending or opt-in | pass | 3/3 | 0.0s | - | [1](screenshots/SCRM-165-m01-01-existing-before.png) [2](screenshots/SCRM-165-m02-02-import-result.png) [3](screenshots/SCRM-165-m03-03-new-member.png) [4](screenshots/SCRM-165-m04-04-new-point-history.png) [5](screenshots/SCRM-165-m05-05-existing-after.png) [6](screenshots/SCRM-165-m06-06-existing-point-history.png) |
