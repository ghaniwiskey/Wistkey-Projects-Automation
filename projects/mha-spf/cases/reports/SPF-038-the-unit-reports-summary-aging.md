---
id: SPF-038
title: "The unit reports (Summary, Aging, Rejection, Retirement, New Asset, Loan, Maintenance) export to Excel"
feature: reports
priority: P1
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Every table report under Report opens for LOGS1 and its Export gives a readable .xlsx with a header row (Asset Listing (Detailed) is covered by SPF-024).

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Reports: Asset Listing (Summary), Asset Registration (Aging), Asset Rejection, Asset Retirement, New Asset, Asset Loan, Asset Maintenance

## Steps
1. For each report: open it from Report, wait for the table, click **Export**

## Expected
- Each page shows its heading and a "Showing ..." line (some may have no records)
- Each Export downloads an .xlsx file that opens and has a header row

## Notes
FAVE Stocktake (Follow up) needs a FAVE and follow-up items (none on UAT yet), so it is left out.

Automated in tests/e2e/reports/asset-report.spec.ts.
