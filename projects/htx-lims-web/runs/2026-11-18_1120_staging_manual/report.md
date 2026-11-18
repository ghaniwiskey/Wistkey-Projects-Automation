# Run report: htx-lims-web / tag-printing-2026-11-18 / staging

| Field | Value |
|---|---|
| Result | **INCOMPLETE (1 blocked)** |
| Run | 2026-11-18_1120_staging_manual |
| Runner | manual |
| Base URL | https://htx.eastus.cloudapp.azure.com:5001/ |
| Started | 2026-11-18 11:20 |
| Duration | 0.8s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 0 | 0 | 1 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HLW-013 | Print RFID tags for a newly registered item | pass | - | 0.0s | - | [1](screenshots/HLW-013-m01-hlw-013.png) |
| HLW-038 | Label size By category picks the tag type of the item's category | blocked | - | 0.0s | Printed By category on printer "test", but the tag type used is not shown in the web (Label details, Printed list) or the Audit Trail, so Anti-Liquid / Metal / Paper cannot be checked without the printer output. Chip codes: asset 01002..., chemical and consumable 01001... (meaning not documented). | - |
| HLW-039 | Reprinting a tag issues a new chip code and retires the old tag | pass | - | 0.0s | - | [1](screenshots/HLW-039-m01-hlw-039.png) |

## Failures and warnings

### HLW-038: Label size By category picks the tag type of the item's category (blocked)

- Source: `projects/htx-lims-web/cases/tag-printing/HLW-038-label-size-by-category-picks-the-tag.md`
- Note: Printed By category on printer "test", but the tag type used is not shown in the web (Label details, Printed list) or the Audit Trail, so Anti-Liquid / Metal / Paper cannot be checked without the printer output. Chip codes: asset 01002..., chemical and consumable 01001... (meaning not documented).
