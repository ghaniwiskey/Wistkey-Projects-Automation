---
id: BUG-008
title: "All Assets status filter shows the count of loaded items, not of matching assets"
severity: minor
status: open
env: staging
url: "handheld app: All Assets"
updated: 2026-11-19T07:15:57.475Z
found: 2026-11-19T07:15:57.475Z
foundBy: "htx-lims-mobile run 2026-11-19 (post-deploy pass)"
tests: [HLM-018]
frequency: always
---
## Summary
With a status filter the header shows the number of matching items among those loaded so far (e.g. "7 asset(s)" for In use), while 12 items match; only after scrolling to the end does it say "All 12 asset(s) loaded". Checked out shows 13 while the server has 19 (12 No Return + 7 Loan).

## Steps to reproduce
1. All Assets > Refresh list
2. Status: In use
3. Read the count, then scroll to the end

## Expected
The count of all matching assets (12).

## Actual
"7 asset(s)", then "All 12 asset(s) loaded" after scrolling.

## Evidence
- h70.png / h73.png

## Environment
- Base URL: handheld app: All Assets
- Env: staging

## History
- 2026-11-19: filed from htx-lims-mobile run 2026-11-19 (post-deploy pass) in the Test Manager app.
