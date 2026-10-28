---
id: SBF-042
title: "A customer cannot open another customer's order by changing the order number in the URL"
feature: account
priority: P0
tags: [regression, security]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Order details, receipts and addresses of one customer are never visible to another customer or a guest.

## Preconditions
- Two QA members (A and B) from .env or created at runtime, each with at least one order

## Data
- Order URLs of member B, read at runtime from B's My Orders

## Steps
1. Log in as member B and copy the URL of one order detail and its Upload Receipt tab
2. Log out, log in as member A and open those URLs
3. Log out and open the same URLs as a guest
4. Use Guest Order Tracking with B's order number and A's email

## Expected
- Step 2: access denied or redirect to A's own orders; none of B's name, address, items or receipt is shown
- Step 3: redirect to /login
- Step 4: no order found

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
