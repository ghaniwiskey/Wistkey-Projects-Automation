---
id: BUG-026
title: "Promotion code list mixes time zones: Staff Reserved At is 8 hours behind the other times"
severity: minor
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/promotions/edit?pid=662"
updated: 2026-10-27T22:16:41.529Z
found: 2026-10-27T22:15:45.843Z
foundBy: "explorations/2026-10-28-promo-code-orders.md"
tests: [SCRM-111]
frequency: always
---
## Summary
In Promotions > Edit > Multiple Promotion Code, assigning a code to a member fills Staff Reserved At in UTC and Member Reserved At in Hong Kong time for the same action, so the two differ by 8 hours. Created At / Updated At show Hong Kong time with a "Z" (UTC) suffix in raw ISO format (2026-10-28T06:10:26.000000Z).

## Steps to reproduce
1. Open a promotion with Multiple Promotion Code (e.g. 662) in edit mode, tab Multiple Promotion Code
2. Click Assign on a Generated code, enter an existing Member ID, Assign -> "Assigned"
3. Read the row

## Expected
Staff Reserved At and Member Reserved At show the same local time; Created/Updated At use the same readable local format without a UTC marker.

## Actual
QC39DgTk: Staff Reserved At 2026-10-27 22:11:21, Member Reserved At 2026-10-28 06:11:21, Updated At 2026-10-28T06:11:21.000000Z. Same for QCDupVR9 at 06:12:43 HKT. Similar time-zone pattern to BUG-006 (replenish times).

## Evidence
- Screenshot: ![times](../explorations/2026-10-28-promo-code-orders/07-staff-reserved-at-8h-behind.png)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/promotions/edit?pid=662
- Env: staging

## History
- 2026-10-28: filed from explorations/2026-10-28-promo-code-orders.md in the Test Manager app.
