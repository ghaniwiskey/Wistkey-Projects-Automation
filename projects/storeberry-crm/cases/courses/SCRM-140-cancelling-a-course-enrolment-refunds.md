---
id: SCRM-140
title: "Cancelling a course enrolment refunds the customer and frees the seat"
feature: courses
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A cancelled enrolment gives the place back to other customers and the money back to the customer.

## Preconditions
- A paid QA enrolment in a session with small capacity (SCRM-096 flow)

## Data
- Bank Transfer (fn-bank-transfer)

## Steps
1. Note the session's booked/capacity
2. Cancel the enrolment (Status List) and refund the order
3. Recheck the session and order; book the session on the eShop as another QA member

## Expected
- The enrolment shows Cancelled, the order is refunded, points are reversed
- The seat count goes back down and another member can book it

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested. Related: SCRM-064.
