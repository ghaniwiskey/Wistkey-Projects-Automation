---
id: BUG-023
title: "Status List Details and Order links do nothing"
severity: major
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/bookings/bookings-list"
updated: 2026-10-27T11:38:01.221Z
found: 2026-10-27T11:38:01.221Z
foundBy: "explorations/2026-10-27-stock-movement.md"
tests: [SCRM-097]
frequency: always
---
## Summary
In Courses & Enrolment > Status List, the Details and Order links of every row (e.g. enrolment 388 / TXN1126102700005, and the first row of the unfiltered list) do nothing: no navigation, no dialog, no network request, no JS error, no new tab. The links are <a class="button remark hover-pointer"> without href. Staff cannot open an enrolment (for example to change its session) or jump to its order from this list.

## Steps to reproduce
1. Open Courses & Enrolment > Status List
2. Search TXN1126102700005 (or use any row)
3. Click Details, then Order

## Expected
Details opens the enrolment; Order opens the order detail.

## Actual
Nothing happens (checked 3 times: locator click, mouse click, on two different rows).

## Evidence
- Screenshot: ![status list](../explorations/2026-10-27-stock-movement/17-enrolment-details-nothing.jpg)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/bookings/bookings-list
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-stock-movement.md in the Test Manager app.
