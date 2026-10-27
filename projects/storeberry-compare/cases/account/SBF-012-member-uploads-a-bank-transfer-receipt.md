---
id: SBF-012
title: "Member uploads a bank transfer receipt"
feature: account
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Customers can upload payment proof for a bank transfer order.

## Preconditions
- A QA member order paid by Bank Transfer in Pending Payment (user approval to place it)

## Data
- A small PNG image

## Steps
1. My Orders > the order > Upload Receipt
2. Click Submit without a file
3. Choose the image and Submit
4. Reload the order page

## Expected
- Without a file the browser asks to select a file
- "Your receipt is successfully uploaded, and waiting for approval" with no error modal
- Status Payment Review; the receipt is visible in the CRM order Receipt tab

## Notes
Edited (…A) orders currently show a false "Whoops" modal (2026-10-27).
