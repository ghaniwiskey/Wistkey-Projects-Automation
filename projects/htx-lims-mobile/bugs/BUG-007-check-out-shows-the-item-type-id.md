---
id: BUG-007
title: "Check-out shows the item's internal id instead of its type name"
severity: trivial
status: open
env: staging
url: "handheld app: Check-out"
updated: 2026-11-19T06:32:02.877Z
found: 2026-11-19T06:32:02.877Z
foundBy: "htx-lims-web/explorations/2026-11-19-coverage-review.md"
tests: [HLM-020]
frequency: always
---
## Summary
In handheld Check-out the item card for 002000026 (type "QA high 373230", created 19/11) reads "102 · Consumable · Checked in". Pre Check-in and Check-in show "Type: QA high 373230" for the same item.

## Steps to reproduce
1. Create item type QA high 373230 and receive one item (002000026)
2. Handheld: Update all data, Check-out, enter 002000026, Find item

## Expected
Type name shown.

## Actual
Type id 102 shown, also in the Check-out list.

## Evidence
- m11.png / m13.png (handheld screenshots, 19/11 14:16)

## Environment
- Base URL: handheld app: Check-out
- Env: staging

## History
- 2026-11-19: filed from htx-lims-web/explorations/2026-11-19-coverage-review.md in the Test Manager app.
- 2026-11-19: wider than a new type: every Check-out card shows the item's internal id (002000025 99, 002000027 103, 002000028 104, 003000010 33) instead of the type; All Assets shows '<id> · Category · Type' (run 2026-11-19_1415_staging_manual).
