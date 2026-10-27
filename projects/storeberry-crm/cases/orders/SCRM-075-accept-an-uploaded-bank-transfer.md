---
id: SCRM-075
title: "Accept an uploaded bank transfer receipt from the order detail"
feature: orders
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Staff can approve a bank transfer payment after the customer uploads a receipt.

## Preconditions
- A QA member order paid by Bank Transfer with an uploaded receipt (status Payment Review)
- User approval to place the order

## Data
- Order found at runtime in Orders > Payment review, created by the QA member

## Steps
1. Open the order detail > Receipt tab
2. Enter a comment and click Accept > OK
3. Reload the order
4. Open eShop My Orders for that order

## Expected
- No warning is shown
- Order Status Processing, Payment Status Paid
- eShop shows the order as Processing

## Notes
Currently fails: CRM bug "Accepting a bank transfer receipt always fails" (2026-10-27). Bulk path is SCRM-048.
