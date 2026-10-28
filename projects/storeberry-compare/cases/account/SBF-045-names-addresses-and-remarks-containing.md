---
id: SBF-045
title: "Names, addresses and remarks containing HTML are shown as plain text on the eShop and in the CRM"
feature: account
priority: P2
tags: [regression, writes, security]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customer-entered text cannot inject markup or scripts into customer or staff pages.

## Preconditions
- A QA member we created

## Data
- Text: <b>bold</b> "><img src=x onerror=alert(1)>

## Steps
1. Set the member last name, an address line and an order remark to the text
2. Place a Bank Transfer pickup order
3. Open My Account, the order detail, and in the CRM the customer, order list and order detail

## Expected
- The text is shown literally everywhere; no bold text, broken image or alert dialog
- Cleanup: void the order and restore the profile

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
