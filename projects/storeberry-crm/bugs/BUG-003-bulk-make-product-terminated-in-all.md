---
id: BUG-003
title: "Bulk \"Make product terminated in all platforms\" runs without confirmation"
severity: minor
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/products"
updated: 2026-10-28T22:07:46.267Z
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: [SCRM-175]
frequency: always
---
## Summary
Selecting products and choosing Actions > "Make product terminated in all platforms" terminates them immediately with no confirm dialog, unlike customer Delete which asks "Are you sure...". With Select All this can terminate a whole page of products by a mis-click.

## Steps to reproduce
1. Open Products, search a QA product and tick its checkbox
2. Open Actions and click "Make product terminated in all platforms"

## Expected
A confirmation dialog listing how many products will be terminated.

## Actual
The product is terminated instantly (active 88 -> 87, terminated 82 -> 83) with no confirmation.

## Evidence
- QA product 3199 ASIDE-CRM-QA-qamvq1nfsl terminated this way on 2026-10-27.

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/products
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
