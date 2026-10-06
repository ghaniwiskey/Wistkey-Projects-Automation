---
id: BUG-015
title: "Date range messages misspell \"earlier\": \"The start date must be ealier than the end date\""
severity: trivial
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Setting/AnnouncementForm
found: 2026-10-06
foundBy: "explorations/2026-10-06-admin.md"
tests: [SPF-047]
frequency: always
---
## Summary
Typo in the start/end date validation of Settings > Announcement and User > Role Listing > Periods.

## Steps to reproduce
1. As Agency Admin, Settings > Announcement > pencil (or Role Listing > Periods > Add Period)
2. Pick a Start Date after the End Date, click Update / Submit

## Expected
"The start date must be earlier than the end date"

## Actual
"The start date must be ealier than the end date" (the end date message is spelled correctly).

## Evidence
- 

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Setting/AnnouncementForm
- Env: staging

## History
- 2026-10-06: filed from explorations/2026-10-06-admin.md in the Test Manager app.
