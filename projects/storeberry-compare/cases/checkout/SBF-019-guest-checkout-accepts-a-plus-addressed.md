---
id: SBF-019
title: "Guest checkout accepts a plus-addressed email"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Valid emails such as name+tag@example.com can place an order, and invalid ones get a field-level message.

## Preconditions
- A non-quota product in the guest cart (e.g. NAKAJIMA cake)

## Data
- Guest email name+<unique>@example.com
- Shipping 門市自取, first pickup store, Bank Transfer

## Steps
1. Open /checkout as a guest and fill First Name, Last Name, Contact Number
2. Enter a plus-addressed email (name+tag@example.com) in Your Details
3. Choose 門市自取, a pickup store and an address, Bank Transfer, tick 結帳前同意
4. Click Proceed to checkout

## Expected
- The order is placed and the thank-you page shows the order number
- If an email is rejected, the message names the Email field and the reason

## Notes
Currently fails: BUG-012 (2026-10-27). Bank Transfer only.
