---
id: BUG-017
title: "Item Information shows nothing for status NOT PRE CHECK IN or NOT CHECKED IN"
severity: minor
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/taginfo"
updated: 2026-11-19T06:26:06.302Z
found: 2026-11-19T06:26:06.302Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-023]
frequency: always
---
## Summary
The Status filter offers NOT PRE CHECK IN and NOT CHECKED IN, but both return No Data, and searching a registered or pre checked-in item number finds nothing, although 18 items are NOT PRE CHECK IN (Item Register) and items are NOT CHECKED IN (Tagged Not Checked In). Items appear only once IN.

## Steps to reproduce
1. Inventory > Item Information
2. Status NOT PRE CHECK IN > Search
3. Search 001000038 (registered, printed)

## Expected
The items with that status are listed.

## Actual
No Data.

## Evidence
- BUG-taginfo-not-pre-check-in.png

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/taginfo
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
