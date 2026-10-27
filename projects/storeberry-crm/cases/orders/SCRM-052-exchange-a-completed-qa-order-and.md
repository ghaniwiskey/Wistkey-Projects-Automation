---
id: SCRM-052
title: "Exchange a completed QA order and verify the linked exchange"
feature: orders
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-27
---

## Goal
An exchange creates a linked exchange record for a completed QA order.

## Preconditions
- A completed staging QA order is eligible for exchange and uses only QA product/contact data.

## Data
- QA order and eligible replacement item selected dynamically.

## Steps
1. Sign in to the staging CRM.
2. Open the completed QA order and choose the exchange flow.
3. Select the eligible replacement item and confirm the exchange using the staging flow.
4. Open the resulting order and its history.

## Expected
- The exchange record references the original QA order.
- The exchange shows the selected replacement item and resulting status.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Do not create shipment or fulfillment outside the staging workflow.
Exchange opens the POS in an iframe side panel on the order page (no accessibility tree; drive it via iframe.webpos-iframe contentDocument). Run 2026-10-27: exchange works, but points deduction is wrong: BUG-017.
