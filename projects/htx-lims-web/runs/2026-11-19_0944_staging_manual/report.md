# Run report: htx-lims-web / manual / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-11-19_0944_staging_manual |
| Runner | manual |
| Base URL | https://htx.eastus.cloudapp.azure.com:5001/ |
| Started | 2026-11-19 09:44 |
| Duration | 1.5s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 2 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HLW-049 | A newly registered item is received into stock through pre check-in, count and check-in | pass | 5/5 | 0.0s | - | [1](screenshots/HLW-049-m01-hlw-049-handheld-precheckin.png) [2](screenshots/HLW-049-m02-hlw-049-handheld-checked-in.png) [3](screenshots/HLW-049-m03-hlw-049-item-information.png) [4](screenshots/HLW-049-m04-hlw-049-stock-level.png) [5](screenshots/HLW-049-m05-hlw-049-audit.png) |
| HLW-063 | A For use item carried out through an exit gantry raises an unauthorized removal alert | pass | 3/3 | 0.0s | - | [1](screenshots/HLW-063-m01-hlw-063-dashboard.png) [2](screenshots/HLW-063-m02-hlw-063-unauthorized-log.png) |

## Notes

Untested P0s run by hand on UAT 2026-11-19 (web + handheld emulator + gantry API). Left behind: 002000025 IN Airlock 1; 003000025 OUT For use (back in Chemistry); open Unauthorized removal alert for 003000025.
