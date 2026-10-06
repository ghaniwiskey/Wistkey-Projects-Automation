---
id: SPF-024
title: "Asset Listing (Detailed) report filters the unit's assets and exports them to Excel"
feature: reports
priority: P1
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
LOGS1 can list the unit's capitalised assets in Report > Asset Listing (Detailed), narrow them down and export the result to Excel.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active

## Data
- Asset 111000010978 (AVAILABLE, 332600 APD)

## Steps
1. Open **Report > Asset Listing (Detailed)**
2. Open the **Status** filter
3. Search **111000010978**
4. Click **Export**

## Expected
- The page heading is "Asset Listing (Detailed)" and the table shows "Showing 1 to 10 of N records" with N > 0
- The Status filter offers AVAILABLE, LOAN, MAINTENANCE, NEW, PROGRESS and TRANSFER only (no RETIRED, DISPOSED or REJECTED: the manual says retired and disposed assets are left out)
- The search shows exactly one row: 111000010978 with cost centre 332600
- Export downloads AssetListingDetailedReport_<timestamp>.xlsx with the header row (Asset ID, ..., Asset Status, ...) and exactly one data row for 111000010978 with status AVAILABLE

## Notes
Read-only.

Automated in tests/e2e/reports/asset-report.spec.ts (page object tests/pages/asset-report.page.ts).
