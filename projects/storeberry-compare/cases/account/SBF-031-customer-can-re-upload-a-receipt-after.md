---
id: SBF-031
title: "Customer can re-upload a receipt after it is denied and the order returns to Payment Review"
feature: account
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A denied payment proof does not leave the order stuck.

## Preconditions
- A QA member Bank Transfer order with an uploaded receipt that staff denied (SCRM-076)

## Steps
1. eShop My Orders > the order > Upload Receipt: upload a new image and Submit
2. CRM: open the order Receipt tab

## Expected
- Step 1: success message; the new image is shown
- Step 2: order back in Payment Review with the new receipt and Accept/Deny available

## Notes
Idea from explorations/2026-10-27-cart-payment-review.md.
