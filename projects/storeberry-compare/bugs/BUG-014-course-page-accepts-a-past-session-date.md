---
id: BUG-014
title: "Course page accepts a past session date and silently books a different session"
severity: major
status: open
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/products/qa-flow-course-2026-10-27"
updated: 2026-10-27T11:38:01.249Z
found: 2026-10-27T11:38:01.249Z
foundBy: "explorations/2026-10-27-cart-payment-review.md"
tests: [SBF-021]
frequency: always
---
## Summary
On a Fixed-schedule course page, past session dates (21 Oct, 14 Oct; marked is_passed but still clickable) show the 14:00-15:00 timeslot and Apply adds the course to the cart ("Item added successfully"). The cart and checkout never show the session date. After checkout the enrolment is booked on 4 Nov (the next bookable session), not the date the customer chose, with no message.

## Steps to reproduce
1. Log in as a member, open /products/qa-flow-course-2026-10-27 (timetable: Wednesdays 14:00-15:00)
2. Click 21 Oct (past), click 14:00 - 15:00, click Apply
3. Check out with Bank Transfer
4. In the CRM open Courses & Enrolment > Status List and search the order

## Expected
Past dates cannot be selected; the enrolment is on the date the customer chose, and the cart/checkout shows the session date.

## Actual
TXN0126102700021 (picked 21 Oct) and TXN0126102700022 (picked 14 Oct) both became enrolments for 2026-11-04 14:00-15:00 (389, 390). My Courses & Enrolment also shows 4 Nov.

## Evidence
- Screenshot: ![enrolment 4 Nov](../../storeberry-crm/explorations/2026-10-27-stock-movement/16-enrolment-past-session.jpg)

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/products/qa-flow-course-2026-10-27
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-cart-payment-review.md in the Test Manager app.
